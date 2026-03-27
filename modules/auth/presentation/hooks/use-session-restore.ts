import { ApiHttpError } from '@/shared/infrastructure/api';
import { useAuthStore } from '@/shared/infrastructure/auth/auth.store';
import { useEffect } from 'react';

import { RefreshTokenUseCase } from '../../application/refresh-token.use-case';
import { AuthDatasource } from '../../infrastructure/auth.datasource';

const refreshUseCase = new RefreshTokenUseCase(new AuthDatasource());

/**
 * Hook que restaura la sesión al montar la app.
 *
 * Si hay un refreshToken guardado en MMKV, intenta renovar los tokens
 * silenciosamente. Si falla, limpia la sesión (vuelve a guest).
 * En cualquier caso, marca `isRestoringSession = false` al terminar.
 */
export function useSessionRestore(): void {
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const updateTokens = useAuthStore((s) => s.updateTokens);
  const clearSession = useAuthStore((s) => s.clearSession);
  const setRestoringSession = useAuthStore((s) => s.setRestoringSession);

  useEffect(() => {
    async function restore() {
      // Si no hay sesión previa, no hay nada que restaurar
      if (!isAuthenticated || !refreshToken) {
        setRestoringSession(false);
        return;
      }

      try {
        const newTokens = await refreshUseCase.execute(refreshToken);
        updateTokens(newTokens);
      } catch (err) {
        if (err instanceof ApiHttpError && err.status >= 500) {
          // Si el backend está caído, por seguridad mantenemos flujo guest.
        }
        // Refresh falló — sesión expirada, volver a guest
        clearSession();
      } finally {
        setRestoringSession(false);
      }
    }

    restore();
    // Solo ejecutar al montar la app
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
