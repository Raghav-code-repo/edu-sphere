export interface FacultyProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  designation: string;
  employeeId: string;
  hireDate: string;
  officeLocation?: string;
  specialization?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface FacultySettings {
  notifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  darkMode: boolean;
  language: string;
  twoFactorEnabled: boolean;
}

export interface FacultyDashboardStats {
  totalStudents: number;
  classesToday: number;
  pendingReview: number;
  averagePerformance: number;
}

export interface FacultyCourse {
  id: string;
  name: string;
  code: string;
  credits: number;
  department: string;
  semester: string;
  year: string;
  description: string;
  color?: string;
  studentCount: number;
}

export interface FacultyClass {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  semester: string;
  year: string;
  studentCount: number;
  schedule: {
    day: string;
    time: string;
  };
  faculty: string;
  description?: string;
  color?: string;
}

export interface TodayClass {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  startTime: string;
  endTime: string;
  location: string;
  studentsCount: number;
  type: 'lecture' | 'lab' | 'tutorial';
  color?: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  enrollmentNumber: string;
  department: string;
  year: string;
  semester: string;
  avatarUrl?: string;
  phone?: string;
  gpa?: number;
  attendance?: number;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface StudentWithAttendance {
  studentId: string;
  studentName: string;
  avatarUrl?: string;
  enrollmentNumber: string;
  status: AttendanceStatus;
}

export interface AttendanceSession {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  date: string;
  students: StudentWithAttendance[];
}

export interface Assignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  description?: string;
  dueDate: string;
  maxPoints: number;
  status: 'draft' | 'published' | 'closed';
  submissionCount: number;
  totalStudents: number;
  createdAt: string;
  type: 'assignment' | 'quiz' | 'project';
  allowLate?: boolean;
  attachments?: string[];
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  avatarUrl?: string;
  enrollmentNumber: string;
  submittedAt: string;
  content: string;
  attachmentUrl?: string;
  grade?: number;
  maxPoints?: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'reviewed';
}

export interface SubmissionReview {
  submissionId: string;
  grade: number;
  feedback: string;
  status: 'graded' | 'reviewed';
}

export interface GradeItem {
  score: number | null;
  max: number;
  weight: number;
}

export interface GradeBookStudent {
  id: string;
  name: string;
  enrollmentNumber: string;
  avatarUrl?: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  assignments: GradeItem[];
  quiz: GradeItem;
  midterm: GradeItem;
  final: GradeItem;
  total: number;
  grade: string;
  percentage: number;
}

export interface GradebookAssignment {
  id: string;
  title: string;
  maxPoints: number;
  weight: number;
}

export interface CourseMaterial {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  title: string;
  description?: string;
  type: 'pdf' | 'video' | 'presentation' | 'assignment' | 'other';
  fileSize?: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  important: boolean;
  audience: string[];
  status: 'draft' | 'published';
}

export interface FacultyMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  read: boolean;
  avatarUrl?: string;
  courseId?: string;
  courseName?: string;
}

export interface FacultyCalendarEvent {
  id: string;
  title: string;
  type: 'class' | 'exam' | 'assignment' | 'event' | 'holiday' | 'office_hours';
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
  courseName?: string;
  courseCode?: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'attendance' | 'grades' | 'performance' | 'enrollment';
  period: string;
  generatedAt: string;
  data: Record<string, unknown>;
}

export interface StudentPerformanceData {
  studentId: string;
  studentName: string;
  enrollmentNumber: string;
  courseName: string;
  assignmentsAvg: number;
  quizzesAvg: number;
  midterm: number;
  final: number;
  overall: number;
}

export interface PendingAction {
  id: string;
  title: string;
  description: string;
  type: 'attendance' | 'grading' | 'assignment' | 'announcement';
  courseName: string;
  courseCode: string;
  routerLink: string;
  count?: number;
}

export interface SubmissionTrend {
  date: string;
  submitted: number;
  total: number;
}

export interface AttendanceAnalyticsData {
  courseName: string;
  courseCode: string;
  present: number;
  absent: number;
  late: number;
  excused: number;
  percentage: number;
}
