import type { Report as FacultyReport } from '@/types/faculty';
import type { AdminReport, AdminAnalytics } from '@/types/admin';
import { environment } from '@/config/environment';
import { facultyMockService } from '@/services/mock/facultyMockService';
import { adminMockService } from '@/services/mock/adminMockService';
import { getApiClient } from './apiClient';

export interface ReportApiService {
  getFacultyReports(): Promise<FacultyReport[]>;
  getAdminReports(): Promise<AdminReport[]>;
  generateReport(type: string, filters: Record<string, unknown>): Promise<AdminReport>;
  getAnalytics(): Promise<AdminAnalytics>;
}

class ReportApi implements ReportApiService {
  private readonly client = getApiClient();

  async getFacultyReports(): Promise<FacultyReport[]> {
    return this.client.get<FacultyReport[]>('/api/faculty/reports');
  }

  async getAdminReports(): Promise<AdminReport[]> {
    return this.client.get<AdminReport[]>('/api/admin/reports');
  }

  async generateReport(type: string, filters: Record<string, unknown>): Promise<AdminReport> {
    return this.client.post<AdminReport>('/api/admin/reports/generate', { type, filters });
  }

  async getAnalytics(): Promise<AdminAnalytics> {
    return this.client.get<AdminAnalytics>('/api/admin/analytics');
  }
}

class MockReportApi implements ReportApiService {
  async getFacultyReports() {
    return facultyMockService.getReports();
  }
  async getAdminReports() {
    return adminMockService.getReports();
  }
  async generateReport(type: string, filters: Record<string, unknown>) {
    return adminMockService.generateReport(type, filters);
  }
  async getAnalytics() {
    return adminMockService.getAnalytics();
  }
}

export const reportApi: ReportApiService = environment.useMockApi
  ? new MockReportApi()
  : new ReportApi();
