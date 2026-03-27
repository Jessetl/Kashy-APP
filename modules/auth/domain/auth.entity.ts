export type {
  AuthSession,
  AuthTokens,
  AuthUser,
} from '@/shared/domain/auth/auth.types';

/**
 * Tipo propio del módulo auth — solo usado por el flujo de login.
 * No pertenece a shared/ porque solo lo consume este módulo.
 */
export interface LoginCredentials {
  email: string;
  password: string;
}
