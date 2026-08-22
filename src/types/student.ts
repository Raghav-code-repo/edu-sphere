export interface Course {
  id: string;
  name: string;
  code: string;
  faculty: string;
  facultyId: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  nextLesson?: {
    title: string;
    scheduledAt: string;
  };
  schedule?: {
    day: string;
    time: string;
  };
  description?: string;
  color?: string;
}

export interface Assignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  faculty: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  grade?: string;
  maxGrade?: string;
  description?: string;
  attachmentUrl?: string;
}

export interface Exam {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status: 'upcoming' | 'completed' | 'missed';
  totalMarks: number;
  obtainedMarks?: number;
  result?: string;
}

export interface AttendanceRecord {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
}

export interface GradeRecord {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  faculty: string;
  type: 'assignment' | 'exam' | 'quiz' | 'project';
  title: string;
  obtainedMarks: number;
  totalMarks: number;
  grade: string;
  date: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'faculty' | 'admin' | 'student';
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  read: boolean;
  avatarUrl?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'class' | 'exam' | 'assignment' | 'event' | 'holiday';
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
  courseName?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  important: boolean;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
}

export interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  enrollmentNumber: string;
  department: string;
  year: string;
  semester: string;
  avatarUrl?: string;
  guardianName?: string;
  guardianPhone?: string;
}

export interface StudentSettings {
  notifications: boolean;
  emailNotifications: boolean;
  darkMode: boolean;
  language: string;
}

export interface DashboardStats {
  attendancePercentage: number;
  academicProgress: number;
  pendingAssignments: number;
  upcomingExams: number;
  totalCourses: number;
  completedLessons: number;
  totalLessons: number;
  gpa: number;
}
