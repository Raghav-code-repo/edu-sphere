import type {
  ParentProfile,
  ParentSettings,
  Child,
  FacultyFeedback,
  Document,
  FeeRecord,
  ParentMessage,
  ParentDashboardStats,
  ChildAttendanceSummary,
  ChildAcademicSummary,
  ChildAssignmentSummary,
  ChildExamSummary,
  PaymentIntent,
  PaymentHistoryItem,
  ParentAssignment,
  ParentExam,
  ParentCalendarEvent,
} from '@/types/parent';
import { environment } from '@/config/environment';
import { parentMockService } from '@/services/mock/parentMockService';
import { getApiClient } from './apiClient';

export interface ParentApiService {
  getParentProfile(): Promise<ParentProfile>;
  getChildren(): Promise<Child[]>;
  getChild(id: string): Promise<Child | undefined>;
  getDashboardStats(): Promise<ParentDashboardStats>;
  getAttendance(childId?: string): Promise<ChildAttendanceSummary[]>;
  getAcademicPerformance(childId?: string): Promise<ChildAcademicSummary[]>;
  getAssignments(childId?: string): Promise<ParentAssignment[]>;
  getExams(childId?: string): Promise<ParentExam[]>;
  getFees(): Promise<FeeRecord[]>;
  getFeeById(id: string): Promise<FeeRecord | undefined>;
  getMessages(): Promise<ParentMessage[]>;
  getCalendarEvents(childId?: string): Promise<ParentCalendarEvent[]>;
  getDocuments(childId?: string): Promise<Document[]>;
  getFacultyFeedback(childId?: string): Promise<FacultyFeedback[]>;
  getSettings(): Promise<ParentSettings>;
  updateSettings(settings: Partial<ParentSettings>): Promise<ParentSettings>;
  getAttendanceTrend(): Promise<unknown[]>;
  getAcademicPerformanceChartData(): Promise<unknown[]>;
  getAssignmentCompletion(): Promise<unknown[]>;
  getExamPerformance(): Promise<unknown[]>;
  getChildAttendanceSummary(): Promise<ChildAttendanceSummary[]>;
  getChildAcademicSummary(): Promise<ChildAcademicSummary[]>;
  getChildAssignmentSummary(): Promise<ChildAssignmentSummary[]>;
  getChildExamSummary(): Promise<ChildExamSummary[]>;
  initiatePayment(amount: number, childId: string): Promise<PaymentIntent>;
  getPaymentHistory(childId: string): Promise<PaymentHistoryItem[]>;
}

class ParentApi implements ParentApiService {
  private readonly client = getApiClient();

  async getParentProfile(): Promise<ParentProfile> {
    return this.client.get<ParentProfile>('/api/parent/profile');
  }

  async getChildren(): Promise<Child[]> {
    return this.client.get<Child[]>('/api/parent/children');
  }

  async getChild(id: string): Promise<Child | undefined> {
    return this.client.get<Child>(`/api/parent/children/${id}`);
  }

  async getDashboardStats(): Promise<ParentDashboardStats> {
    return this.client.get<ParentDashboardStats>('/api/parent/dashboard/stats');
  }

  async getAttendance(childId?: string): Promise<ChildAttendanceSummary[]> {
    return this.client.get<ChildAttendanceSummary[]>('/api/parent/attendance', {
      params: { childId },
    });
  }

  async getAcademicPerformance(childId?: string): Promise<ChildAcademicSummary[]> {
    return this.client.get<ChildAcademicSummary[]>('/api/parent/academic-performance', {
      params: { childId },
    });
  }

  async getAssignments(childId?: string): Promise<ParentAssignment[]> {
    return this.client.get<ParentAssignment[]>('/api/parent/assignments', {
      params: { childId },
    });
  }

  async getExams(childId?: string): Promise<ParentExam[]> {
    return this.client.get<ParentExam[]>('/api/parent/exams', {
      params: { childId },
    });
  }

  async getFees(): Promise<FeeRecord[]> {
    return this.client.get<FeeRecord[]>('/api/parent/fees');
  }

  async getFeeById(id: string): Promise<FeeRecord | undefined> {
    return this.client.get<FeeRecord>(`/api/parent/fees/${id}`);
  }

  async getMessages(): Promise<ParentMessage[]> {
    return this.client.get<ParentMessage[]>('/api/parent/messages');
  }

  async getCalendarEvents(childId?: string): Promise<ParentCalendarEvent[]> {
    return this.client.get<ParentCalendarEvent[]>('/api/parent/calendar', {
      params: { childId },
    });
  }

  async getDocuments(childId?: string): Promise<Document[]> {
    return this.client.get<Document[]>('/api/parent/documents', {
      params: { childId },
    });
  }

  async getFacultyFeedback(childId?: string): Promise<FacultyFeedback[]> {
    return this.client.get<FacultyFeedback[]>('/api/parent/feedback', {
      params: { childId },
    });
  }

  async getSettings(): Promise<ParentSettings> {
    return this.client.get<ParentSettings>('/api/parent/settings');
  }

  async updateSettings(settings: Partial<ParentSettings>): Promise<ParentSettings> {
    return this.client.patch<ParentSettings>('/api/parent/settings', settings);
  }

  async getAttendanceTrend(): Promise<unknown[]> {
    return this.client.get<unknown[]>('/api/parent/analytics/attendance-trend');
  }

  async getAcademicPerformanceChartData(): Promise<unknown[]> {
    return this.client.get<unknown[]>('/api/parent/analytics/academic-performance');
  }

  async getAssignmentCompletion(): Promise<unknown[]> {
    return this.client.get<unknown[]>('/api/parent/analytics/assignment-completion');
  }

  async getExamPerformance(): Promise<unknown[]> {
    return this.client.get<unknown[]>('/api/parent/analytics/exam-performance');
  }

  async getChildAttendanceSummary(): Promise<ChildAttendanceSummary[]> {
    return this.client.get<ChildAttendanceSummary[]>('/api/parent/analytics/child-attendance');
  }

  async getChildAcademicSummary(): Promise<ChildAcademicSummary[]> {
    return this.client.get<ChildAcademicSummary[]>('/api/parent/analytics/child-academic');
  }

  async getChildAssignmentSummary(): Promise<ChildAssignmentSummary[]> {
    return this.client.get<ChildAssignmentSummary[]>('/api/parent/analytics/child-assignments');
  }

  async getChildExamSummary(): Promise<ChildExamSummary[]> {
    return this.client.get<ChildExamSummary[]>('/api/parent/analytics/child-exams');
  }

  async initiatePayment(amount: number, childId: string): Promise<PaymentIntent> {
    return this.client.post<PaymentIntent>('/api/parent/payments/initiate', { amount, childId });
  }

  async getPaymentHistory(childId: string): Promise<PaymentHistoryItem[]> {
    return this.client.get<PaymentHistoryItem[]>('/api/parent/payments/history', {
      params: { childId },
    });
  }
}

class MockParentApi implements ParentApiService {
  async getParentProfile() {
    return parentMockService.getParentProfile();
  }
  async getChildren() {
    return parentMockService.getChildren();
  }
  async getChild(id: string) {
    return parentMockService.getChild(id);
  }
  async getDashboardStats() {
    return parentMockService.getDashboardStats();
  }
  async getAttendance(childId?: string) {
    return parentMockService.getAttendance(childId);
  }
  async getAcademicPerformance(childId?: string) {
    return parentMockService.getAcademicPerformance(childId);
  }
  async getAssignments(childId?: string) {
    return parentMockService.getAssignments(childId);
  }
  async getExams(childId?: string) {
    return parentMockService.getExams(childId);
  }
  async getFees() {
    return parentMockService.getFees();
  }
  async getFeeById(id: string) {
    return parentMockService.getFeeById(id);
  }
  async getMessages() {
    return parentMockService.getMessages();
  }
  async getCalendarEvents(childId?: string) {
    return parentMockService.getCalendarEvents(childId);
  }
  async getDocuments(childId?: string) {
    return parentMockService.getDocuments(childId);
  }
  async getFacultyFeedback(childId?: string) {
    return parentMockService.getFacultyFeedback(childId);
  }
  async getSettings() {
    return parentMockService.getSettings();
  }
  async updateSettings(settings: Partial<ParentSettings>) {
    return parentMockService.updateSettings(settings);
  }
  async getAttendanceTrend() {
    return parentMockService.getAttendanceTrend();
  }
  async getAcademicPerformanceChartData() {
    return parentMockService.getAcademicPerformanceChartData();
  }
  async getAssignmentCompletion() {
    return parentMockService.getAssignmentCompletion();
  }
  async getExamPerformance() {
    return parentMockService.getExamPerformance();
  }
  async getChildAttendanceSummary() {
    return parentMockService.getChildAttendanceSummary();
  }
  async getChildAcademicSummary() {
    return parentMockService.getChildAcademicSummary();
  }
  async getChildAssignmentSummary() {
    return parentMockService.getChildAssignmentSummary();
  }
  async getChildExamSummary() {
    return parentMockService.getChildExamSummary();
  }
  async initiatePayment(amount: number, childId: string) {
    return parentMockService.initiatePayment(amount, childId);
  }
  async getPaymentHistory(childId: string) {
    return parentMockService.getPaymentHistory(childId);
  }
}

export const parentApi: ParentApiService = environment.useMockApi
  ? new MockParentApi()
  : new ParentApi();
