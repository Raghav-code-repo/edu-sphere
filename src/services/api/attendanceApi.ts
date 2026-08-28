import type { AttendanceRecord } from '@/types/student';
import type { AdminAttendanceRecord } from '@/types/admin';
import type { StudentWithAttendance, AttendanceSession } from '@/types/faculty';
import { environment } from '@/config/environment';
import { studentMockService } from '@/services/mock/studentMockService';
import { facultyMockService } from '@/services/mock/facultyMockService';
import { adminMockService } from '@/services/mock/adminMockService';
import { getApiClient } from './apiClient';

export interface AttendanceApiService {
  getAttendance(): Promise<AttendanceRecord[]>;
  getAttendanceByCourse(courseId: string): Promise<AttendanceRecord[]>;
  getAttendanceSessions(): Promise<AttendanceSession[]>;
  getAttendanceSession(id: string): Promise<AttendanceSession | undefined>;
  saveAttendance(sessionId: string, students: StudentWithAttendance[]): Promise<boolean>;
  getAdminAttendanceRecords(_filters?: unknown): Promise<unknown>;
  markAttendance(record: Partial<AdminAttendanceRecord>): Promise<AdminAttendanceRecord>;
  getAttendanceStats(): Promise<unknown>;
}

class AttendanceApi implements AttendanceApiService {
  private readonly client = getApiClient();

  async getAttendance(): Promise<AttendanceRecord[]> {
    return this.client.get<AttendanceRecord[]>('/api/student/attendance');
  }

  async getAttendanceByCourse(courseId: string): Promise<AttendanceRecord[]> {
    return this.client.get<AttendanceRecord[]>('/api/student/attendance', {
      params: { courseId },
    });
  }

  async getAttendanceSessions(): Promise<AttendanceSession[]> {
    return this.client.get<AttendanceSession[]>('/api/faculty/attendance/sessions');
  }

  async getAttendanceSession(id: string): Promise<AttendanceSession | undefined> {
    return this.client.get<AttendanceSession>(`/api/faculty/attendance/sessions/${id}`);
  }

  async saveAttendance(sessionId: string, students: StudentWithAttendance[]): Promise<boolean> {
    return this.client.post<boolean>(`/api/faculty/attendance/sessions/${sessionId}`, students);
  }

  async getAdminAttendanceRecords(_filters?: unknown): Promise<unknown> {
    return this.client.get<unknown>('/api/admin/attendance');
  }

  async markAttendance(record: Partial<AdminAttendanceRecord>): Promise<AdminAttendanceRecord> {
    return this.client.post<AdminAttendanceRecord>('/api/admin/attendance/mark', record);
  }

  async getAttendanceStats(): Promise<unknown> {
    return this.client.get<unknown>('/api/admin/attendance/stats');
  }
}

class MockAttendanceApi implements AttendanceApiService {
  async getAttendance() {
    return studentMockService.getAttendance();
  }
  async getAttendanceByCourse(courseId: string) {
    return studentMockService.getAttendanceByCourse(courseId);
  }
  async getAttendanceSessions() {
    return facultyMockService.getAttendanceSessions();
  }
  async getAttendanceSession(id: string) {
    return facultyMockService.getAttendanceSession(id);
  }
  async saveAttendance(sessionId: string, students: StudentWithAttendance[]) {
    return facultyMockService.saveAttendance(sessionId, students);
  }
  async getAdminAttendanceRecords() {
    return adminMockService.getAttendanceRecords();
  }
  async markAttendance(record: Partial<AdminAttendanceRecord>) {
    return adminMockService.markAttendance(record);
  }
  async getAttendanceStats() {
    return adminMockService.getAttendanceStats();
  }
}

export const attendanceApi: AttendanceApiService = environment.useMockApi
  ? new MockAttendanceApi()
  : new AttendanceApi();
