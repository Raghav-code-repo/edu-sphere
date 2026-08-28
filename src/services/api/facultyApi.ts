import type {
  FacultyProfile,
  FacultySettings,
  FacultyDashboardStats,
  FacultyCourse,
  FacultyClass,
  TodayClass,
  Student,
  StudentWithAttendance,
  AttendanceSession,
  Assignment,
  Submission,
  SubmissionReview,
  GradeBookStudent,
  CourseMaterial,
  Announcement,
  FacultyMessage,
  FacultyCalendarEvent,
  Report,
  StudentPerformanceData,
  PendingAction,
  SubmissionTrend,
  AttendanceAnalyticsData,
} from '@/types/faculty';
import { environment } from '@/config/environment';
import { facultyMockService } from '@/services/mock/facultyMockService';
import { getApiClient } from './apiClient';

export interface FacultyApiService {
  getProfile(): Promise<FacultyProfile>;
  getSettings(): Promise<FacultySettings>;
  updateSettings(settings: Partial<FacultySettings>): Promise<FacultySettings>;
  getDashboardStats(): Promise<FacultyDashboardStats>;
  getCourses(): Promise<FacultyCourse[]>;
  getCourse(id: string): Promise<FacultyCourse | undefined>;
  getClasses(): Promise<FacultyClass[]>;
  getTodayClasses(): Promise<TodayClass[]>;
  getStudents(courseId?: string): Promise<Student[]>;
  getStudent(id: string): Promise<Student | undefined>;
  getAttendanceSessions(): Promise<AttendanceSession[]>;
  getAttendanceSession(id: string): Promise<AttendanceSession | undefined>;
  saveAttendance(sessionId: string, students: StudentWithAttendance[]): Promise<boolean>;
  getAssignments(courseId?: string): Promise<Assignment[]>;
  getAssignment(id: string): Promise<Assignment | undefined>;
  getSubmissions(assignmentId?: string): Promise<Submission[]>;
  getSubmission(id: string): Promise<Submission | undefined>;
  reviewSubmission(review: SubmissionReview): Promise<boolean>;
  getGradebook(courseId?: string): Promise<GradeBookStudent[]>;
  updateGradebook(
    studentId: string,
    updates: Partial<GradeBookStudent>
  ): Promise<GradeBookStudent | undefined>;
  getMaterials(courseId?: string): Promise<CourseMaterial[]>;
  getAnnouncements(): Promise<Announcement[]>;
  createAnnouncement(
    announcement: Omit<Announcement, 'id' | 'date' | 'status'>
  ): Promise<Announcement>;
  getMessages(): Promise<FacultyMessage[]>;
  getMessage(id: string): Promise<FacultyMessage | undefined>;
  sendMessage(message: Omit<FacultyMessage, 'id' | 'timestamp'>): Promise<FacultyMessage>;
  getCalendarEvents(startDate?: string, endDate?: string): Promise<FacultyCalendarEvent[]>;
  getReports(): Promise<Report[]>;
  getPendingActions(): Promise<PendingAction[]>;
  getSubmissionTrends(): Promise<SubmissionTrend[]>;
  getAttendanceAnalytics(): Promise<AttendanceAnalyticsData[]>;
  getStudentPerformance(): Promise<StudentPerformanceData[]>;
}

class FacultyApi implements FacultyApiService {
  private readonly client = getApiClient();

  async getProfile(): Promise<FacultyProfile> {
    return this.client.get<FacultyProfile>('/api/faculty/profile');
  }

  async getSettings(): Promise<FacultySettings> {
    return this.client.get<FacultySettings>('/api/faculty/settings');
  }

  async updateSettings(settings: Partial<FacultySettings>): Promise<FacultySettings> {
    return this.client.patch<FacultySettings>('/api/faculty/settings', settings);
  }

  async getDashboardStats(): Promise<FacultyDashboardStats> {
    return this.client.get<FacultyDashboardStats>('/api/faculty/dashboard/stats');
  }

  async getCourses(): Promise<FacultyCourse[]> {
    return this.client.get<FacultyCourse[]>('/api/faculty/courses');
  }

  async getCourse(id: string): Promise<FacultyCourse | undefined> {
    return this.client.get<FacultyCourse>(`/api/faculty/courses/${id}`);
  }

  async getClasses(): Promise<FacultyClass[]> {
    return this.client.get<FacultyClass[]>('/api/faculty/classes');
  }

  async getTodayClasses(): Promise<TodayClass[]> {
    return this.client.get<TodayClass[]>('/api/faculty/classes/today');
  }

  async getStudents(courseId?: string): Promise<Student[]> {
    return this.client.get<Student[]>('/api/faculty/students', {
      params: { courseId },
    });
  }

  async getStudent(id: string): Promise<Student | undefined> {
    return this.client.get<Student>(`/api/faculty/students/${id}`);
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

  async getAssignments(courseId?: string): Promise<Assignment[]> {
    return this.client.get<Assignment[]>('/api/faculty/assignments', {
      params: { courseId },
    });
  }

  async getAssignment(id: string): Promise<Assignment | undefined> {
    return this.client.get<Assignment>(`/api/faculty/assignments/${id}`);
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

  async getMaterials(courseId?: string): Promise<CourseMaterial[]> {
    return this.client.get<CourseMaterial[]>('/api/faculty/materials', {
      params: { courseId },
    });
  }

  async getAnnouncements(): Promise<Announcement[]> {
    return this.client.get<Announcement[]>('/api/faculty/announcements');
  }

  async createAnnouncement(
    announcement: Omit<Announcement, 'id' | 'date' | 'status'>
  ): Promise<Announcement> {
    return this.client.post<Announcement>('/api/faculty/announcements', announcement);
  }

  async getMessages(): Promise<FacultyMessage[]> {
    return this.client.get<FacultyMessage[]>('/api/faculty/messages');
  }

  async getMessage(id: string): Promise<FacultyMessage | undefined> {
    return this.client.get<FacultyMessage>(`/api/faculty/messages/${id}`);
  }

  async sendMessage(message: Omit<FacultyMessage, 'id' | 'timestamp'>): Promise<FacultyMessage> {
    return this.client.post<FacultyMessage>('/api/faculty/messages', message);
  }

  async getCalendarEvents(startDate?: string, endDate?: string): Promise<FacultyCalendarEvent[]> {
    return this.client.get<FacultyCalendarEvent[]>('/api/faculty/calendar', {
      params: { startDate, endDate },
    });
  }

  async getReports(): Promise<Report[]> {
    return this.client.get<Report[]>('/api/faculty/reports');
  }

  async getPendingActions(): Promise<PendingAction[]> {
    return this.client.get<PendingAction[]>('/api/faculty/pending-actions');
  }

  async getSubmissionTrends(): Promise<SubmissionTrend[]> {
    return this.client.get<SubmissionTrend[]>('/api/faculty/analytics/submission-trends');
  }

  async getAttendanceAnalytics(): Promise<AttendanceAnalyticsData[]> {
    return this.client.get<AttendanceAnalyticsData[]>('/api/faculty/analytics/attendance');
  }

  async getStudentPerformance(): Promise<StudentPerformanceData[]> {
    return this.client.get<StudentPerformanceData[]>('/api/faculty/analytics/student-performance');
  }
}

class MockFacultyApi implements FacultyApiService {
  async getProfile() {
    return facultyMockService.getProfile();
  }
  async getSettings() {
    return facultyMockService.getSettings();
  }
  async updateSettings(settings: Partial<FacultySettings>) {
    return facultyMockService.updateSettings(settings);
  }
  async getDashboardStats() {
    return facultyMockService.getDashboardStats();
  }
  async getCourses() {
    return facultyMockService.getCourses();
  }
  async getCourse(id: string) {
    return facultyMockService.getCourse(id);
  }
  async getClasses() {
    return facultyMockService.getClasses();
  }
  async getTodayClasses() {
    return facultyMockService.getTodayClasses();
  }
  async getStudents(courseId?: string) {
    return facultyMockService.getStudents(courseId);
  }
  async getStudent(id: string) {
    return facultyMockService.getStudent(id);
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
  async getAssignments(courseId?: string) {
    return facultyMockService.getAssignments(courseId);
  }
  async getAssignment(id: string) {
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
  async getMaterials(courseId?: string) {
    return facultyMockService.getMaterials(courseId);
  }
  async getAnnouncements() {
    return facultyMockService.getAnnouncements();
  }
  async createAnnouncement(announcement: Omit<Announcement, 'id' | 'date' | 'status'>) {
    return facultyMockService.createAnnouncement(announcement);
  }
  async getMessages() {
    return facultyMockService.getMessages();
  }
  async getMessage(id: string) {
    return facultyMockService.getMessage(id);
  }
  async sendMessage(message: Omit<FacultyMessage, 'id' | 'timestamp'>) {
    return facultyMockService.sendMessage(message);
  }
  async getCalendarEvents(startDate?: string, endDate?: string) {
    return facultyMockService.getCalendarEvents(startDate, endDate);
  }
  async getReports() {
    return facultyMockService.getReports();
  }
  async getPendingActions() {
    return facultyMockService.getPendingActions();
  }
  async getSubmissionTrends() {
    return facultyMockService.getSubmissionTrends();
  }
  async getAttendanceAnalytics() {
    return facultyMockService.getAttendanceAnalytics();
  }
  async getStudentPerformance() {
    return facultyMockService.getStudentPerformance();
  }
}

export const facultyApi: FacultyApiService = environment.useMockApi
  ? new MockFacultyApi()
  : new FacultyApi();
