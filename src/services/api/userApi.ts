import type { AdminUser, AdminStudent, AdminParent, AdminFaculty } from '@/types/admin';
import type { PaginatedResponse } from './apiTypes';
import { environment } from '@/config/environment';
import { adminMockService } from '@/services/mock/adminMockService';
import { getApiClient } from './apiClient';

export interface UserApiService {
  getUsers(_filters?: unknown): Promise<PaginatedResponse<AdminUser>>;
  getUser(id: string): Promise<AdminUser | undefined>;
  createUser(user: Partial<AdminUser>): Promise<AdminUser>;
  updateUser(id: string, user: Partial<AdminUser>): Promise<AdminUser>;
  deleteUser(id: string): Promise<void>;
  deactivateUser(id: string): Promise<AdminUser>;
  getStudents(_filters?: unknown): Promise<PaginatedResponse<AdminStudent>>;
  getStudent(id: string): Promise<AdminStudent | undefined>;
  getParents(_filters?: unknown): Promise<PaginatedResponse<AdminParent>>;
  getParent(id: string): Promise<AdminParent | undefined>;
  getFaculty(_filters?: unknown): Promise<PaginatedResponse<AdminFaculty>>;
  getFacultyMember(id: string): Promise<AdminFaculty | undefined>;
}

class UserApi implements UserApiService {
  private readonly client = getApiClient();

  async getUsers(_filters?: unknown): Promise<PaginatedResponse<AdminUser>> {
    return this.client.get<PaginatedResponse<AdminUser>>('/api/admin/users');
  }

  async getUser(id: string): Promise<AdminUser | undefined> {
    return this.client.get<AdminUser>(`/api/admin/users/${id}`);
  }

  async createUser(user: Partial<AdminUser>): Promise<AdminUser> {
    return this.client.post<AdminUser>('/api/admin/users', user);
  }

  async updateUser(id: string, user: Partial<AdminUser>): Promise<AdminUser> {
    return this.client.put<AdminUser>(`/api/admin/users/${id}`, user);
  }

  async deleteUser(id: string): Promise<void> {
    await this.client.delete(`/api/admin/users/${id}`);
  }

  async deactivateUser(id: string): Promise<AdminUser> {
    return this.client.patch<AdminUser>(`/api/admin/users/${id}/deactivate`, {});
  }

  async getStudents(_filters?: unknown): Promise<PaginatedResponse<AdminStudent>> {
    return this.client.get<PaginatedResponse<AdminStudent>>('/api/admin/students');
  }

  async getStudent(id: string): Promise<AdminStudent | undefined> {
    return this.client.get<AdminStudent>(`/api/admin/students/${id}`);
  }

  async getParents(_filters?: unknown): Promise<PaginatedResponse<AdminParent>> {
    return this.client.get<PaginatedResponse<AdminParent>>('/api/admin/parents');
  }

  async getParent(id: string): Promise<AdminParent | undefined> {
    return this.client.get<AdminParent>(`/api/admin/parents/${id}`);
  }

  async getFaculty(_filters?: unknown): Promise<PaginatedResponse<AdminFaculty>> {
    return this.client.get<PaginatedResponse<AdminFaculty>>('/api/admin/faculty');
  }

  async getFacultyMember(id: string): Promise<AdminFaculty | undefined> {
    return this.client.get<AdminFaculty>(`/api/admin/faculty/${id}`);
  }
}

class MockUserApi implements UserApiService {
  async getUsers(_filters?: unknown) {
    return adminMockService.getUsers();
  }
  async getUser(id: string) {
    return adminMockService.getUser(id);
  }
  async createUser(user: Partial<AdminUser>) {
    return adminMockService.createUser(user);
  }
  async updateUser(id: string, user: Partial<AdminUser>) {
    return adminMockService.updateUser(id, user);
  }
  async deleteUser(id: string) {
    return adminMockService.deleteUser(id);
  }
  async deactivateUser(id: string) {
    return adminMockService.deactivateUser(id);
  }
  async getStudents(_filters?: unknown) {
    return adminMockService.getStudents();
  }
  async getStudent(id: string) {
    return adminMockService.getStudent(id);
  }
  async getParents(_filters?: unknown) {
    return adminMockService.getParents();
  }
  async getParent(id: string) {
    return adminMockService.getParent(id);
  }
  async getFaculty(_filters?: unknown) {
    return adminMockService.getFaculty();
  }
  async getFacultyMember(id: string) {
    return adminMockService.getFacultyMember(id);
  }
}

export const userApi: UserApiService = environment.useMockApi ? new MockUserApi() : new UserApi();
