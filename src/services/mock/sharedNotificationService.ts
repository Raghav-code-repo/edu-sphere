import type {
  Notification,
  NotificationCategory,
  NotificationPreference,
} from '@/types/shared/notifications';

const CATEGORIES: NotificationCategory[] = [
  'academic',
  'attendance',
  'assignment',
  'exam',
  'fees',
  'announcement',
  'system',
];

const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Assignment Due Tomorrow',
    message: 'Your Binary Tree Implementation assignment is due tomorrow.',
    category: 'assignment',
    read: false,
    createdAt: formatDate(addDays(today, 0)),
    actionUrl: '/student/assignments',
  },
  {
    id: 'n2',
    title: 'New Grade Posted',
    message: 'Your Science exam grade has been posted.',
    category: 'exam',
    read: false,
    createdAt: formatDate(addDays(today, -1)),
    actionUrl: '/student/grades',
  },
  {
    id: 'n3',
    title: 'Attendance Alert',
    message: 'You have been marked absent for Database Management Systems.',
    category: 'attendance',
    read: false,
    createdAt: formatDate(addDays(today, -1)),
    actionUrl: '/student/attendance',
  },
  {
    id: 'n4',
    title: 'Fee Payment Due',
    message: 'Your semester fee payment is due in 5 days.',
    category: 'fees',
    read: true,
    createdAt: formatDate(addDays(today, -2)),
    actionUrl: '/student/fees',
  },
  {
    id: 'n5',
    title: 'New Announcement',
    message: 'Mid-Term Examination Schedule has been released.',
    category: 'announcement',
    read: true,
    createdAt: formatDate(addDays(today, -3)),
    actionUrl: '/student/announcements',
  },
  {
    id: 'n6',
    title: 'System Maintenance',
    message: 'The portal will be down for maintenance on Sunday.',
    category: 'system',
    read: true,
    createdAt: formatDate(addDays(today, -4)),
  },
  {
    id: 'n7',
    title: 'New Course Material',
    message: 'New lecture notes have been uploaded for Data Structures.',
    category: 'academic',
    read: false,
    createdAt: formatDate(addDays(today, -5)),
    actionUrl: '/student/courses',
  },
];

const DEFAULT_PREFERENCES: NotificationPreference[] = CATEGORIES.map((category) => ({
  category,
  enabled: true,
  email: true,
  push: true,
}));

export class SharedNotificationService {
  private getDelay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getNotifications(): Promise<Notification[]> {
    await this.getDelay(400);
    return [...NOTIFICATIONS];
  }

  async getUnreadCount(): Promise<number> {
    await this.getDelay(200);
    return NOTIFICATIONS.filter((n) => !n.read).length;
  }

  async markAsRead(id: string): Promise<Notification[]> {
    await this.getDelay(200);
    const notification = NOTIFICATIONS.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
    }
    return [...NOTIFICATIONS];
  }

  async markAllAsRead(): Promise<Notification[]> {
    await this.getDelay(300);
    NOTIFICATIONS.forEach((n) => (n.read = true));
    return [...NOTIFICATIONS];
  }

  async deleteNotification(id: string): Promise<Notification[]> {
    await this.getDelay(200);
    const index = NOTIFICATIONS.findIndex((n) => n.id === id);
    if (index > -1) {
      NOTIFICATIONS.splice(index, 1);
    }
    return [...NOTIFICATIONS];
  }

  async getPreferences(): Promise<NotificationPreference[]> {
    await this.getDelay(300);
    return [...DEFAULT_PREFERENCES];
  }

  async updatePreferences(
    preferences: NotificationPreference[]
  ): Promise<NotificationPreference[]> {
    await this.getDelay(300);
    DEFAULT_PREFERENCES.length = 0;
    DEFAULT_PREFERENCES.push(...preferences);
    return [...DEFAULT_PREFERENCES];
  }

  async getByCategory(category: NotificationCategory): Promise<Notification[]> {
    await this.getDelay(300);
    return NOTIFICATIONS.filter((n) => n.category === category);
  }
}

export const sharedNotificationService = new SharedNotificationService();
