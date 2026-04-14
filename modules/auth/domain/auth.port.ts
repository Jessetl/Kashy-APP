import type {
  AuthSession,
  AuthTokens,
  GoogleAuthCredentials,
  LoginCredentials,
  RegisterCredentials,
} from './auth.entity';

/** Puerto (contrato) que define las operaciones de autenticación */
export interface AuthPort {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  register(credentials: RegisterCredentials): Promise<void>;
  googleAuth(credentials: GoogleAuthCredentials): Promise<AuthSession>;
  refreshToken(refreshToken: string): Promise<AuthTokens>;
}
