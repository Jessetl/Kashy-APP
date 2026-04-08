import { ApiHttpError } from '@/shared/infrastructure/api';
import { useAuthStore } from '@/shared/infrastructure/auth/auth.store';
import { useCallback, useState } from 'react';

import { LoginUseCase } from '../../application/login.use-case';
import type { LoginCredentials } from '../../domain/auth.entity';
import { AuthDatasource } from '../../infrastructure/auth.datasource';

interface UseLoginReturn {
  isLoading: boolean;
  error: string | null;
  submitLogin: (credentials: LoginCredentials) => Promise<void>;
  clearError: () => void;
}

const loginUseCase = new LoginUseCase(new AuthDatasource());

function getLoginErrorMessage(err: unknown): string {
  if (err instanceof ApiHttpError) {
    if (err.code === 'AUTH_INVALID_CREDENTIALS') {
      return 'Correo o contraseña inválidos';
    }

    return err.message;
  }

  return err instanceof Error ? err.message : 'Error al iniciar sesión';
}

export function useLogin(onSuccess?: () => void): UseLoginReturn {
  const setSession = useAuthStore((s) => s.setSession);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const submitLogin = useCallback(
    async (credentials: LoginCredentials) => {
      setError(null);
      setIsLoading(true);

      try {
        const session = await loginUseCase.execute(credentials);
        // Guardar sesión en store persistido
        setSession(session);
        onSuccess?.();
      } catch (err) {
        const message = getLoginErrorMessage(err);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess, setSession],
  );

  return {
    isLoading,
    error,
    submitLogin,
    clearError,
  };
}
