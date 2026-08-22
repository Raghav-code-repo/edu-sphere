import type {
  Child,
  ParentProfile,
  ParentSettings,
  FacultyFeedback,
  Document,
  FeeRecord,
  ParentMessage,
  ParentDashboardStats,
  ChildAttendanceSummary,
  ChildAcademicSummary,
  ChildAssignmentSummary,
  ChildExamSummary,
  PaymentService,
  PaymentIntent,
  ParentAssignment,
  ParentExam,
  ParentCalendarEvent,
  PaymentHistoryItem,
} from '@/types/parent';

const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
const addMonths = (date: Date, months: number) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

const CHILDREN: Child[] = [
  {
    id: 'c1',
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'student@edusphere.demo',
    enrollmentNumber: 'EDU2024CS001',
    department: 'Computer Science',
    year: '3rd Year',
    semester: '6th Semester',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
  },
  {
    id: 'c2',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya@edusphere.demo',
    enrollmentNumber: 'EDU2024EC042',
    department: 'Electronics',
    year: '1st Year',
    semester: '2nd Semester',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
  },
];

const PARENT_PROFILE: ParentProfile = {
  id: 'p1',
  firstName: 'Rajesh',
  lastName: 'Sharma',
  email: 'parent@edusphere.demo',
  phone: '+91 98765 43210',
  address: '123 University Road, Pune, Maharashtra',
  occupation: 'Software Engineer',
  children: CHILDREN,
};

const PARENT_SETTINGS: ParentSettings = {
  notifications: true,
  emailNotifications: true,
  smsNotifications: false,
  language: 'en',
};

const FACULTY_FEEDBACK: FacultyFeedback[] = [
  {
    id: 'fb1',
    childId: 'c1',
    childName: 'Rahul Sharma',
    courseName: 'Data Structures & Algorithms',
    faculty: 'Dr. Sarah Johnson',
    feedback:
      'Rahul has shown excellent progress in understanding binary trees. His assignment was well-structured and demonstrated strong problem-solving skills.',
    date: formatDate(addDays(today, -2)),
    type: 'positive',
  },
  {
    id: 'fb2',
    childId: 'c1',
    childName: 'Rahul Sharma',
    courseName: 'Software Engineering',
    faculty: 'Dr. Emily Davis',
    feedback:
      'Good participation in group discussions. Could improve on documentation standards for sprint planning.',
    date: formatDate(addDays(today, -5)),
    type: 'neutral',
  },
  {
    id: 'fb3',
    childId: 'c2',
    childName: 'Priya Sharma',
    courseName: 'Introduction to Electronics',
    faculty: 'Prof. Robert Taylor',
    feedback:
      'Priya is a bright student with excellent lab skills. She should focus more on theoretical concepts for upcoming exams.',
    date: formatDate(addDays(today, -3)),
    type: 'positive',
  },
];

const DOCUMENTS: Document[] = [
  {
    id: 'd1',
    childId: 'c1',
    childName: 'Rahul Sharma',
    name: 'Mid-Term Report Card',
    type: 'report_card',
    url: '#',
    date: formatDate(addDays(today, -15)),
    size: '245 KB',
  },
  {
    id: 'd2',
    childId: 'c1',
    childName: 'Rahul Sharma',
    name: 'Attendance Certificate',
    type: 'certificate',
    url: '#',
    date: formatDate(addDays(today, -30)),
    size: '128 KB',
  },
  {
    id: 'd3',
    childId: 'c2',
    childName: 'Priya Sharma',
    name: 'Semester 1 Invoice',
    type: 'invoice',
    url: '#',
    date: formatDate(addDays(today, -60)),
    size: '89 KB',
  },
  {
    id: 'd4',
    childId: 'c2',
    childName: 'Priya Sharma',
    name: 'Lab Completion Certificate',
    type: 'certificate',
    url: '#',
    date: formatDate(addDays(today, -20)),
    size: '156 KB',
  },
];

const generateFeeRecords = (): FeeRecord[] => {
  const records: FeeRecord[] = [];
  const semesters = ['Fall 2024', 'Spring 2025'];
  const amounts = [45000, 48000];

  CHILDREN.forEach((child, childIndex) => {
    semesters.forEach((semester, semIndex) => {
      const total = amounts[semIndex];
      const paid = Math.floor(total * 0.7);
      const pending = total - paid;
      const dueDate = formatDate(addMonths(today, semIndex === 0 ? -2 : 2));
      const status =
        pending > 0 ? (addDays(today, -10) > new Date(dueDate) ? 'overdue' : 'pending') : 'paid';

      records.push({
        id: `fee-${child.id}-${semIndex}`,
        childId: child.id,
        childName: `${child.firstName} ${child.lastName}`,
        academicYear: '2024-25',
        semester,
        totalAmount: total,
        paidAmount: paid,
        pendingAmount: pending,
        dueDate,
        status,
        payments: [
          {
            id: `pay-${child.id}-${semIndex}-1`,
            amount: paid,
            method: 'Online Transfer',
            date: formatDate(addMonths(today, semIndex === 0 ? -3 : -1)),
            transactionId: `TXN${Date.now()}${childIndex}${semIndex}`,
            receiptUrl: '#',
          },
        ],
      });
    });
  });

  return records;
};

const FEE_RECORDS: FeeRecord[] = generateFeeRecords();

const PARENT_MESSAGES: ParentMessage[] = [
  {
    id: 'pm1',
    senderId: 'f1',
    senderName: 'Dr. Sarah Johnson',
    senderRole: 'faculty',
    subject: 'Parent-Teacher Meeting Scheduled',
    preview: 'A parent-teacher meeting has been scheduled for next week...',
    body: 'Dear Parents, a parent-teacher meeting has been scheduled for next Wednesday at 3:00 PM. Please confirm your attendance.',
    timestamp: formatDate(addDays(today, -1)),
    read: false,
  },
  {
    id: 'pm2',
    senderId: 'a1',
    senderName: 'Admin Office',
    senderRole: 'admin',
    subject: 'Fee Payment Reminder',
    preview: 'This is a reminder that the semester fee payment is due...',
    body: 'Dear Parents, this is a reminder that the semester fee payment for the current semester is due. Please make the payment at the earliest to avoid late fees.',
    timestamp: formatDate(addDays(today, -3)),
    read: false,
  },
  {
    id: 'pm3',
    senderId: 'f3',
    senderName: 'Dr. Emily Davis',
    senderRole: 'faculty',
    subject: 'Excellent Performance in SE',
    preview: 'Rahul has performed exceptionally well in the recent...',
    body: 'Dear Parents, Rahul has performed exceptionally well in the recent Software Engineering lab assessment. Keep up the good work!',
    timestamp: formatDate(addDays(today, -5)),
    read: true,
  },
];

const ATTENDANCE_TREND = [
  { month: 'Jan', rahul: 95, priya: 92 },
  { month: 'Feb', rahul: 88, priya: 95 },
  { month: 'Mar', rahul: 92, priya: 89 },
  { month: 'Apr', rahul: 85, priya: 94 },
  { month: 'May', rahul: 90, priya: 91 },
  { month: 'Jun', rahul: 94, priya: 96 },
];

const ACADEMIC_PERFORMANCE = [
  { subject: 'CS201', rahul: 85, priya: 78 },
  { subject: 'CS301', rahul: 72, priya: 88 },
  { subject: 'CS401', rahul: 91, priya: 82 },
  { subject: 'CS302', rahul: 68, priya: 91 },
];

const ASSIGNMENT_COMPLETION = [
  { month: 'Jan', rahul: 8, priya: 7 },
  { month: 'Feb', rahul: 10, priya: 9 },
  { month: 'Mar', rahul: 7, priya: 11 },
  { month: 'Apr', rahul: 9, priya: 8 },
  { month: 'May', rahul: 12, priya: 10 },
];

const EXAM_PERFORMANCE = [
  { name: 'A+', rahul: 2, priya: 3 },
  { name: 'A', rahul: 5, priya: 4 },
  { name: 'B+', rahul: 1, priya: 1 },
  { name: 'B', rahul: 0, priya: 0 },
];

export class ParentMockService implements PaymentService {
  private getDelay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getParentProfile(): Promise<ParentProfile> {
    await this.getDelay(400);
    return PARENT_PROFILE;
  }

  async getChildren(): Promise<Child[]> {
    await this.getDelay(300);
    return CHILDREN;
  }

  async getChild(id: string): Promise<Child | undefined> {
    await this.getDelay(300);
    return CHILDREN.find((c) => c.id === id);
  }

  async getDashboardStats(): Promise<ParentDashboardStats> {
    await this.getDelay(500);
    return {
      totalChildren: CHILDREN.length,
      averageAttendance: 92,
      averageGrade: 84,
      pendingFees: FEE_RECORDS.reduce((sum, f) => sum + f.pendingAmount, 0),
      upcomingExams: 4,
      pendingAssignments: 3,
    };
  }

  async getAttendance(childId?: string): Promise<ChildAttendanceSummary[]> {
    await this.getDelay(400);
    if (childId) {
      const child = CHILDREN.find((c) => c.id === childId);
      if (!child) return [];
      return [
        {
          childId: child.id,
          childName: `${child.firstName} ${child.lastName}`,
          present: 42,
          absent: 3,
          late: 2,
          total: 47,
          percentage: 89,
        },
      ];
    }
    return CHILDREN.map((child) => ({
      childId: child.id,
      childName: `${child.firstName} ${child.lastName}`,
      present: child.id === 'c1' ? 42 : 44,
      absent: child.id === 'c1' ? 3 : 2,
      late: child.id === 'c1' ? 2 : 1,
      total: 47,
      percentage: child.id === 'c1' ? 89 : 94,
    }));
  }

  async getAcademicPerformance(childId?: string): Promise<ChildAcademicSummary[]> {
    await this.getDelay(400);
    if (childId) {
      const child = CHILDREN.find((c) => c.id === childId);
      if (!child) return [];
      return [
        {
          childId: child.id,
          childName: `${child.firstName} ${child.lastName}`,
          gpa: 8.5,
          percentage: 85,
          rank: 3,
          grade: 'A',
        },
      ];
    }
    return CHILDREN.map((child) => ({
      childId: child.id,
      childName: `${child.firstName} ${child.lastName}`,
      gpa: child.id === 'c1' ? 8.5 : 9.2,
      percentage: child.id === 'c1' ? 85 : 92,
      rank: child.id === 'c1' ? 3 : 1,
      grade: child.id === 'c1' ? 'A' : 'A+',
    }));
  }

  async getAssignments(childId?: string): Promise<ParentAssignment[]> {
    await this.getDelay(400);
    if (childId) {
      const child = CHILDREN.find((c) => c.id === childId);
      if (!child) return [];
      return [
        {
          id: `pa-${child.id}-1`,
          childId: child.id,
          childName: `${child.firstName} ${child.lastName}`,
          title: 'Binary Tree Implementation',
          courseName: 'Data Structures & Algorithms',
          courseCode: 'CS201',
          dueDate: formatDate(addDays(today, 2)),
          status: 'pending',
        },
        {
          id: `pa-${child.id}-2`,
          childId: child.id,
          childName: `${child.firstName} ${child.lastName}`,
          title: 'SQL Joins Assignment',
          courseName: 'Database Management Systems',
          courseCode: 'CS301',
          dueDate: formatDate(addDays(today, 5)),
          status: 'pending',
        },
      ];
    }
    return [
      {
        id: 'pa-c1-1',
        childId: 'c1',
        childName: 'Rahul Sharma',
        title: 'Binary Tree Implementation',
        courseName: 'Data Structures & Algorithms',
        courseCode: 'CS201',
        dueDate: formatDate(addDays(today, 2)),
        status: 'pending',
      },
      {
        id: 'pa-c1-2',
        childId: 'c1',
        childName: 'Rahul Sharma',
        title: 'ER Diagram Design',
        courseName: 'Database Management Systems',
        courseCode: 'CS301',
        dueDate: formatDate(addDays(today, 5)),
        status: 'pending',
      },
      {
        id: 'pa-c2-1',
        childId: 'c2',
        childName: 'Priya Sharma',
        title: 'Circuit Design Project',
        courseName: 'Basic Electronics',
        courseCode: 'EC101',
        dueDate: formatDate(addDays(today, 3)),
        status: 'pending',
      },
    ];
  }

  async getExams(childId?: string): Promise<ParentExam[]> {
    await this.getDelay(400);
    if (childId) {
      const child = CHILDREN.find((c) => c.id === childId);
      if (!child) return [];
      return [
        {
          id: `pe-${child.id}-1`,
          childId: child.id,
          childName: `${child.firstName} ${child.lastName}`,
          title: 'Mid-Term Examination',
          courseName: 'Data Structures & Algorithms',
          courseCode: 'CS201',
          date: formatDate(addDays(today, 14)),
          startTime: '10:00 AM',
          endTime: '12:00 PM',
          location: 'Hall A',
          status: 'upcoming',
          totalMarks: 100,
        },
      ];
    }
    return [
      {
        id: 'pe-c1-1',
        childId: 'c1',
        childName: 'Rahul Sharma',
        title: 'Mid-Term Examination',
        courseName: 'Data Structures & Algorithms',
        courseCode: 'CS201',
        date: formatDate(addDays(today, 14)),
        startTime: '10:00 AM',
        endTime: '12:00 PM',
        location: 'Hall A',
        status: 'upcoming',
        totalMarks: 100,
      },
      {
        id: 'pe-c1-2',
        childId: 'c1',
        childName: 'Rahul Sharma',
        title: 'Quiz 3 - SQL Joins',
        courseName: 'Database Management Systems',
        courseCode: 'CS301',
        date: formatDate(addDays(today, 5)),
        startTime: '02:00 PM',
        endTime: '02:45 PM',
        location: 'Room 204',
        status: 'upcoming',
        totalMarks: 20,
      },
      {
        id: 'pe-c2-1',
        childId: 'c2',
        childName: 'Priya Sharma',
        title: 'Electronics Lab Test',
        courseName: 'Basic Electronics',
        courseCode: 'EC101',
        date: formatDate(addDays(today, 7)),
        startTime: '11:00 AM',
        endTime: '12:30 PM',
        location: 'Lab 2',
        status: 'upcoming',
        totalMarks: 30,
      },
    ];
  }

  async getFees(): Promise<FeeRecord[]> {
    await this.getDelay(400);
    return FEE_RECORDS;
  }

  async getFeeById(id: string): Promise<FeeRecord | undefined> {
    await this.getDelay(300);
    return FEE_RECORDS.find((f) => f.id === id);
  }

  async getMessages(): Promise<ParentMessage[]> {
    await this.getDelay(400);
    return PARENT_MESSAGES;
  }

  async getCalendarEvents(childId?: string): Promise<ParentCalendarEvent[]> {
    await this.getDelay(400);
    const events = [
      {
        id: 'ce1',
        childId: 'c1',
        childName: 'Rahul Sharma',
        title: 'Data Structures Lecture',
        type: 'class',
        date: formatDate(addDays(today, 1)),
        startTime: '10:00 AM',
        endTime: '11:00 AM',
        location: 'Room 301',
        courseName: 'Data Structures & Algorithms',
      },
      {
        id: 'ce2',
        childId: 'c1',
        childName: 'Rahul Sharma',
        title: 'Mid-Term - CS201',
        type: 'exam',
        date: formatDate(addDays(today, 14)),
        startTime: '10:00 AM',
        endTime: '12:00 PM',
        location: 'Hall A',
        courseName: 'Data Structures & Algorithms',
      },
      {
        id: 'ce3',
        childId: 'c2',
        childName: 'Priya Sharma',
        title: 'Electronics Lab',
        type: 'class',
        date: formatDate(addDays(today, 2)),
        startTime: '02:00 PM',
        endTime: '04:00 PM',
        location: 'Lab 2',
        courseName: 'Basic Electronics',
      },
      {
        id: 'ce4',
        childId: 'c1',
        childName: 'Rahul Sharma',
        title: 'Parent-Teacher Meeting',
        type: 'event',
        date: formatDate(addDays(today, 5)),
        startTime: '03:00 PM',
        endTime: '04:00 PM',
        location: 'Conference Hall',
      },
      {
        id: 'ce5',
        childId: 'c2',
        childName: 'Priya Sharma',
        title: 'Independence Day',
        type: 'holiday',
        date: formatDate(addDays(today, 10)),
      },
    ];
    if (childId) {
      return events.filter((e) => e.childId === childId) as ParentCalendarEvent[];
    }
    return events as ParentCalendarEvent[];
  }

  async getDocuments(childId?: string): Promise<Document[]> {
    await this.getDelay(400);
    if (childId) {
      return DOCUMENTS.filter((d) => d.childId === childId);
    }
    return DOCUMENTS;
  }

  async getFacultyFeedback(childId?: string): Promise<FacultyFeedback[]> {
    await this.getDelay(400);
    if (childId) {
      return FACULTY_FEEDBACK.filter((f) => f.childId === childId);
    }
    return FACULTY_FEEDBACK;
  }

  async getSettings(): Promise<ParentSettings> {
    await this.getDelay(300);
    return PARENT_SETTINGS;
  }

  async updateSettings(settings: Partial<ParentSettings>): Promise<ParentSettings> {
    await this.getDelay(400);
    Object.assign(PARENT_SETTINGS, settings);
    return { ...PARENT_SETTINGS };
  }

  async getAttendanceTrend() {
    await this.getDelay(400);
    return ATTENDANCE_TREND;
  }

  async getAcademicPerformanceChartData() {
    await this.getDelay(400);
    return ACADEMIC_PERFORMANCE;
  }

  async getAssignmentCompletion() {
    await this.getDelay(400);
    return ASSIGNMENT_COMPLETION;
  }

  async getExamPerformance() {
    await this.getDelay(400);
    return EXAM_PERFORMANCE;
  }

  async getChildAttendanceSummary(): Promise<ChildAttendanceSummary[]> {
    await this.getDelay(400);
    return [
      {
        childId: 'c1',
        childName: 'Rahul Sharma',
        present: 42,
        absent: 3,
        late: 2,
        total: 47,
        percentage: 89,
      },
      {
        childId: 'c2',
        childName: 'Priya Sharma',
        present: 44,
        absent: 2,
        late: 1,
        total: 47,
        percentage: 94,
      },
    ];
  }

  async getChildAcademicSummary(): Promise<ChildAcademicSummary[]> {
    await this.getDelay(400);
    return [
      { childId: 'c1', childName: 'Rahul Sharma', gpa: 8.5, percentage: 85, rank: 3, grade: 'A' },
      { childId: 'c2', childName: 'Priya Sharma', gpa: 9.2, percentage: 92, rank: 1, grade: 'A+' },
    ];
  }

  async getChildAssignmentSummary(): Promise<ChildAssignmentSummary[]> {
    await this.getDelay(400);
    return [
      { childId: 'c1', childName: 'Rahul Sharma', pending: 2, submitted: 1, graded: 3, overdue: 1 },
      { childId: 'c2', childName: 'Priya Sharma', pending: 1, submitted: 0, graded: 2, overdue: 0 },
    ];
  }

  async getChildExamSummary(): Promise<ChildExamSummary[]> {
    await this.getDelay(400);
    return [
      { childId: 'c1', childName: 'Rahul Sharma', upcoming: 2, completed: 3, missed: 0 },
      { childId: 'c2', childName: 'Priya Sharma', upcoming: 1, completed: 2, missed: 0 },
    ];
  }

  async initiatePayment(amount: number, childId: string): Promise<PaymentIntent> {
    await this.getDelay(600);
    return {
      id: `pi_${Date.now()}`,
      amount,
      currency: 'INR',
      status: 'pending',
      clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substring(7)}`,
      redirectUrl: `/parent/fees?payment=pending&childId=${childId}`,
    };
  }

  async getPaymentHistory(childId: string): Promise<PaymentHistoryItem[]> {
    await this.getDelay(400);
    return FEE_RECORDS.filter((f) => f.childId === childId).flatMap((f) =>
      f.payments.map((p) => ({ ...p, childId, childName: f.childName, semester: f.semester }))
    );
  }
}

export const parentMockService = new ParentMockService();
