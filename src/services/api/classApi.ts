import type { FacultyClass } from '@/types/faculty';
import type { AdminClass } from '@/types/admin';
import { environment } from '@/config/environment';
import { facultyMockService } from '@/services/mock/facultyMockService';
import { adminMockService } from '@/services/mock/adminMockService';
import { getApiClient } from './apiClient';

export interface ClassApiService {
  getClasses(): Promise<FacultyClass[]>;
  getClass(id: string): Promise<FacultyClass | undefined>;
  getTodayClasses(): Promise<import('@/types/faculty').TodayClass[]>;
  getAdminClasses(_filters?: unknown): Promise<unknown>;
  createClass(cls: Partial<AdminClass>): Promise<AdminClass>;
  updateClass(id: string, cls: Partial<AdminClass>): Promise<AdminClass>;
  deleteClass(id: string): Promise<void>;
}

class ClassApi implements ClassApiService {
  private readonly client = getApiClient();

  async getClasses(): Promise<FacultyClass[]> {
    return this.client.get<FacultyClass[]>('/api/faculty/classes');
  }

  async getClass(id: string): Promise<FacultyClass | undefined> {
    return this.client.get<FacultyClass>(`/api/faculty/classes/${id}`);
  }

  async getTodayClasses(): Promise<import('@/types/faculty').TodayClass[]> {
    return this.client.get<import('@/types/faculty').TodayClass[]>('/api/faculty/classes/today');
  }

  async getAdminClasses(_filters?: unknown): Promise<unknown> {
    return this.client.get<unknown>('/api/admin/classes');
  }

  async createClass(cls: Partial<AdminClass>): Promise<AdminClass> {
    return this.client.post<AdminClass>('/api/admin/classes', cls);
  }

  async updateClass(id: string, cls: Partial<AdminClass>): Promise<AdminClass> {
    return this.client.put<AdminClass>(`/api/admin/classes/${id}`, cls);
  }

  async deleteClass(id: string): Promise<void> {
    await this.client.delete(`/api/admin/classes/${id}`);
  }
}

class MockClassApi implements ClassApiService {
  async getClasses() {
    return facultyMockService.getClasses();
  }
  async getClass(id: string) {
    return facultyMockService.getClasses().then((classes) => classes.find((c) => c.id === id));
  }
  async getTodayClasses() {
    return facultyMockService.getTodayClasses();
  }
  async getAdminClasses() {
    return Promise.resolve({ data: [], total: 0, page: 1, pageSize: 10, totalPages: 1 });
  }
  async createClass(cls: Partial<AdminClass>) {
    return adminMockService.createClass(cls);
  }
  async updateClass(id: string, cls: Partial<AdminClass>) {
    return adminMockService.updateClass(id, cls);
  }
  async deleteClass(id: string) {
    return adminMockService.deleteClass(id);
  }
}

export const classApi: ClassApiService = environment.useMockApi
  ? new MockClassApi()
  : new ClassApi();
