import type { GradeRecord } from '@/types/student';
import type { GradeBookStudent, SubmissionReview } from '@/types/faculty';
import type { AdminExamResult } from '@/types/admin';
import { environment } from '@/config/environment';
import { studentMockService } from '@/services/mock/studentMockService';
import { facultyMockService } from '@/services/mock/facultyMockService';
import { adminMockService } from '@/services/mock/adminMockService';
import { getApiClient } from './apiClient';

export interface GradeApiService {
  getGrades(): Promise<GradeRecord[]>;
  getGradesByCourse(courseId: string): Promise<GradeRecord[]>;
  getGradebook(courseId?: string): Promise<GradeBookStudent[]>;
  updateGradebook(
    studentId: string,
    updates: Partial<GradeBookStudent>
  ): Promise<GradeBookStudent | undefined>;
  reviewSubmission(review: SubmissionReview): Promise<boolean>;
  getExamResults(examId: string): Promise<AdminExamResult[]>;
}

class GradeApi implements GradeApiService {
  private readonly client = getApiClient();

  async getGrades(): Promise<GradeRecord[]> {
    return this.client.get<GradeRecord[]>('/api/student/grades');
  }

  async getGradesByCourse(courseId: string): Promise<GradeRecord[]> {
    return this.client.get<GradeRecord[]>('/api/student/grades', {
      params: { courseId },
    });
  }

  async getGradebook(courseId?: string): Promise<GradeBookStudent[]> {
    return this.client.get<GradeBookStudent[]>('/api/faculty/gradebook', {
      params: { courseId },
    });
  }

  async updateGradebook(
    studentId: string,
    updates: Partial<GradeBookStudent>
  ): Promise<GradeBookStudent | undefined> {
    return this.client.patch<GradeBookStudent>(`/api/faculty/gradebook/${studentId}`, updates);
  }

  async reviewSubmission(review: SubmissionReview): Promise<boolean> {
    return this.client.post<boolean>('/api/faculty/submissions/review', review);
  }

  async getExamResults(examId: string): Promise<AdminExamResult[]> {
    return this.client.get<AdminExamResult[]>(`/api/admin/exams/${examId}/results`);
  }
}

class MockGradeApi implements GradeApiService {
  async getGrades() {
    return studentMockService.getGrades();
  }
  async getGradesByCourse(courseId: string) {
    return studentMockService.getGradesByCourse(courseId);
  }
  async getGradebook(courseId?: string) {
    return facultyMockService.getGradebook(courseId);
  }
  async updateGradebook(studentId: string, updates: Partial<GradeBookStudent>) {
    return facultyMockService.updateGradebook(studentId, updates);
  }
  async reviewSubmission(review: SubmissionReview) {
    return facultyMockService.reviewSubmission(review);
  }
  async getExamResults(examId: string) {
    return adminMockService.getExamResults(examId);
  }
}

export const gradeApi: GradeApiService = environment.useMockApi
  ? new MockGradeApi()
  : new GradeApi();
