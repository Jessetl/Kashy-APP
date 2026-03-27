import type {
  AuthSession,
  AuthTokens,
  AuthUser,
} from '@/shared/domain/auth/auth.types';
import { mmkvZustandStorage } from '@/shared/infrastructure/storage/app-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthState {
  /** Si el usuario está autenticado */
  isAuthenticated: boolean;
  /** Datos del usuario autenticado */
  user: AuthUser | null;
  /** Access token actual */
  accessToken: string | null;
  /** Refresh token para renovar la sesión */
  refreshToken: string | null;
  /** Si la sesión se está restaurando al abrir la app */
  isRestoringSession: boolean;
  /** Si el modal de login está visible */
  isLoginModalVisible: boolean;

  /** Guarda la sesión completa tras login exitoso */
  setSession: (session: AuthSession) => void;
  /** Actualiza solo los tokens (tras refresh) */
  updateTokens: (tokens: AuthTokens) => void;
  /** Limpia toda la sesión (logout) */
  clearSession: () => void;
  /** Marca que la restauración terminó */
  setRestoringSession: (value: boolean) => void;
  /** Abre el modal de login */
  openLoginModal: () => void;
  /** Cierra el modal de login */
  closeLoginModal: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      isRestoringSession: true,
      isLoginModalVisible: false,

      setSession: (session: AuthSession) =>
        set({
          isAuthenticated: true,
          user: session.user ?? null,
          accessToken: session.tokens.idToken,
          refreshToken: session.tokens.refreshToken,
          isLoginModalVisible: false,
        }),

      updateTokens: (tokens: AuthTokens) =>
        set({
          accessToken: tokens.idToken,
          refreshToken: tokens.refreshToken,
        }),

      clearSession: () =>
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        }),

      setRestoringSession: (value: boolean) =>
        set({ isRestoringSession: value }),

      openLoginModal: () => set({ isLoginModalVisible: true }),
      closeLoginModal: () => set({ isLoginModalVisible: false }),
    }),
    {
      name: 'auth-session',
      storage: createJSONStorage(() => mmkvZustandStorage),
      // Solo persistir datos de sesión, no estados UI transitorios
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);

// --- Selectores para uso fuera de React (api-client, interceptors) ---

/** Obtiene el access token actual de forma síncrona */
export function getAccessToken(): string | null {
  return useAuthStore.getState().accessToken;
}

/** Obtiene el refresh token actual de forma síncrona */
export function getRefreshToken(): string | null {
  return useAuthStore.getState().refreshToken;
}

/** Actualiza tokens de forma síncrona (para el interceptor) */
export function updateTokensSync(tokens: AuthTokens): void {
  useAuthStore.getState().updateTokens(tokens);
}

/** Limpia sesión de forma síncrona (para el interceptor cuando refresh falla) */
export function clearSessionSync(): void {
  useAuthStore.getState().clearSession();
}
