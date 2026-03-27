import { apiClient } from '@/shared/infrastructure/api';

import type {
  AuthSession,
  AuthTokens,
  AuthUser,
  LoginCredentials,
} from '../domain/auth.entity';
import type { AuthPort } from '../domain/auth.port';

interface AuthApiPayload {
  idToken?: string;
  refreshToken?: string;
  expiresIn?: string;
  user?: AuthUser;
}

function toAuthTokens(payload: unknown): AuthTokens {
  const authData = payload as AuthApiPayload;
  const idToken = authData.idToken;
  const refreshToken = authData.refreshToken;
  const expiresIn = authData.expiresIn ?? '3600';

  if (!idToken || !refreshToken) {
    throw new Error('Respuesta de autenticación inválida');
  }

  return { idToken, refreshToken, expiresIn };
}

/** Implementación del puerto de autenticación usando fetch via apiClient */
export class AuthDatasource implements AuthPort {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const response = await apiClient<AuthApiPayload>('/users/login', {
      method: 'POST',
      body: credentials,
      skipAuth: true,
    });

    const authData = response.data;
    return {
      tokens: toAuthTokens(authData),
      user: authData.user ?? null,
    };
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const response = await apiClient<AuthApiPayload>('/users/refresh', {
      method: 'POST',
      body: { refreshToken },
      skipAuth: true,
    });

    return toAuthTokens(response.data);
  }
}
