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
} from '@/types/student';

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

const COURSES: Course[] = [
  {
    id: '1',
    name: 'Data Structures & Algorithms',
    code: 'CS201',
    faculty: 'Dr. Sarah Johnson',
    facultyId: 'f1',
    progress: 65,
    totalLessons: 24,
    completedLessons: 16,
    nextLesson: {
      title: 'Binary Trees - Traversal Techniques',
      scheduledAt: formatDate(addDays(today, 1)),
    },
    schedule: {
      day: 'Monday, Wednesday',
      time: '10:00 AM - 11:00 AM',
    },
    description: 'Learn fundamental data structures and algorithms.',
    color: '#0ea5e9',
  },
  {
    id: '2',
    name: 'Database Management Systems',
    code: 'CS301',
    faculty: 'Prof. Michael Chen',
    facultyId: 'f2',
    progress: 42,
    totalLessons: 20,
    completedLessons: 8,
    nextLesson: {
      title: 'SQL Joins and Subqueries',
      scheduledAt: formatDate(addDays(today, 2)),
    },
    schedule: {
      day: 'Tuesday, Thursday',
      time: '02:00 PM - 03:00 PM',
    },
    description: 'Relational databases, SQL, and database design.',
    color: '#10b981',
  },
  {
    id: '3',
    name: 'Software Engineering',
    code: 'CS401',
    faculty: 'Dr. Emily Davis',
    facultyId: 'f3',
    progress: 88,
    totalLessons: 18,
    completedLessons: 16,
    nextLesson: {
      title: 'Agile Project Management',
      scheduledAt: formatDate(addDays(today, 0)),
    },
    schedule: {
      day: 'Wednesday, Friday',
      time: '11:00 AM - 12:00 PM',
    },
    description: 'Software development lifecycle and methodologies.',
    color: '#f59e0b',
  },
  {
    id: '4',
    name: 'Computer Networks',
    code: 'CS302',
    faculty: 'Prof. James Wilson',
    facultyId: 'f4',
    progress: 30,
    totalLessons: 22,
    completedLessons: 7,
    nextLesson: {
      title: 'OSI Model and TCP/IP',
      scheduledAt: formatDate(addDays(today, 3)),
    },
    schedule: {
      day: 'Monday, Thursday',
      time: '03:00 PM - 04:00 PM',
    },
    description: 'Network fundamentals, protocols, and security.',
    color: '#8b5cf6',
  },
];

const ASSIGNMENTS: Assignment[] = [
  {
    id: 'a1',
    title: 'Binary Tree Implementation',
    courseId: '1',
    courseName: 'Data Structures & Algorithms',
    courseCode: 'CS201',
    faculty: 'Dr. Sarah Johnson',
    dueDate: formatDate(addDays(today, 2)),
    status: 'pending',
    description: 'Implement binary tree with traversal methods.',
    maxGrade: '100',
  },
  {
    id: 'a2',
    title: 'ER Diagram Design',
    courseId: '2',
    courseName: 'Database Management Systems',
    courseCode: 'CS301',
    faculty: 'Prof. Michael Chen',
    dueDate: formatDate(addDays(today, 5)),
    status: 'pending',
    description: 'Design an ER diagram for a library management system.',
    maxGrade: '50',
  },
  {
    id: 'a3',
    title: 'Sprint Planning Document',
    courseId: '3',
    courseName: 'Software Engineering',
    courseCode: 'CS401',
    faculty: 'Dr. Emily Davis',
    dueDate: formatDate(addDays(today, -1)),
    status: 'submitted',
    description: 'Create a sprint planning document for the team project.',
    maxGrade: '100',
  },
  {
    id: 'a4',
    title: 'Network Topology Analysis',
    courseId: '4',
    courseName: 'Computer Networks',
    courseCode: 'CS302',
    faculty: 'Prof. James Wilson',
    dueDate: formatDate(addDays(today, -3)),
    status: 'overdue',
    description: 'Analyze different network topologies.',
    maxGrade: '75',
  },
  {
    id: 'a5',
    title: 'Sorting Algorithms Comparison',
    courseId: '1',
    courseName: 'Data Structures & Algorithms',
    courseCode: 'CS201',
    faculty: 'Dr. Sarah Johnson',
    dueDate: formatDate(addDays(today, -7)),
    status: 'graded',
    grade: '92',
    maxGrade: '100',
    description: 'Compare time complexities of sorting algorithms.',
  },
];

const EXAMS: Exam[] = [
  {
    id: 'e1',
    title: 'Mid-Term Examination',
    courseId: '1',
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
    id: 'e2',
    title: 'Quiz 3 - SQL Joins',
    courseId: '2',
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
    id: 'e3',
    title: 'Lab Assessment 2',
    courseId: '3',
    courseName: 'Software Engineering',
    courseCode: 'CS401',
    date: formatDate(addDays(today, -10)),
    startTime: '11:00 AM',
    endTime: '01:00 PM',
    location: 'Lab 3',
    status: 'completed',
    totalMarks: 50,
    obtainedMarks: 45,
    result: 'A',
  },
  {
    id: 'e4',
    title: 'Networking Basics Test',
    courseId: '4',
    courseName: 'Computer Networks',
    courseCode: 'CS302',
    date: formatDate(addDays(today, -20)),
    startTime: '03:00 PM',
    endTime: '04:00 PM',
    location: 'Room 105',
    status: 'completed',
    totalMarks: 30,
    obtainedMarks: 27,
    result: 'A-',
  },
];

const ATTENDANCE: AttendanceRecord[] = (() => {
  const records: AttendanceRecord[] = [];
  const statuses: Array<'present' | 'absent' | 'late' | 'excused'> = [
    'present',
    'present',
    'present',
    'present',
    'present',
    'late',
    'present',
    'absent',
  ];
  for (let i = 0; i < 60; i++) {
    const date = addDays(addMonths(today, -2), i);
    if (date > today) continue;
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    records.push({
      id: `att-${i}`,
      courseId: COURSES[i % 4].id,
      courseName: COURSES[i % 4].name,
      courseCode: COURSES[i % 4].code,
      date: formatDate(date),
      status: statuses[i % statuses.length],
    });
  }
  return records;
})();

const GRADES: GradeRecord[] = [
  {
    id: 'g1',
    courseId: '1',
    courseName: 'Data Structures & Algorithms',
    courseCode: 'CS201',
    faculty: 'Dr. Sarah Johnson',
    type: 'exam',
    title: 'Mid-Term Exam',
    obtainedMarks: 85,
    totalMarks: 100,
    grade: 'A',
    date: formatDate(addDays(today, -15)),
  },
  {
    id: 'g2',
    courseId: '2',
    courseName: 'Database Management Systems',
    courseCode: 'CS301',
    faculty: 'Prof. Michael Chen',
    type: 'assignment',
    title: 'SQL Assignment 1',
    obtainedMarks: 42,
    totalMarks: 50,
    grade: 'A',
    date: formatDate(addDays(today, -20)),
  },
  {
    id: 'g3',
    courseId: '3',
    courseName: 'Software Engineering',
    courseCode: 'CS401',
    faculty: 'Dr. Emily Davis',
    type: 'project',
    title: 'UML Diagrams',
    obtainedMarks: 38,
    totalMarks: 40,
    grade: 'A+',
    date: formatDate(addDays(today, -25)),
  },
  {
    id: 'g4',
    courseId: '4',
    courseName: 'Computer Networks',
    courseCode: 'CS302',
    faculty: 'Prof. James Wilson',
    type: 'quiz',
    title: 'OSI Model Quiz',
    obtainedMarks: 18,
    totalMarks: 20,
    grade: 'A',
    date: formatDate(addDays(today, -10)),
  },
  {
    id: 'g5',
    courseId: '1',
    courseName: 'Data Structures & Algorithms',
    courseCode: 'CS201',
    faculty: 'Dr. Sarah Johnson',
    type: 'assignment',
    title: 'Sorting Algorithms',
    obtainedMarks: 48,
    totalMarks: 50,
    grade: 'A+',
    date: formatDate(addDays(today, -30)),
  },
  {
    id: 'g6',
    courseId: '2',
    courseName: 'Database Management Systems',
    courseCode: 'CS301',
    faculty: 'Prof. Michael Chen',
    type: 'exam',
    title: 'Quiz 2',
    obtainedMarks: 15,
    totalMarks: 20,
    grade: 'A-',
    date: formatDate(addDays(today, -12)),
  },
];

const MESSAGES: Message[] = [
  {
    id: 'm1',
    senderId: 'f1',
    senderName: 'Dr. Sarah Johnson',
    senderRole: 'faculty',
    subject: 'Assignment Deadline Extension',
    preview: 'The deadline for the binary tree assignment has been extended...',
    body: 'Dear Students, the deadline for the binary tree assignment has been extended by 2 days. Please submit your work through the portal.',
    timestamp: formatDate(addDays(today, -1)),
    read: false,
  },
  {
    id: 'm2',
    senderId: 'a1',
    senderName: 'Admin Office',
    senderRole: 'admin',
    subject: 'Mid-Term Examination Schedule',
    preview: 'The mid-term examination schedule has been published...',
    body: 'Dear Students, the mid-term examination schedule for the current semester has been published. Please check the exam portal for your specific schedule.',
    timestamp: formatDate(addDays(today, -2)),
    read: false,
  },
  {
    id: 'm3',
    senderId: 'f3',
    senderName: 'Dr. Emily Davis',
    senderRole: 'faculty',
    subject: 'Lab Session Rescheduled',
    preview: "This week's lab session has been moved to Friday...",
    body: "Dear Students, due to a scheduling conflict, this week's lab session has been moved to Friday at the same time slot.",
    timestamp: formatDate(addDays(today, -3)),
    read: true,
  },
  {
    id: 'm4',
    senderId: 'f2',
    senderName: 'Prof. Michael Chen',
    senderRole: 'faculty',
    subject: 'Grade Posted - Quiz 2',
    preview: 'Grades for Quiz 2 have been posted...',
    body: 'Dear Students, grades for Quiz 2 have been posted. Please check your grades on the portal.',
    timestamp: formatDate(addDays(today, -5)),
    read: true,
  },
  {
    id: 'm5',
    senderId: 'f4',
    senderName: 'Prof. James Wilson',
    senderRole: 'faculty',
    subject: 'Project Guidelines',
    preview: 'The final project guidelines have been released...',
    body: 'Dear Students, the final project guidelines for Computer Networks have been released. Please review them carefully.',
    timestamp: formatDate(addDays(today, -7)),
    read: true,
  },
];

const CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'cal1',
    title: 'Data Structures Lecture',
    type: 'class',
    date: formatDate(addDays(today, 1)),
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    location: 'Room 301',
    courseName: 'Data Structures & Algorithms',
  },
  {
    id: 'cal2',
    title: 'Database Lecture',
    type: 'class',
    date: formatDate(addDays(today, 2)),
    startTime: '02:00 PM',
    endTime: '03:00 PM',
    location: 'Room 205',
    courseName: 'Database Management Systems',
  },
  {
    id: 'cal3',
    title: 'Mid-Term - CS201',
    type: 'exam',
    date: formatDate(addDays(today, 14)),
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    location: 'Hall A',
    courseName: 'Data Structures & Algorithms',
  },
  {
    id: 'cal4',
    title: 'Binary Tree Assignment Due',
    type: 'assignment',
    date: formatDate(addDays(today, 2)),
    courseName: 'Data Structures & Algorithms',
  },
  {
    id: 'cal5',
    title: 'SQL Joins Quiz',
    type: 'exam',
    date: formatDate(addDays(today, 5)),
    startTime: '02:00 PM',
    endTime: '02:45 PM',
    location: 'Room 204',
    courseName: 'Database Management Systems',
  },
  {
    id: 'cal6',
    title: 'Independence Day',
    type: 'holiday',
    date: formatDate(addDays(today, 10)),
  },
  {
    id: 'cal7',
    title: 'Tech Fest',
    type: 'event',
    date: formatDate(addDays(today, 20)),
    description: 'Annual technical festival with workshops and competitions.',
  },
];

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann1',
    title: 'Mid-Term Examination Schedule Released',
    content:
      'The mid-term examination schedule for the current semester has been published. Please check the exam portal for your specific schedule and venue details.',
    author: 'Academic Office',
    date: formatDate(addDays(today, -1)),
    important: true,
  },
  {
    id: 'ann2',
    title: 'Library Extended Hours During Exams',
    content: 'The library will remain open 24/7 during the mid-term examination period.',
    author: 'Library Admin',
    date: formatDate(addDays(today, -2)),
    important: false,
  },
  {
    id: 'ann3',
    title: 'Software Engineering Lab Session Moved',
    content: 'Lab session for Software Engineering has been moved to Friday this week.',
    author: 'Dr. Emily Davis',
    date: formatDate(addDays(today, -3)),
    important: false,
  },
];

const ACTIVITY_LOG: ActivityLog[] = [
  {
    id: 'act1',
    action: 'Assignment Submitted',
    description: 'Submitted Sprint Planning Document',
    timestamp: formatDate(addDays(today, -1)),
  },
  {
    id: 'act2',
    action: 'Lecture Attended',
    description: 'Software Engineering - Agile Methodologies',
    timestamp: formatDate(addDays(today, -1)),
  },
  {
    id: 'act3',
    action: 'Grade Received',
    description: 'Sorting Algorithms Comparison - A+',
    timestamp: formatDate(addDays(today, -7)),
  },
  {
    id: 'act4',
    action: 'Course Completed',
    description: 'Introduction to Python',
    timestamp: formatDate(addDays(today, -10)),
  },
  {
    id: 'act5',
    action: 'Quiz Completed',
    description: 'Networking Basics Test',
    timestamp: formatDate(addDays(today, -20)),
  },
];

const PROFILE: StudentProfile = {
  id: 's1',
  firstName: 'Rahul',
  lastName: 'Sharma',
  email: 'student@edusphere.demo',
  phone: '+91 98765 43210',
  dateOfBirth: '2002-05-15',
  address: '123 University Road, Pune, Maharashtra',
  enrollmentNumber: 'EDU2024CS001',
  department: 'Computer Science',
  year: '3rd Year',
  semester: '6th Semester',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
  guardianName: 'Mr. Rajesh Sharma',
  guardianPhone: '+91 98765 43211',
};

const SETTINGS: StudentSettings = {
  notifications: true,
  emailNotifications: true,
  darkMode: false,
  language: 'en',
};

export class StudentMockService {
  private getDelay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getCourses(): Promise<Course[]> {
    await this.getDelay(400);
    return COURSES;
  }

  async getCourse(id: string): Promise<Course | undefined> {
    await this.getDelay(300);
    return COURSES.find((c) => c.id === id);
  }

  async getAssignments(): Promise<Assignment[]> {
    await this.getDelay(400);
    return ASSIGNMENTS;
  }

  async getAssignment(id: string): Promise<Assignment | undefined> {
    await this.getDelay(300);
    return ASSIGNMENTS.find((a) => a.id === id);
  }

  async getExams(): Promise<Exam[]> {
    await this.getDelay(400);
    return EXAMS;
  }

  async getExam(id: string): Promise<Exam | undefined> {
    await this.getDelay(300);
    return EXAMS.find((e) => e.id === id);
  }

  async getAttendance(): Promise<AttendanceRecord[]> {
    await this.getDelay(400);
    return ATTENDANCE;
  }

  async getAttendanceByCourse(courseId: string): Promise<AttendanceRecord[]> {
    await this.getDelay(300);
    return ATTENDANCE.filter((a) => a.courseId === courseId);
  }

  async getGrades(): Promise<GradeRecord[]> {
    await this.getDelay(400);
    return GRADES;
  }

  async getGradesByCourse(courseId: string): Promise<GradeRecord[]> {
    await this.getDelay(300);
    return GRADES.filter((g) => g.courseId === courseId);
  }

  async getMessages(): Promise<Message[]> {
    await this.getDelay(400);
    return MESSAGES;
  }

  async getMessage(id: string): Promise<Message | undefined> {
    await this.getDelay(300);
    return MESSAGES.find((m) => m.id === id);
  }

  async getCalendarEvents(startDate?: string, endDate?: string): Promise<CalendarEvent[]> {
    await this.getDelay(400);
    let events = CALENDAR_EVENTS;
    if (startDate && endDate) {
      events = events.filter((e) => e.date >= startDate && e.date <= endDate);
    }
    return events;
  }

  async getAnnouncements(): Promise<Announcement[]> {
    await this.getDelay(400);
    return ANNOUNCEMENTS;
  }

  async getActivityLog(): Promise<ActivityLog[]> {
    await this.getDelay(400);
    return ACTIVITY_LOG;
  }

  async getProfile(): Promise<StudentProfile> {
    await this.getDelay(400);
    return PROFILE;
  }

  async getSettings(): Promise<StudentSettings> {
    await this.getDelay(300);
    return SETTINGS;
  }

  async updateSettings(settings: Partial<StudentSettings>): Promise<StudentSettings> {
    await this.getDelay(400);
    Object.assign(SETTINGS, settings);
    return { ...SETTINGS };
  }

  async getDashboardStats() {
    await this.getDelay(500);
    const totalAttendance = ATTENDANCE.length;
    const presentCount = ATTENDANCE.filter((a) => a.status === 'present').length;
    const attendancePercentage =
      totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

    const totalMarks = GRADES.reduce((sum, g) => sum + g.obtainedMarks, 0);
    const maxMarks = GRADES.reduce((sum, g) => sum + g.totalMarks, 0);
    const overallPercentage = maxMarks > 0 ? Math.round((totalMarks / maxMarks) * 100) : 0;

    const pendingAssignments = ASSIGNMENTS.filter(
      (a) => a.status === 'pending' || a.status === 'overdue'
    ).length;
    const upcomingExams = EXAMS.filter((e) => e.status === 'upcoming').length;

    return {
      attendancePercentage,
      academicProgress: overallPercentage,
      pendingAssignments,
      upcomingExams,
      totalCourses: COURSES.length,
      completedLessons: COURSES.reduce((sum, c) => sum + c.completedLessons, 0),
      totalLessons: COURSES.reduce((sum, c) => sum + c.totalLessons, 0),
      gpa: overallPercentage / 20,
    };
  }
}

export const studentMockService = new StudentMockService();
