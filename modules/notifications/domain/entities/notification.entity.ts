/**
 * Tipo de notificación — coincide con los toggles de `notification_preferences`
 * del backend (ARCHITECTURE_MASTER.md §6.1).
 */
export type NotificationType =
  | 'debt_due_reminder' // Recordatorio de deuda próxima a vencer (≤ 24h)
  | 'debt_overdue' // Deuda vencida y no pagada
  | 'collection_due_reminder' // Recordatorio de cobro próximo a vencer
  | 'list_reminder' // Lista activa sin actividad reciente
  | 'price_alert'; // Variación significativa de la tasa

export type NotificationSeverity = 'info' | 'warning' | 'danger' | 'success';

export interface AppNotification {
  /** ID estable derivado del origen — permite deduplicar entre renders */
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  /** ISO string — cuándo "ocurrió" la notificación (ej. fecha de vencimiento) */
  createdAt: string;
  severity: NotificationSeverity;
  /** ID de la entidad relacionada (ej. debt.id, shopping_list.id) para deep-link */
  relatedId?: string;
}

/** Devuelve el icono de lucide-react-native correspondiente al tipo */
export function getNotificationIconKey(type: NotificationType): string {
  switch (type) {
    case 'debt_due_reminder':
      return 'clock';
    case 'debt_overdue':
      return 'alert-triangle';
    case 'collection_due_reminder':
      return 'hand-coins';
    case 'list_reminder':
      return 'shopping-cart';
    case 'price_alert':
      return 'trending-up';
  }
}
