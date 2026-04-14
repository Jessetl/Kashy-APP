import { create } from 'zustand';

/**
 * Store ligero — solo mantiene qué notificaciones marcó el usuario como leídas.
 * La lista de notificaciones en sí se deriva en tiempo real de los otros stores
 * (debts, shopping lists, exchange rate) vía `useNotifications()`.
 *
 * Nota: los readIds viven en memoria y se reinician al cerrar la app. Es un
 * compromiso aceptable para el MVP dado que las notificaciones se re-derivan
 * de fuentes vivas — el usuario puede descartarlas de nuevo si aparecen otra vez.
 */
interface NotificationState {
  /** IDs de notificaciones marcadas como leídas */
  readIds: Set<string>;

  markAsRead: (id: string) => void;
  markAllAsRead: (ids: string[]) => void;
  reset: () => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  readIds: new Set<string>(),

  markAsRead: (id) =>
    set((state) => {
      const next = new Set(state.readIds);
      next.add(id);
      return { readIds: next };
    }),

  markAllAsRead: (ids) =>
    set((state) => {
      const next = new Set(state.readIds);
      for (const id of ids) next.add(id);
      return { readIds: next };
    }),

  reset: () => set({ readIds: new Set<string>() }),
}));
