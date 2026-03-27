import type { AuthUser } from '@/shared/domain/auth/auth.types';
import { useAuthStore } from '@/shared/infrastructure/auth/auth.store';
import { useCallback } from 'react';

interface UseAuthReturn {
  /** Si el usuario está autenticado */
  isAuthenticated: boolean;
  /** Datos del usuario o null si es guest */
  user: AuthUser | null;
  /** Si se está restaurando la sesión al abrir la app */
  isRestoringSession: boolean;
  /** Cierra la sesión y limpia datos persistidos */
  logout: () => void;
  /** Abre el modal de login */
  openLoginModal: () => void;
}

export function useAuth(): UseAuthReturn {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const isRestoringSession = useAuthStore((s) => s.isRestoringSession);
  const clearSession = useAuthStore((s) => s.clearSession);
  const openLoginModal = useAuthStore((s) => s.openLoginModal);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  return {
    isAuthenticated,
    user,
    isRestoringSession,
    logout,
    openLoginModal,
  };
}
