import type {
  AdminDashboardStats,
  AdminAnalytics,
  AdminUser,
  AdminStudent,
  AdminParent,
  AdminFaculty,
  AdminCourse,
  AdminClass,
  AdminSubject,
  AdminDepartment,
  AdminAttendanceRecord,
  AdminAssignment,
  AdminExam,
  AdminExamResult,
  AdminFee,
  AdminAnnouncement,
  AdminDocument,
  AdminAuditLog,
  AdminReport,
  AdminSettings,
  FilterOptions,
  PaginatedResponse,
} from '@/types/admin';
import { environment } from '@/config/environment';
import { adminMockService } from '@/services/mock/adminMockService';
import { getApiClient } from './apiClient';

export interface AdminApiService {
  getDashboardStats(): Promise<AdminDashboardStats>;
  getAnalytics(): Promise<AdminAnalytics>;
  getUsers(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminUser>>;
  getUser(id: string): Promise<AdminUser | undefined>;
  createUser(user: Partial<AdminUser>): Promise<AdminUser>;
  updateUser(id: string, user: Partial<AdminUser>): Promise<AdminUser>;
  deleteUser(id: string): Promise<void>;
  deactivateUser(id: string): Promise<AdminUser>;
  getStudents(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminStudent>>;
  getStudent(id: string): Promise<AdminStudent | undefined>;
  getParents(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminParent>>;
  getParent(id: string): Promise<AdminParent | undefined>;
  getFaculty(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminFaculty>>;
  getFacultyMember(id: string): Promise<AdminFaculty | undefined>;
  getCourses(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminCourse>>;
  getCourse(id: string): Promise<AdminCourse | undefined>;
  createCourse(course: Partial<AdminCourse>): Promise<AdminCourse>;
  updateCourse(id: string, course: Partial<AdminCourse>): Promise<AdminCourse>;
  deleteCourse(id: string): Promise<void>;
  publishCourse(id: string): Promise<AdminCourse>;
  unpublishCourse(id: string): Promise<AdminCourse>;
  getClasses(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminClass>>;
  getClass(id: string): Promise<AdminClass | undefined>;
  createClass(cls: Partial<AdminClass>): Promise<AdminClass>;
  updateClass(id: string, cls: Partial<AdminClass>): Promise<AdminClass>;
  deleteClass(id: string): Promise<void>;
  getSubjects(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminSubject>>;
  getSubject(id: string): Promise<AdminSubject | undefined>;
  createSubject(subject: Partial<AdminSubject>): Promise<AdminSubject>;
  updateSubject(id: string, subject: Partial<AdminSubject>): Promise<AdminSubject>;
  deleteSubject(id: string): Promise<void>;
  getDepartments(): Promise<AdminDepartment[]>;
  getDepartment(id: string): Promise<AdminDepartment | undefined>;
  createDepartment(dept: Partial<AdminDepartment>): Promise<AdminDepartment>;
  updateDepartment(id: string, dept: Partial<AdminDepartment>): Promise<AdminDepartment>;
  deleteDepartment(id: string): Promise<void>;
  getAttendanceRecords(
    filters?: Partial<FilterOptions>
  ): Promise<PaginatedResponse<AdminAttendanceRecord>>;
  markAttendance(record: Partial<AdminAttendanceRecord>): Promise<AdminAttendanceRecord>;
  getAttendanceStats(): Promise<{ present: number; absent: number; late: number; excused: number }>;
  getAssignments(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminAssignment>>;
  getAssignment(id: string): Promise<AdminAssignment | undefined>;
  createAssignment(assignment: Partial<AdminAssignment>): Promise<AdminAssignment>;
  updateAssignment(id: string, assignment: Partial<AdminAssignment>): Promise<AdminAssignment>;
  deleteAssignment(id: string): Promise<void>;
  getExams(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminExam>>;
  getExam(id: string): Promise<AdminExam | undefined>;
  createExam(exam: Partial<AdminExam>): Promise<AdminExam>;
  updateExam(id: string, exam: Partial<AdminExam>): Promise<AdminExam>;
  deleteExam(id: string): Promise<void>;
  getExamResults(examId: string): Promise<AdminExamResult[]>;
  getFees(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminFee>>;
  getFee(id: string): Promise<AdminFee | undefined>;
  updateFeeStatus(id: string, status: string): Promise<AdminFee>;
  getAnnouncements(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminAnnouncement>>;
  getAnnouncement(id: string): Promise<AdminAnnouncement | undefined>;
  createAnnouncement(announcement: Partial<AdminAnnouncement>): Promise<AdminAnnouncement>;
  updateAnnouncement(
    id: string,
    announcement: Partial<AdminAnnouncement>
  ): Promise<AdminAnnouncement>;
  deleteAnnouncement(id: string): Promise<void>;
  publishAnnouncement(id: string): Promise<AdminAnnouncement>;
  getDocuments(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminDocument>>;
  uploadDocument(doc: Partial<AdminDocument>): Promise<AdminDocument>;
  deleteDocument(id: string): Promise<void>;
  getAuditLogs(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminAuditLog>>;
  getReports(): Promise<AdminReport[]>;
  generateReport(type: string, filters: Record<string, unknown>): Promise<AdminReport>;
  getSettings(): Promise<AdminSettings>;
  updateSettings(settings: Partial<AdminSettings>): Promise<AdminSettings>;
}

class AdminApi implements AdminApiService {
  private readonly client = getApiClient();

  async getDashboardStats(): Promise<AdminDashboardStats> {
    return this.client.get<AdminDashboardStats>('/api/admin/dashboard/stats');
  }

  async getAnalytics(): Promise<AdminAnalytics> {
    return this.client.get<AdminAnalytics>('/api/admin/analytics');
  }

  async getUsers(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminUser>> {
    return this.client.get<PaginatedResponse<AdminUser>>('/api/admin/users', { params: filters });
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

  async getStudents(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminStudent>> {
    return this.client.get<PaginatedResponse<AdminStudent>>('/api/admin/students', {
      params: filters,
    });
  }

  async getStudent(id: string): Promise<AdminStudent | undefined> {
    return this.client.get<AdminStudent>(`/api/admin/students/${id}`);
  }

  async getParents(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminParent>> {
    return this.client.get<PaginatedResponse<AdminParent>>('/api/admin/parents', {
      params: filters,
    });
  }

  async getParent(id: string): Promise<AdminParent | undefined> {
    return this.client.get<AdminParent>(`/api/admin/parents/${id}`);
  }

  async getFaculty(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminFaculty>> {
    return this.client.get<PaginatedResponse<AdminFaculty>>('/api/admin/faculty', {
      params: filters,
    });
  }

  async getFacultyMember(id: string): Promise<AdminFaculty | undefined> {
    return this.client.get<AdminFaculty>(`/api/admin/faculty/${id}`);
  }

  async getCourses(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminCourse>> {
    return this.client.get<PaginatedResponse<AdminCourse>>('/api/admin/courses', {
      params: filters,
    });
  }

  async getCourse(id: string): Promise<AdminCourse | undefined> {
    return this.client.get<AdminCourse>(`/api/admin/courses/${id}`);
  }

  async createCourse(course: Partial<AdminCourse>): Promise<AdminCourse> {
    return this.client.post<AdminCourse>('/api/admin/courses', course);
  }

  async updateCourse(id: string, course: Partial<AdminCourse>): Promise<AdminCourse> {
    return this.client.put<AdminCourse>(`/api/admin/courses/${id}`, course);
  }

  async deleteCourse(id: string): Promise<void> {
    await this.client.delete(`/api/admin/courses/${id}`);
  }

  async publishCourse(id: string): Promise<AdminCourse> {
    return this.client.patch<AdminCourse>(`/api/admin/courses/${id}/publish`, {});
  }

  async unpublishCourse(id: string): Promise<AdminCourse> {
    return this.client.patch<AdminCourse>(`/api/admin/courses/${id}/unpublish`, {});
  }

  async getClasses(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminClass>> {
    return this.client.get<PaginatedResponse<AdminClass>>('/api/admin/classes', {
      params: filters,
    });
  }

  async getClass(id: string): Promise<AdminClass | undefined> {
    return this.client.get<AdminClass>(`/api/admin/classes/${id}`);
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

  async getSubjects(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminSubject>> {
    return this.client.get<PaginatedResponse<AdminSubject>>('/api/admin/subjects', {
      params: filters,
    });
  }

  async getSubject(id: string): Promise<AdminSubject | undefined> {
    return this.client.get<AdminSubject>(`/api/admin/subjects/${id}`);
  }

  async createSubject(subject: Partial<AdminSubject>): Promise<AdminSubject> {
    return this.client.post<AdminSubject>('/api/admin/subjects', subject);
  }

  async updateSubject(id: string, subject: Partial<AdminSubject>): Promise<AdminSubject> {
    return this.client.put<AdminSubject>(`/api/admin/subjects/${id}`, subject);
  }

  async deleteSubject(id: string): Promise<void> {
    await this.client.delete(`/api/admin/subjects/${id}`);
  }

  async getDepartments(): Promise<AdminDepartment[]> {
    return this.client.get<AdminDepartment[]>('/api/admin/departments');
  }

  async getDepartment(id: string): Promise<AdminDepartment | undefined> {
    return this.client.get<AdminDepartment>(`/api/admin/departments/${id}`);
  }

  async createDepartment(dept: Partial<AdminDepartment>): Promise<AdminDepartment> {
    return this.client.post<AdminDepartment>('/api/admin/departments', dept);
  }

  async updateDepartment(id: string, dept: Partial<AdminDepartment>): Promise<AdminDepartment> {
    return this.client.put<AdminDepartment>(`/api/admin/departments/${id}`, dept);
  }

  async deleteDepartment(id: string): Promise<void> {
    await this.client.delete(`/api/admin/departments/${id}`);
  }

  async getAttendanceRecords(
    filters?: Partial<FilterOptions>
  ): Promise<PaginatedResponse<AdminAttendanceRecord>> {
    return this.client.get<PaginatedResponse<AdminAttendanceRecord>>('/api/admin/attendance', {
      params: filters,
    });
  }

  async markAttendance(record: Partial<AdminAttendanceRecord>): Promise<AdminAttendanceRecord> {
    return this.client.post<AdminAttendanceRecord>('/api/admin/attendance/mark', record);
  }

  async getAttendanceStats(): Promise<{
    present: number;
    absent: number;
    late: number;
    excused: number;
  }> {
    return this.client.get('/api/admin/attendance/stats');
  }

  async getAssignments(
    filters?: Partial<FilterOptions>
  ): Promise<PaginatedResponse<AdminAssignment>> {
    return this.client.get<PaginatedResponse<AdminAssignment>>('/api/admin/assignments', {
      params: filters,
    });
  }

  async getAssignment(id: string): Promise<AdminAssignment | undefined> {
    return this.client.get<AdminAssignment>(`/api/admin/assignments/${id}`);
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

  async getExams(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminExam>> {
    return this.client.get<PaginatedResponse<AdminExam>>('/api/admin/exams', { params: filters });
  }

  async getExam(id: string): Promise<AdminExam | undefined> {
    return this.client.get<AdminExam>(`/api/admin/exams/${id}`);
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

  async getFees(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminFee>> {
    return this.client.get<PaginatedResponse<AdminFee>>('/api/admin/fees', { params: filters });
  }

  async getFee(id: string): Promise<AdminFee | undefined> {
    return this.client.get<AdminFee>(`/api/admin/fees/${id}`);
  }

  async updateFeeStatus(id: string, status: string): Promise<AdminFee> {
    return this.client.patch<AdminFee>(`/api/admin/fees/${id}/status`, { status });
  }

  async getAnnouncements(
    filters?: Partial<FilterOptions>
  ): Promise<PaginatedResponse<AdminAnnouncement>> {
    return this.client.get<PaginatedResponse<AdminAnnouncement>>('/api/admin/announcements', {
      params: filters,
    });
  }

  async getAnnouncement(id: string): Promise<AdminAnnouncement | undefined> {
    return this.client.get<AdminAnnouncement>(`/api/admin/announcements/${id}`);
  }

  async createAnnouncement(announcement: Partial<AdminAnnouncement>): Promise<AdminAnnouncement> {
    return this.client.post<AdminAnnouncement>('/api/admin/announcements', announcement);
  }

  async updateAnnouncement(
    id: string,
    announcement: Partial<AdminAnnouncement>
  ): Promise<AdminAnnouncement> {
    return this.client.put<AdminAnnouncement>(`/api/admin/announcements/${id}`, announcement);
  }

  async deleteAnnouncement(id: string): Promise<void> {
    await this.client.delete(`/api/admin/announcements/${id}`);
  }

  async publishAnnouncement(id: string): Promise<AdminAnnouncement> {
    return this.client.patch<AdminAnnouncement>(`/api/admin/announcements/${id}/publish`, {});
  }

  async getDocuments(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminDocument>> {
    return this.client.get<PaginatedResponse<AdminDocument>>('/api/admin/documents', {
      params: filters,
    });
  }

  async uploadDocument(doc: Partial<AdminDocument>): Promise<AdminDocument> {
    return this.client.post<AdminDocument>('/api/admin/documents', doc);
  }

  async deleteDocument(id: string): Promise<void> {
    await this.client.delete(`/api/admin/documents/${id}`);
  }

  async getAuditLogs(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminAuditLog>> {
    return this.client.get<PaginatedResponse<AdminAuditLog>>('/api/admin/audit-logs', {
      params: filters,
    });
  }

  async getReports(): Promise<AdminReport[]> {
    return this.client.get<AdminReport[]>('/api/admin/reports');
  }

  async generateReport(type: string, filters: Record<string, unknown>): Promise<AdminReport> {
    return this.client.post<AdminReport>('/api/admin/reports/generate', { type, filters });
  }

  async getSettings(): Promise<AdminSettings> {
    return this.client.get<AdminSettings>('/api/admin/settings');
  }

  async updateSettings(settings: Partial<AdminSettings>): Promise<AdminSettings> {
    return this.client.patch<AdminSettings>('/api/admin/settings', settings);
  }
}

class MockAdminApi implements AdminApiService {
  async getDashboardStats() {
    return adminMockService.getDashboardStats();
  }
  async getAnalytics() {
    return adminMockService.getAnalytics();
  }
  async getUsers(filters?: Partial<FilterOptions>) {
    return adminMockService.getUsers(filters);
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
  async getStudents(filters?: Partial<FilterOptions>) {
    return adminMockService.getStudents(filters);
  }
  async getStudent(id: string) {
    return adminMockService.getStudent(id);
  }
  async getParents(filters?: Partial<FilterOptions>) {
    return adminMockService.getParents(filters);
  }
  async getParent(id: string) {
    return adminMockService.getParent(id);
  }
  async getFaculty(filters?: Partial<FilterOptions>) {
    return adminMockService.getFaculty(filters);
  }
  async getFacultyMember(id: string) {
    return adminMockService.getFacultyMember(id);
  }
  async getCourses(filters?: Partial<FilterOptions>) {
    return adminMockService.getCourses(filters);
  }
  async getCourse(id: string) {
    return adminMockService.getCourse(id);
  }
  async createCourse(course: Partial<AdminCourse>) {
    return adminMockService.createCourse(course);
  }
  async updateCourse(id: string, course: Partial<AdminCourse>) {
    return adminMockService.updateCourse(id, course);
  }
  async deleteCourse(id: string) {
    return adminMockService.deleteCourse(id);
  }
  async publishCourse(id: string) {
    return adminMockService.publishCourse(id);
  }
  async unpublishCourse(id: string) {
    return adminMockService.unpublishCourse(id);
  }
  async getClasses(filters?: Partial<FilterOptions>) {
    return adminMockService.getClasses(filters);
  }
  async getClass(id: string) {
    return adminMockService.getClass(id);
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
  async getSubjects(filters?: Partial<FilterOptions>) {
    return adminMockService.getSubjects(filters);
  }
  async getSubject(id: string) {
    return adminMockService.getSubject(id);
  }
  async createSubject(subject: Partial<AdminSubject>) {
    return adminMockService.createSubject(subject);
  }
  async updateSubject(id: string, subject: Partial<AdminSubject>) {
    return adminMockService.updateSubject(id, subject);
  }
  async deleteSubject(id: string) {
    return adminMockService.deleteSubject(id);
  }
  async getDepartments() {
    return adminMockService.getDepartments();
  }
  async getDepartment(id: string) {
    return adminMockService.getDepartment(id);
  }
  async createDepartment(dept: Partial<AdminDepartment>) {
    return adminMockService.createDepartment(dept);
  }
  async updateDepartment(id: string, dept: Partial<AdminDepartment>) {
    return adminMockService.updateDepartment(id, dept);
  }
  async deleteDepartment(id: string) {
    return adminMockService.deleteDepartment(id);
  }
  async getAttendanceRecords(filters?: Partial<FilterOptions>) {
    return adminMockService.getAttendanceRecords(filters);
  }
  async markAttendance(record: Partial<AdminAttendanceRecord>) {
    return adminMockService.markAttendance(record);
  }
  async getAttendanceStats() {
    return adminMockService.getAttendanceStats();
  }
  async getAssignments(filters?: Partial<FilterOptions>) {
    return adminMockService.getAssignments(filters);
  }
  async getAssignment(id: string) {
    return adminMockService.getAssignment(id);
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
  async getExams(filters?: Partial<FilterOptions>) {
    return adminMockService.getExams(filters);
  }
  async getExam(id: string) {
    return adminMockService.getExam(id);
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
  async getFees(filters?: Partial<FilterOptions>) {
    return adminMockService.getFees(filters);
  }
  async getFee(id: string) {
    return adminMockService.getFee(id);
  }
  async updateFeeStatus(id: string, status: string) {
    return adminMockService.updateFeeStatus(id, status);
  }
  async getAnnouncements(filters?: Partial<FilterOptions>) {
    return adminMockService.getAnnouncements(filters);
  }
  async getAnnouncement(id: string) {
    return adminMockService.getAnnouncement(id);
  }
  async createAnnouncement(announcement: Partial<AdminAnnouncement>) {
    return adminMockService.createAnnouncement(announcement);
  }
  async updateAnnouncement(id: string, announcement: Partial<AdminAnnouncement>) {
    return adminMockService.updateAnnouncement(id, announcement);
  }
  async deleteAnnouncement(id: string) {
    return adminMockService.deleteAnnouncement(id);
  }
  async publishAnnouncement(id: string) {
    return adminMockService.publishAnnouncement(id);
  }
  async getDocuments(filters?: Partial<FilterOptions>) {
    return adminMockService.getDocuments(filters);
  }
  async uploadDocument(doc: Partial<AdminDocument>) {
    return adminMockService.uploadDocument(doc);
  }
  async deleteDocument(id: string) {
    return adminMockService.deleteDocument(id);
  }
  async getAuditLogs(filters?: Partial<FilterOptions>) {
    return adminMockService.getAuditLogs(filters);
  }
  async getReports() {
    return adminMockService.getReports();
  }
  async generateReport(type: string, filters: Record<string, unknown>) {
    return adminMockService.generateReport(type, filters);
  }
  async getSettings() {
    return adminMockService.getSettings();
  }
  async updateSettings(settings: Partial<AdminSettings>) {
    return adminMockService.updateSettings(settings);
  }
}

export const adminApi: AdminApiService = environment.useMockApi
  ? new MockAdminApi()
  : new AdminApi();
