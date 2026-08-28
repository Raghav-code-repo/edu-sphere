export type NotificationCategory =
  'academic' | 'attendance' | 'assignment' | 'exam' | 'fees' | 'announcement' | 'system';

export type NotificationPreference = {
  category: NotificationCategory;
  enabled: boolean;
  email: boolean;
  push: boolean;
};

export interface Notification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: Record<string, string>;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreference[];
}

export type NotificationAction =
  | { type: 'markAsRead'; id: string }
  | { type: 'markAllAsRead' }
  | { type: 'delete'; id: string }
  | { type: 'setNotifications'; notifications: Notification[] }
  | { type: 'updatePreferences'; preferences: NotificationPreference[] };

export function notificationReducer(
  state: NotificationState,
  action: NotificationAction
): NotificationState {
  switch (action.type) {
    case 'markAsRead':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.id ? { ...n, read: true } : n
        ),
        unreadCount: state.notifications.filter((n) => n.id !== action.id && !n.read).length,
      };
    case 'markAllAsRead':
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      };
    case 'delete':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.id),
        unreadCount: state.notifications.filter((n) => n.id !== action.id && !n.read).length,
      };
    case 'setNotifications':
      return {
        ...state,
        notifications: action.notifications,
        unreadCount: action.notifications.filter((n) => !n.read).length,
      };
    case 'updatePreferences':
      return { ...state, preferences: action.preferences };
    default:
      return state;
  }
}
