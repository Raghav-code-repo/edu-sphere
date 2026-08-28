import type { Assignment as StudentAssignment } from '@/types/student';
import type {
  Assignment as FacultyAssignment,
  Submission,
  SubmissionReview,
  GradeBookStudent,
} from '@/types/faculty';
import type { AdminAssignment } from '@/types/admin';
import { environment } from '@/config/environment';
import { studentMockService } from '@/services/mock/studentMockService';
import { facultyMockService } from '@/services/mock/facultyMockService';
import { adminMockService } from '@/services/mock/adminMockService';
import { getApiClient } from './apiClient';

export interface AssignmentApiService {
  getAssignments(): Promise<StudentAssignment[]>;
  getAssignment(id: string): Promise<StudentAssignment | undefined>;
  getFacultyAssignments(courseId?: string): Promise<FacultyAssignment[]>;
  getFacultyAssignment(id: string): Promise<FacultyAssignment | undefined>;
  getSubmissions(assignmentId?: string): Promise<Submission[]>;
  getSubmission(id: string): Promise<Submission | undefined>;
  reviewSubmission(review: SubmissionReview): Promise<boolean>;
  getGradebook(courseId?: string): Promise<GradeBookStudent[]>;
  updateGradebook(
    studentId: string,
    updates: Partial<GradeBookStudent>
  ): Promise<GradeBookStudent | undefined>;
  getAdminAssignments(_filters?: unknown): Promise<unknown>;
  createAssignment(assignment: Partial<AdminAssignment>): Promise<AdminAssignment>;
  updateAssignment(id: string, assignment: Partial<AdminAssignment>): Promise<AdminAssignment>;
  deleteAssignment(id: string): Promise<void>;
}

class AssignmentApi implements AssignmentApiService {
  private readonly client = getApiClient();

  async getAssignments(): Promise<StudentAssignment[]> {
    return this.client.get<StudentAssignment[]>('/api/student/assignments');
  }

  async getAssignment(id: string): Promise<StudentAssignment | undefined> {
    return this.client.get<StudentAssignment>(`/api/student/assignments/${id}`);
  }

  async getFacultyAssignments(courseId?: string): Promise<FacultyAssignment[]> {
    return this.client.get<FacultyAssignment[]>('/api/faculty/assignments', {
      params: { courseId },
    });
  }

  async getFacultyAssignment(id: string): Promise<FacultyAssignment | undefined> {
    return this.client.get<FacultyAssignment>(`/api/faculty/assignments/${id}`);
  }

  async getSubmissions(assignmentId?: string): Promise<Submission[]> {
    return this.client.get<Submission[]>('/api/faculty/submissions', {
      params: { assignmentId },
    });
  }

  async getSubmission(id: string): Promise<Submission | undefined> {
    return this.client.get<Submission>(`/api/faculty/submissions/${id}`);
  }

  async reviewSubmission(review: SubmissionReview): Promise<boolean> {
    return this.client.post<boolean>('/api/faculty/submissions/review', review);
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

  async getAdminAssignments(_filters?: unknown): Promise<unknown> {
    return this.client.get<unknown>('/api/admin/assignments');
  }

  async createAssignment(assignment: Partial<AdminAssignment>): Promise<AdminAssignment> {
    return this.client.post<AdminAssignment>('/api/admin/assignments', assignment);
  }

  async updateAssignment(
    id: string,
    assignment: Partial<AdminAssignment>
  ): Promise<AdminAssignment> {
    return this.client.put<AdminAssignment>(`/api/admin/assignments/${id}`, assignment);
  }

  async deleteAssignment(id: string): Promise<void> {
    await this.client.delete(`/api/admin/assignments/${id}`);
  }
}

class MockAssignmentApi implements AssignmentApiService {
  async getAssignments() {
    return studentMockService.getAssignments();
  }
  async getAssignment(id: string) {
    return studentMockService.getAssignment(id);
  }
  async getFacultyAssignments(courseId?: string) {
    return facultyMockService.getAssignments(courseId);
  }
  async getFacultyAssignment(id: string) {
    return facultyMockService.getAssignment(id);
  }
  async getSubmissions(assignmentId?: string) {
    return facultyMockService.getSubmissions(assignmentId);
  }
  async getSubmission(id: string) {
    return facultyMockService.getSubmission(id);
  }
  async reviewSubmission(review: SubmissionReview) {
    return facultyMockService.reviewSubmission(review);
  }
  async getGradebook(courseId?: string) {
    return facultyMockService.getGradebook(courseId);
  }
  async updateGradebook(studentId: string, updates: Partial<GradeBookStudent>) {
    return facultyMockService.updateGradebook(studentId, updates);
  }
  async getAdminAssignments() {
    return adminMockService.getAssignments();
  }
  async createAssignment(assignment: Partial<AdminAssignment>) {
    return adminMockService.createAssignment(assignment);
  }
  async updateAssignment(id: string, assignment: Partial<AdminAssignment>) {
    return adminMockService.updateAssignment(id, assignment);
  }
  async deleteAssignment(id: string) {
    return adminMockService.deleteAssignment(id);
  }
}

export const assignmentApi: AssignmentApiService = environment.useMockApi
  ? new MockAssignmentApi()
  : new AssignmentApi();
