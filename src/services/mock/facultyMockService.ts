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

import {
  FACULTY_PROFILE,
  FACULTY_SETTINGS,
  FACULTY_COURSES,
  FACULTY_CLASSES,
  TODAY_CLASSES,
  STUDENTS,
  ATTENDANCE_SESSIONS,
  ASSIGNMENTS,
  SUBMISSIONS,
  GRADEBOOK_STUDENTS,
  COURSE_MATERIALS,
  ANNOUNCEMENTS,
  MESSAGES,
  CALENDAR_EVENTS,
  REPORTS,
  PENDING_ACTIONS,
  SUBMISSION_TRENDS,
  ATTENDANCE_ANALYTICS,
  STUDENT_PERFORMANCE,
} from './facultyMockData';

export class FacultyMockService {
  private getDelay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getProfile(): Promise<FacultyProfile> {
    await this.getDelay(400);
    return { ...FACULTY_PROFILE };
  }

  async getSettings(): Promise<FacultySettings> {
    await this.getDelay(300);
    return { ...FACULTY_SETTINGS };
  }

  async updateSettings(settings: Partial<FacultySettings>): Promise<FacultySettings> {
    await this.getDelay(400);
    Object.assign(FACULTY_SETTINGS, settings);
    return { ...FACULTY_SETTINGS };
  }

  async getDashboardStats(): Promise<FacultyDashboardStats> {
    await this.getDelay(500);
    const totalStudents = FACULTY_COURSES.reduce((sum, c) => sum + c.studentCount, 0);
    const pendingReview = SUBMISSIONS.filter((s) => s.status === 'submitted').length;
    const avgPerformance = Math.round(
      GRADEBOOK_STUDENTS.reduce((sum, s) => sum + s.percentage, 0) / GRADEBOOK_STUDENTS.length
    );
    return {
      totalStudents,
      classesToday: TODAY_CLASSES.length,
      pendingReview,
      averagePerformance: avgPerformance,
    };
  }

  async getCourses(): Promise<FacultyCourse[]> {
    await this.getDelay(400);
    return [...FACULTY_COURSES];
  }

  async getCourse(id: string): Promise<FacultyCourse | undefined> {
    await this.getDelay(300);
    return FACULTY_COURSES.find((c) => c.id === id);
  }

  async getClasses(): Promise<FacultyClass[]> {
    await this.getDelay(400);
    return [...FACULTY_CLASSES];
  }

  async getTodayClasses(): Promise<TodayClass[]> {
    await this.getDelay(300);
    return [...TODAY_CLASSES];
  }

  async getStudents(courseId?: string): Promise<Student[]> {
    await this.getDelay(400);
    if (!courseId) return [...STUDENTS];
    return STUDENTS.filter((s) => s.id.startsWith('s'));
  }

  async getStudent(id: string): Promise<Student | undefined> {
    await this.getDelay(300);
    return STUDENTS.find((s) => s.id === id);
  }

  async getAttendanceSessions(): Promise<AttendanceSession[]> {
    await this.getDelay(400);
    return [...ATTENDANCE_SESSIONS];
  }

  async getAttendanceSession(id: string): Promise<AttendanceSession | undefined> {
    await this.getDelay(300);
    return ATTENDANCE_SESSIONS.find((s) => s.id === id);
  }

  async saveAttendance(sessionId: string, students: StudentWithAttendance[]): Promise<boolean> {
    await this.getDelay(500);
    const session = ATTENDANCE_SESSIONS.find((s) => s.id === sessionId);
    if (session) {
      session.students = students;
    }
    return true;
  }

  async getAssignments(courseId?: string): Promise<Assignment[]> {
    await this.getDelay(400);
    if (!courseId) return [...ASSIGNMENTS];
    return ASSIGNMENTS.filter((a) => a.courseId === courseId);
  }

  async getAssignment(id: string): Promise<Assignment | undefined> {
    await this.getDelay(300);
    return ASSIGNMENTS.find((a) => a.id === id);
  }

  async getSubmissions(assignmentId?: string): Promise<Submission[]> {
    await this.getDelay(400);
    if (!assignmentId) return [...SUBMISSIONS];
    return SUBMISSIONS.filter((s) => s.assignmentId === assignmentId);
  }

  async getSubmission(id: string): Promise<Submission | undefined> {
    await this.getDelay(300);
    return SUBMISSIONS.find((s) => s.id === id);
  }

  async reviewSubmission(review: SubmissionReview): Promise<boolean> {
    await this.getDelay(500);
    const submission = SUBMISSIONS.find((s) => s.id === review.submissionId);
    if (submission) {
      submission.grade = review.grade;
      submission.feedback = review.feedback;
      submission.status = review.status;
    }
    return true;
  }

  async getGradebook(courseId?: string): Promise<GradeBookStudent[]> {
    await this.getDelay(400);
    if (!courseId) return [...GRADEBOOK_STUDENTS];
    return GRADEBOOK_STUDENTS.filter((s) => s.courseId === courseId);
  }

  async updateGradebook(
    studentId: string,
    updates: Partial<GradeBookStudent>
  ): Promise<GradeBookStudent | undefined> {
    await this.getDelay(400);
    const student = GRADEBOOK_STUDENTS.find((s) => s.id === studentId);
    if (student) {
      Object.assign(student, updates);
    }
    return student;
  }

  async getMaterials(courseId?: string): Promise<CourseMaterial[]> {
    await this.getDelay(400);
    if (!courseId) return [...COURSE_MATERIALS];
    return COURSE_MATERIALS.filter((m) => m.courseId === courseId);
  }

  async getAnnouncements(): Promise<Announcement[]> {
    await this.getDelay(400);
    return [...ANNOUNCEMENTS];
  }

  async createAnnouncement(
    announcement: Omit<Announcement, 'id' | 'date' | 'status'>
  ): Promise<Announcement> {
    await this.getDelay(500);
    const newAnnouncement: Announcement = {
      ...announcement,
      id: `ann${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'published',
    };
    ANNOUNCEMENTS.unshift(newAnnouncement);
    return newAnnouncement;
  }

  async getMessages(): Promise<FacultyMessage[]> {
    await this.getDelay(400);
    return [...MESSAGES];
  }

  async getMessage(id: string): Promise<FacultyMessage | undefined> {
    await this.getDelay(300);
    return MESSAGES.find((m) => m.id === id);
  }

  async sendMessage(message: Omit<FacultyMessage, 'id' | 'timestamp'>): Promise<FacultyMessage> {
    await this.getDelay(500);
    const newMessage: FacultyMessage = {
      ...message,
      id: `m${Date.now()}`,
      timestamp: new Date().toISOString().split('T')[0],
    };
    MESSAGES.unshift(newMessage);
    return newMessage;
  }

  async getCalendarEvents(startDate?: string, endDate?: string): Promise<FacultyCalendarEvent[]> {
    await this.getDelay(400);
    let events = [...CALENDAR_EVENTS];
    if (startDate && endDate) {
      events = events.filter((e) => e.date >= startDate && e.date <= endDate);
    }
    return events;
  }

  async getReports(): Promise<Report[]> {
    await this.getDelay(400);
    return [...REPORTS];
  }

  async getPendingActions(): Promise<PendingAction[]> {
    await this.getDelay(300);
    return [...PENDING_ACTIONS];
  }

  async getSubmissionTrends(): Promise<SubmissionTrend[]> {
    await this.getDelay(300);
    return [...SUBMISSION_TRENDS];
  }

  async getAttendanceAnalytics(): Promise<AttendanceAnalyticsData[]> {
    await this.getDelay(300);
    return [...ATTENDANCE_ANALYTICS];
  }

  async getStudentPerformance(): Promise<StudentPerformanceData[]> {
    await this.getDelay(400);
    return [...STUDENT_PERFORMANCE];
  }
}

export const facultyMockService = new FacultyMockService();
