import type { AuthTokens } from '@/shared/domain/auth/auth.types';
import { ApiHttpError } from '@/shared/infrastructure/api/api-http-error';
import type {
  ApiResponse,
  RequestOptions,
} from '@/shared/infrastructure/api/api.types';
import { extractAuthTokens } from '@/shared/infrastructure/api/auth-token-parser';
import {
  parseApiPayload,
  resolveErrorMessage,
} from '@/shared/infrastructure/api/response-parser';
import {
  clearSessionSync,
  getAccessToken,
  getRefreshToken,
  updateTokensSync,
} from '@/shared/infrastructure/auth/auth.store';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

// Mutex para evitar múltiples refresh simultáneos
let isRefreshing = false;
let refreshPromise: Promise<AuthTokens | null> | null = null;

async function attemptRefresh(): Promise<AuthTokens | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/users/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as unknown;
    const tokens = extractAuthTokens(payload);

    if (!tokens) {
      return null;
    }

    updateTokensSync(tokens);
    return tokens;
  } catch {
    return null;
  }
}

/** Ejecuta refresh una sola vez aunque se llame varias veces en paralelo */
function refreshTokenOnce(): Promise<AuthTokens | null> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = attemptRefresh().finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });

  return refreshPromise;
}

async function executeRequest(
  path: string,
  options: RequestOptions = {},
): Promise<Response> {
  const { method = 'GET', body, headers = {}, token, skipAuth } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...headers,
  };

  // Auto-attach token si no se pasa uno explícito y no es skipAuth
  if (!skipAuth) {
    const authToken = token ?? getAccessToken();
    if (authToken) {
      requestHeaders['Authorization'] = `Bearer ${authToken}`;
    }
  }

  return fetch(`${API_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * Cliente HTTP con auto-auth y refresh silencioso.
 *
 * - Adjunta el accessToken automáticamente a cada request.
 * - Si recibe 401, intenta refresh y reintenta el request original UNA vez.
 * - Si el refresh falla, limpia la sesión (vuelve a guest mode).
 * - Usa mutex para evitar múltiples refresh simultáneos.
 */
export async function apiClient<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  let response = await executeRequest(path, options);

  // Si es 401 y no es una request de auth (login/refresh), intentar refresh
  if (response.status === 401 && !options.skipAuth) {
    const newTokens = await refreshTokenOnce();

    if (newTokens?.idToken) {
      // Reintentar con el nuevo token
      response = await executeRequest(path, {
        ...options,
        token: newTokens.idToken,
      });
    } else {
      // Refresh falló — sesión inválida, volver a guest
      clearSessionSync();
    }
  }

  const rawPayload = (await response.json()) as unknown;
  const parsedPayload = parseApiPayload<T>(rawPayload);

  if (!response.ok) {
    const parsedError = resolveErrorMessage(parsedPayload);

    throw new ApiHttpError({
      message: parsedError.message,
      status: response.status,
      statusCode: parsedError.statusCode,
      code: parsedError.code,
      timestamp: parsedError.timestamp,
    });
  }

  return {
    success: parsedPayload.successPayload.success ?? response.ok,
    data: parsedPayload.data,
    timestamp:
      parsedPayload.successPayload.timestamp ?? new Date().toISOString(),
    ok: response.ok,
    status: response.status,
  };
}
