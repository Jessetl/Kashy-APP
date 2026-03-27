import type { AuthTokens } from '@/shared/domain/auth/auth.types';

import type { ApiEnvelope } from './api.types';

interface TokenCandidate {
  idToken?: string;
  refreshToken?: string;
  expiresIn?: string;
}

function isTokenCandidate(value: unknown): value is TokenCandidate {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.idToken === 'string' &&
    typeof candidate.refreshToken === 'string'
  );
}

export function extractAuthTokens(payload: unknown): AuthTokens | null {
  const envelope = payload as Partial<ApiEnvelope<unknown>>;
  const innerData = envelope?.data;

  let candidate: TokenCandidate | null = null;
  if (isTokenCandidate(payload)) {
    candidate = payload;
  } else if (isTokenCandidate(innerData)) {
    candidate = innerData;
  }

  if (!candidate) return null;

  const idToken = candidate.idToken;
  const refreshToken = candidate.refreshToken;
  const expiresIn = candidate.expiresIn ?? '3600';

  if (!idToken || !refreshToken) return null;

  return { idToken, refreshToken, expiresIn };
}
