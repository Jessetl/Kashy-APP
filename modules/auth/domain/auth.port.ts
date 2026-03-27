import type { AuthSession, AuthTokens, LoginCredentials } from './auth.entity';

/** Puerto (contrato) que define las operaciones de autenticación */
export interface AuthPort {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  refreshToken(refreshToken: string): Promise<AuthTokens>;
}
