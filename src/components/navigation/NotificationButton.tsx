import { useState } from 'react';
import { NotificationCenter } from '@/features/shared';
import { notificationApi } from '@/services/api/notificationApi';
import type { Notification } from '@/types/shared/notifications';

export function NotificationButton() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <NotificationCenter
      notifications={notifications}
      unreadCount={unreadCount}
      onMarkAsRead={async (id) => {
        await notificationApi.markAsRead(id);
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }}
      onMarkAllAsRead={async () => {
        await notificationApi.markAllAsRead();
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        setUnreadCount(0);
      }}
    />
  );
}
