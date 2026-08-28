import type { Exam as StudentExam } from '@/types/student';
import type { AdminExam, AdminExamResult } from '@/types/admin';
import { environment } from '@/config/environment';
import { studentMockService } from '@/services/mock/studentMockService';
import { adminMockService } from '@/services/mock/adminMockService';
import { getApiClient } from './apiClient';

export interface ExamApiService {
  getExams(): Promise<StudentExam[]>;
  getExam(id: string): Promise<StudentExam | undefined>;
  getFacultyExams(filters?: unknown): Promise<unknown>;
  getFacultyExam(id: string): Promise<unknown>;
  createExam(exam: Partial<AdminExam>): Promise<AdminExam>;
  updateExam(id: string, exam: Partial<AdminExam>): Promise<AdminExam>;
  deleteExam(id: string): Promise<void>;
  getExamResults(examId: string): Promise<AdminExamResult[]>;
}

class ExamApi implements ExamApiService {
  private readonly client = getApiClient();

  async getExams(): Promise<StudentExam[]> {
    return this.client.get<StudentExam[]>('/api/student/exams');
  }

  async getExam(id: string): Promise<StudentExam | undefined> {
    return this.client.get<StudentExam>(`/api/student/exams/${id}`);
  }

  async getFacultyExams(_filters?: unknown): Promise<unknown> {
    return this.client.get<unknown>('/api/faculty/exams');
  }

  async getFacultyExam(id: string): Promise<unknown> {
    return this.client.get<unknown>(`/api/faculty/exams/${id}`);
  }

  async createExam(exam: Partial<AdminExam>): Promise<AdminExam> {
    return this.client.post<AdminExam>('/api/admin/exams', exam);
  }

  async updateExam(id: string, exam: Partial<AdminExam>): Promise<AdminExam> {
    return this.client.put<AdminExam>(`/api/admin/exams/${id}`, exam);
  }

  async deleteExam(id: string): Promise<void> {
    await this.client.delete(`/api/admin/exams/${id}`);
  }

  async getExamResults(examId: string): Promise<AdminExamResult[]> {
    return this.client.get<AdminExamResult[]>(`/api/admin/exams/${examId}/results`);
  }
}

class MockExamApi implements ExamApiService {
  async getExams() {
    return studentMockService.getExams();
  }
  async getExam(id: string) {
    return studentMockService.getExam(id);
  }
  async getFacultyExams() {
    return Promise.resolve({ data: [], total: 0, page: 1, pageSize: 10, totalPages: 1 });
  }
  async getFacultyExam(_id: string) {
    return Promise.resolve(undefined);
  }
  async createExam(exam: Partial<AdminExam>) {
    return adminMockService.createExam(exam);
  }
  async updateExam(id: string, exam: Partial<AdminExam>) {
    return adminMockService.updateExam(id, exam);
  }
  async deleteExam(id: string) {
    return adminMockService.deleteExam(id);
  }
  async getExamResults(examId: string) {
    return adminMockService.getExamResults(examId);
  }
}

export const examApi: ExamApiService = environment.useMockApi ? new MockExamApi() : new ExamApi();
