/** Tokens de autenticación */
export interface AuthTokens {
  idToken: string;
  refreshToken: string;
  expiresIn: string;
}

/** Usuario autenticado */
export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  firebaseUid: string;
}

/** Respuesta completa del login (tokens + usuario) */
export interface AuthSession {
  tokens: AuthTokens;
  user?: AuthUser | null;
}
