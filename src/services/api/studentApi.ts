import type {
  Course,
  Assignment,
  Exam,
  AttendanceRecord,
  GradeRecord,
  Message,
  CalendarEvent,
  Announcement,
  ActivityLog,
  StudentProfile,
  StudentSettings,
  DashboardStats,
} from '@/types/student';
import { environment } from '@/config/environment';
import { studentMockService } from '@/services/mock/studentMockService';
import { getApiClient } from './apiClient';

export interface StudentApiService {
  getCourses(): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  getAssignments(): Promise<Assignment[]>;
  getAssignment(id: string): Promise<Assignment | undefined>;
  getExams(): Promise<Exam[]>;
  getExam(id: string): Promise<Exam | undefined>;
  getAttendance(): Promise<AttendanceRecord[]>;
  getAttendanceByCourse(courseId: string): Promise<AttendanceRecord[]>;
  getGrades(): Promise<GradeRecord[]>;
  getGradesByCourse(courseId: string): Promise<GradeRecord[]>;
  getMessages(): Promise<Message[]>;
  getMessage(id: string): Promise<Message | undefined>;
  getCalendarEvents(startDate?: string, endDate?: string): Promise<CalendarEvent[]>;
  getAnnouncements(): Promise<Announcement[]>;
  getActivityLog(): Promise<ActivityLog[]>;
  getProfile(): Promise<StudentProfile>;
  getSettings(): Promise<StudentSettings>;
  updateSettings(settings: Partial<StudentSettings>): Promise<StudentSettings>;
  getDashboardStats(): Promise<DashboardStats>;
}

class StudentApi implements StudentApiService {
  private readonly client = getApiClient();

  async getCourses(): Promise<Course[]> {
    return this.client.get<Course[]>('/api/student/courses');
  }

  async getCourse(id: string): Promise<Course | undefined> {
    return this.client.get<Course>(`/api/student/courses/${id}`);
  }

  async getAssignments(): Promise<Assignment[]> {
    return this.client.get<Assignment[]>('/api/student/assignments');
  }

  async getAssignment(id: string): Promise<Assignment | undefined> {
    return this.client.get<Assignment>(`/api/student/assignments/${id}`);
  }

  async getExams(): Promise<Exam[]> {
    return this.client.get<Exam[]>('/api/student/exams');
  }

  async getExam(id: string): Promise<Exam | undefined> {
    return this.client.get<Exam>(`/api/student/exams/${id}`);
  }

  async getAttendance(): Promise<AttendanceRecord[]> {
    return this.client.get<AttendanceRecord[]>('/api/student/attendance');
  }

  async getAttendanceByCourse(courseId: string): Promise<AttendanceRecord[]> {
    return this.client.get<AttendanceRecord[]>('/api/student/attendance', {
      params: { courseId },
    });
  }

  async getGrades(): Promise<GradeRecord[]> {
    return this.client.get<GradeRecord[]>('/api/student/grades');
  }

  async getGradesByCourse(courseId: string): Promise<GradeRecord[]> {
    return this.client.get<GradeRecord[]>('/api/student/grades', {
      params: { courseId },
    });
  }

  async getMessages(): Promise<Message[]> {
    return this.client.get<Message[]>('/api/student/messages');
  }

  async getMessage(id: string): Promise<Message | undefined> {
    return this.client.get<Message>(`/api/student/messages/${id}`);
  }

  async getCalendarEvents(startDate?: string, endDate?: string): Promise<CalendarEvent[]> {
    return this.client.get<CalendarEvent[]>('/api/student/calendar', {
      params: { startDate, endDate },
    });
  }

  async getAnnouncements(): Promise<Announcement[]> {
    return this.client.get<Announcement[]>('/api/student/announcements');
  }

  async getActivityLog(): Promise<ActivityLog[]> {
    return this.client.get<ActivityLog[]>('/api/student/activity-log');
  }

  async getProfile(): Promise<StudentProfile> {
    return this.client.get<StudentProfile>('/api/student/profile');
  }

  async getSettings(): Promise<StudentSettings> {
    return this.client.get<StudentSettings>('/api/student/settings');
  }

  async updateSettings(settings: Partial<StudentSettings>): Promise<StudentSettings> {
    return this.client.patch<StudentSettings>('/api/student/settings', settings);
  }

  async getDashboardStats(): Promise<DashboardStats> {
    return this.client.get<DashboardStats>('/api/student/dashboard/stats');
  }
}

class MockStudentApi implements StudentApiService {
  async getCourses() {
    return studentMockService.getCourses();
  }
  async getCourse(id: string) {
    return studentMockService.getCourse(id);
  }
  async getAssignments() {
    return studentMockService.getAssignments();
  }
  async getAssignment(id: string) {
    return studentMockService.getAssignment(id);
  }
  async getExams() {
    return studentMockService.getExams();
  }
  async getExam(id: string) {
    return studentMockService.getExam(id);
  }
  async getAttendance() {
    return studentMockService.getAttendance();
  }
  async getAttendanceByCourse(courseId: string) {
    return studentMockService.getAttendanceByCourse(courseId);
  }
  async getGrades() {
    return studentMockService.getGrades();
  }
  async getGradesByCourse(courseId: string) {
    return studentMockService.getGradesByCourse(courseId);
  }
  async getMessages() {
    return studentMockService.getMessages();
  }
  async getMessage(id: string) {
    return studentMockService.getMessage(id);
  }
  async getCalendarEvents(startDate?: string, endDate?: string) {
    return studentMockService.getCalendarEvents(startDate, endDate);
  }
  async getAnnouncements() {
    return studentMockService.getAnnouncements();
  }
  async getActivityLog() {
    return studentMockService.getActivityLog();
  }
  async getProfile() {
    return studentMockService.getProfile();
  }
  async getSettings() {
    return studentMockService.getSettings();
  }
  async updateSettings(settings: Partial<StudentSettings>) {
    return studentMockService.updateSettings(settings);
  }
  async getDashboardStats() {
    return studentMockService.getDashboardStats();
  }
}

export const studentApi: StudentApiService = environment.useMockApi
  ? new MockStudentApi()
  : new StudentApi();
