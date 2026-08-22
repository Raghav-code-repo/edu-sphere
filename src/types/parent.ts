export interface Child {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  enrollmentNumber: string;
  department: string;
  year: string;
  semester: string;
  avatarUrl?: string;
}

export interface ParentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  occupation?: string;
  children: Child[];
}

export interface ParentSettings {
  notifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  language: string;
}

export interface FacultyFeedback {
  id: string;
  childId: string;
  childName: string;
  courseName: string;
  faculty: string;
  feedback: string;
  date: string;
  type: 'positive' | 'neutral' | 'concern';
}

export interface Document {
  id: string;
  childId: string;
  childName: string;
  name: string;
  type: 'report_card' | 'certificate' | 'invoice' | 'other';
  url: string;
  date: string;
  size: string;
}

export interface FeeRecord {
  id: string;
  childId: string;
  childName: string;
  academicYear: string;
  semester: string;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  payments: PaymentRecord[];
}

export interface PaymentRecord {
  id: string;
  amount: number;
  method: string;
  date: string;
  transactionId: string;
  receiptUrl?: string;
}

export interface ParentDashboardStats {
  totalChildren: number;
  averageAttendance: number;
  averageGrade: number;
  pendingFees: number;
  upcomingExams: number;
  pendingAssignments: number;
}

export interface ChildAttendanceSummary {
  childId: string;
  childName: string;
  present: number;
  absent: number;
  late: number;
  total: number;
  percentage: number;
}

export interface ChildAcademicSummary {
  childId: string;
  childName: string;
  gpa: number;
  percentage: number;
  rank?: number;
  grade: string;
}

export interface ChildAssignmentSummary {
  childId: string;
  childName: string;
  pending: number;
  submitted: number;
  graded: number;
  overdue: number;
}

export interface ChildExamSummary {
  childId: string;
  childName: string;
  upcoming: number;
  completed: number;
  missed: number;
}

export interface ParentMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'faculty' | 'admin' | 'parent';
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  read: boolean;
  avatarUrl?: string;
}

export interface PaymentService {
  initiatePayment(amount: number, childId: string): Promise<PaymentIntent>;
  getPaymentHistory(childId: string): Promise<PaymentRecord[]>;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  clientSecret?: string;
  redirectUrl?: string;
}

export interface ParentAssignment {
  id: string;
  childId: string;
  childName: string;
  title: string;
  courseName: string;
  courseCode: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
}

export interface ParentExam {
  id: string;
  childId: string;
  childName: string;
  title: string;
  courseName: string;
  courseCode: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  status: 'upcoming' | 'completed' | 'missed';
  totalMarks: number;
}

export interface ParentCalendarEvent {
  id: string;
  childId: string;
  childName: string;
  title: string;
  type: 'class' | 'exam' | 'assignment' | 'event' | 'holiday';
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  courseName?: string;
}

export interface PaymentHistoryItem {
  id: string;
  amount: number;
  method: string;
  date: string;
  transactionId: string;
  receiptUrl?: string;
  childId: string;
  childName: string;
  semester: string;
}
