import { ApiHttpError } from '@/shared/infrastructure/api';
import { useAuthStore } from '@/shared/infrastructure/auth/auth.store';
import { useCallback, useState } from 'react';

import { LoginUseCase } from '../../application/login.use-case';
import { AuthDatasource } from '../../infrastructure/auth.datasource';

interface UseLoginReturn {
  email: string;
  password: string;
  isLoading: boolean;
  error: string | null;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  handleLogin: () => Promise<void>;
  clearError: () => void;
  resetForm: () => void;
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

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setError(null);
    setIsLoading(false);
  }, []);

  const handleLogin = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const session = await loginUseCase.execute({ email, password });
      // Guardar sesión en store persistido (MMKV)
      setSession(session);
      onSuccess?.();
    } catch (err) {
      const message = getLoginErrorMessage(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [email, password, onSuccess, setSession]);

  return {
    email,
    password,
    isLoading,
    error,
    setEmail,
    setPassword,
    handleLogin,
    clearError,
    resetForm,
  };
}
