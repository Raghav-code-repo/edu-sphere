import type {
  Announcement,
  AnnouncementCategory,
  AnnouncementStatus,
} from '@/types/shared/announcements';
import { environment } from '@/config/environment';
import { sharedAnnouncementService } from '@/services/mock/sharedAnnouncementService';
import { getApiClient } from './apiClient';

export interface AnnouncementApiService {
  getAnnouncements(filters?: {
    category?: string;
    status?: string;
    search?: string;
  }): Promise<Announcement[]>;
  getAnnouncement(id: string): Promise<Announcement | undefined>;
  createAnnouncement(
    announcement: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Announcement>;
  updateAnnouncement(
    id: string,
    announcement: Partial<Announcement>
  ): Promise<Announcement | undefined>;
  deleteAnnouncement(id: string): Promise<void>;
  getByCategory(category: AnnouncementCategory): Promise<Announcement[]>;
  getByStatus(status: AnnouncementStatus): Promise<Announcement[]>;
}

class AnnouncementApi implements AnnouncementApiService {
  private readonly client = getApiClient();

  async getAnnouncements(filters?: {
    category?: string;
    status?: string;
    search?: string;
  }): Promise<Announcement[]> {
    return this.client.get<Announcement[]>('/api/announcements', { params: filters });
  }

  async getAnnouncement(id: string): Promise<Announcement | undefined> {
    return this.client.get<Announcement>(`/api/announcements/${id}`);
  }

  async createAnnouncement(
    announcement: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<Announcement> {
    return this.client.post<Announcement>('/api/announcements', announcement);
  }

  async updateAnnouncement(
    id: string,
    announcement: Partial<Announcement>
  ): Promise<Announcement | undefined> {
    return this.client.put<Announcement | undefined>(`/api/announcements/${id}`, announcement);
  }

  async deleteAnnouncement(id: string): Promise<void> {
    await this.client.delete(`/api/announcements/${id}`);
  }

  async getByCategory(category: AnnouncementCategory): Promise<Announcement[]> {
    return this.client.get<Announcement[]>('/api/announcements', {
      params: { category },
    });
  }

  async getByStatus(status: AnnouncementStatus): Promise<Announcement[]> {
    return this.client.get<Announcement[]>('/api/announcements', {
      params: { status },
    });
  }
}

class MockAnnouncementApi implements AnnouncementApiService {
  async getAnnouncements(filters?: { category?: string; status?: string; search?: string }) {
    return sharedAnnouncementService.getAnnouncements(filters);
  }
  async getAnnouncement(id: string) {
    return sharedAnnouncementService.getAnnouncement(id);
  }
  async createAnnouncement(announcement: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>) {
    return sharedAnnouncementService.createAnnouncement(
      announcement as Parameters<typeof sharedAnnouncementService.createAnnouncement>[0]
    );
  }
  async updateAnnouncement(id: string, announcement: Partial<Announcement>) {
    return sharedAnnouncementService.updateAnnouncement(id, announcement);
  }
  async deleteAnnouncement(id: string) {
    return sharedAnnouncementService.deleteAnnouncement(id);
  }
  async getByCategory(category: AnnouncementCategory) {
    const results = await sharedAnnouncementService.getAnnouncements({ category });
    return results;
  }
  async getByStatus(status: AnnouncementStatus) {
    const results = await sharedAnnouncementService.getAnnouncements({ status });
    return results;
  }
}

export const announcementApi: AnnouncementApiService = environment.useMockApi
  ? new MockAnnouncementApi()
  : new AnnouncementApi();
