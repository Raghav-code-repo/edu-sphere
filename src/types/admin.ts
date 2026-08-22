export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'STUDENT' | 'PARENT' | 'FACULTY' | 'ADMIN' | 'SUPER_ADMIN';
  department?: string;
  status: UserStatus;
  phone?: string;
  avatarUrl?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStudent extends AdminUser {
  enrollmentNumber: string;
  year: string;
  semester: string;
  classId?: string;
  className?: string;
  gpa?: number;
  attendancePercentage?: number;
  guardianName?: string;
  guardianPhone?: string;
  dateOfBirth?: string;
  address?: string;
}

export interface AdminParent extends AdminUser {
  occupation?: string;
  address?: string;
  childrenCount: number;
  children: AdminChild[];
}

export interface AdminChild {
  id: string;
  firstName: string;
  lastName: string;
  enrollmentNumber: string;
  className?: string;
}

export interface AdminFaculty extends AdminUser {
  employeeId: string;
  designation: string;
  hireDate: string;
  specialization?: string;
  officeLocation?: string;
  bio?: string;
  workload: number;
  classesCount: number;
  studentsCount: number;
}

export interface AdminCourse {
  id: string;
  name: string;
  code: string;
  department: string;
  credits: number;
  semester: string;
  year: string;
  description?: string;
  facultyId?: string;
  facultyName?: string;
  status: 'draft' | 'published' | 'archived';
  studentCount: number;
  moduleCount: number;
  lessonCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminClass {
  id: string;
  name: string;
  code: string;
  department: string;
  semester: string;
  year: string;
  section?: string;
  room?: string;
  schedule?: {
    day: string;
    time: string;
  };
  facultyId?: string;
  facultyName?: string;
  studentCount: number;
  capacity: number;
  createdAt: string;
}

export interface AdminSubject {
  id: string;
  name: string;
  code: string;
  department: string;
  credits: number;
  description?: string;
  prerequisites?: string[];
  courseIds: string[];
  createdAt: string;
}

export interface AdminDepartment {
  id: string;
  name: string;
  code: string;
  headOfDepartment?: string;
  facultyCount: number;
  studentCount: number;
  courseCount: number;
  description?: string;
  createdAt: string;
}

export interface AdminAttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  enrollmentNumber: string;
  classId: string;
  className: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  markedBy: string;
  markedAt: string;
  remarks?: string;
}

export interface AdminAssignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  classId: string;
  className: string;
  description?: string;
  dueDate: string;
  totalMarks: number;
  status: 'draft' | 'published' | 'closed';
  submissionCount: number;
  totalStudents: number;
  createdAt: string;
  createdBy: string;
}

export interface AdminExam {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  classId: string;
  className: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalMarks: number;
  passingMarks: number;
  location: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface AdminExamResult {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  enrollmentNumber: string;
  obtainedMarks: number;
  totalMarks: number;
  grade: string;
  status: 'pass' | 'fail' | 'absent';
}

export interface AdminFee {
  id: string;
  studentId: string;
  studentName: string;
  enrollmentNumber: string;
  academicYear: string;
  semester: string;
  feeType: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  payments: AdminPayment[];
  createdAt: string;
}

export interface AdminPayment {
  id: string;
  feeId: string;
  amount: number;
  method: string;
  date: string;
  transactionId: string;
  status: 'success' | 'failed' | 'pending';
  receiptUrl?: string;
}

export interface AdminAnnouncement {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'academic' | 'event' | 'urgent';
  targetAudience: ('all' | 'students' | 'parents' | 'faculty')[];
  status: 'draft' | 'published' | 'archived';
  publishedAt?: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminDocument {
  id: string;
  name: string;
  type: 'report' | 'certificate' | 'invoice' | 'policy' | 'other';
  category: string;
  fileSize: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  accessLevel: 'public' | 'internal' | 'confidential';
  tags: string[];
}

export interface AdminAuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  entityType: string;
  entityId: string;
  entityName: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface AdminReport {
  id: string;
  title: string;
  type: 'attendance' | 'grades' | 'performance' | 'enrollment' | 'financial' | 'custom';
  period: string;
  generatedAt: string;
  generatedBy: string;
  data: Record<string, unknown>;
  filters: Record<string, unknown>;
}

export interface AdminAnalytics {
  enrollmentTrend: Array<{ month: string; students: number; parents: number; faculty: number }>;
  attendanceTrend: Array<{ date: string; present: number; absent: number; late: number }>;
  academicPerformance: Array<{ course: string; average: number; passRate: number }>;
  feeCollection: Array<{ month: string; collected: number; pending: number }>;
  courseActivity: Array<{ course: string; engagement: number; submissions: number }>;
  facultyWorkload: Array<{ faculty: string; classes: number; students: number; hours: number }>;
}

export interface AdminSettings {
  institutionName: string;
  institutionCode: string;
  academicYear: string;
  currentSemester: string;
  timezone: string;
  dateFormat: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  autoEnrollment: boolean;
  gradeSystem: string;
  passPercentage: number;
  maxAbsenceAllowed: number;
  features: {
    attendanceTracking: boolean;
    onlineExams: boolean;
    feeManagement: boolean;
    documentManagement: boolean;
    auditLogging: boolean;
  };
}

export interface AdminDashboardStats {
  totalStudents: number;
  totalParents: number;
  totalFaculty: number;
  activeCourses: number;
  attendanceToday: number;
  pendingFees: number;
  upcomingExams: number;
  newEnrollments: number;
  activeClasses: number;
}

export interface FilterOptions {
  search?: string;
  role?: string;
  status?: string;
  department?: string;
  classId?: string;
  dateFrom?: string;
  dateTo?: string;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
