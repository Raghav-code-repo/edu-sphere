import type {
  Notification,
  NotificationCategory,
  NotificationPreference,
} from '@/types/shared/notifications';
import { environment } from '@/config/environment';
import { sharedNotificationService } from '@/services/mock/sharedNotificationService';
import { getApiClient } from './apiClient';

export interface NotificationApiService {
  getNotifications(): Promise<Notification[]>;
  getUnreadCount(): Promise<number>;
  markAsRead(id: string): Promise<Notification[]>;
  markAllAsRead(): Promise<Notification[]>;
  deleteNotification(id: string): Promise<Notification[]>;
  getPreferences(): Promise<NotificationPreference[]>;
  updatePreferences(preferences: NotificationPreference[]): Promise<NotificationPreference[]>;
  getByCategory(category: NotificationCategory): Promise<Notification[]>;
}

class NotificationApi implements NotificationApiService {
  private readonly client = getApiClient();

  async getNotifications(): Promise<Notification[]> {
    return this.client.get<Notification[]>('/api/notifications');
  }

  async getUnreadCount(): Promise<number> {
    return this.client.get<number>('/api/notifications/unread-count');
  }

  async markAsRead(id: string): Promise<Notification[]> {
    return this.client.patch<Notification[]>(`/api/notifications/${id}/read`, {});
  }

  async markAllAsRead(): Promise<Notification[]> {
    return this.client.patch<Notification[]>('/api/notifications/read-all', {});
  }

  async deleteNotification(id: string): Promise<Notification[]> {
    return this.client.delete<Notification[]>(`/api/notifications/${id}`);
  }

  async getPreferences(): Promise<NotificationPreference[]> {
    return this.client.get<NotificationPreference[]>('/api/notifications/preferences');
  }

  async updatePreferences(
    preferences: NotificationPreference[]
  ): Promise<NotificationPreference[]> {
    return this.client.put<NotificationPreference[]>('/api/notifications/preferences', preferences);
  }

  async getByCategory(category: NotificationCategory): Promise<Notification[]> {
    return this.client.get<Notification[]>('/api/notifications/category', {
      params: { category },
    });
  }
}

class MockNotificationApi implements NotificationApiService {
  async getNotifications() {
    return sharedNotificationService.getNotifications();
  }
  async getUnreadCount() {
    return sharedNotificationService.getUnreadCount();
  }
  async markAsRead(id: string) {
    return sharedNotificationService.markAsRead(id);
  }
  async markAllAsRead() {
    return sharedNotificationService.markAllAsRead();
  }
  async deleteNotification(id: string) {
    return sharedNotificationService.deleteNotification(id);
  }
  async getPreferences() {
    return sharedNotificationService.getPreferences();
  }
  async updatePreferences(preferences: NotificationPreference[]) {
    return sharedNotificationService.updatePreferences(preferences);
  }
  async getByCategory(category: NotificationCategory) {
    return sharedNotificationService.getByCategory(category);
  }
}

export const notificationApi: NotificationApiService = environment.useMockApi
  ? new MockNotificationApi()
  : new NotificationApi();
