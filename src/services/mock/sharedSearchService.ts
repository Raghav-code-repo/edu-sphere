import type { SearchResult } from '@/types/shared/search';

const STUDENTS = [
  { id: 's1', name: 'Rahul Sharma', email: 'rahul@edusphere.demo', href: '/admin/students' },
  { id: 's2', name: 'Priya Patel', email: 'priya@edusphere.demo', href: '/admin/students' },
  { id: 's3', name: 'Amit Kumar', email: 'amit@edusphere.demo', href: '/admin/students' },
];

const FACULTY = [
  { id: 'f1', name: 'Dr. Sarah Johnson', email: 'sarah@edusphere.demo', href: '/admin/faculty' },
  { id: 'f2', name: 'Prof. Michael Chen', email: 'michael@edusphere.demo', href: '/admin/faculty' },
  { id: 'f3', name: 'Dr. Emily Davis', email: 'emily@edusphere.demo', href: '/admin/faculty' },
];

const COURSES = [
  { id: 'c1', name: 'Data Structures & Algorithms', code: 'CS201', href: '/admin/courses' },
  { id: 'c2', name: 'Database Management Systems', code: 'CS301', href: '/admin/courses' },
  { id: 'c3', name: 'Software Engineering', code: 'CS401', href: '/admin/courses' },
];

const ASSIGNMENTS = [
  { id: 'a1', title: 'Binary Tree Implementation', course: 'CS201', href: '/admin/assignments' },
  { id: 'a2', title: 'ER Diagram Design', course: 'CS301', href: '/admin/assignments' },
  { id: 'a3', title: 'Sprint Planning Document', course: 'CS401', href: '/admin/assignments' },
];

const EXAMS = [
  {
    id: 'e1',
    title: 'Mid-Term Examination',
    course: 'CS201',
    date: '2025-09-15',
    href: '/admin/exams',
  },
  {
    id: 'e2',
    title: 'Quiz 3 - SQL Joins',
    course: 'CS301',
    date: '2025-09-10',
    href: '/admin/exams',
  },
];

const MESSAGES = [
  {
    id: 'm1',
    subject: 'Assignment Deadline Extension',
    from: 'Dr. Sarah Johnson',
    href: '/student/messages',
  },
  {
    id: 'm2',
    subject: 'Mid-Term Examination Schedule',
    from: 'Admin Office',
    href: '/student/messages',
  },
];

const REPORTS = [
  { id: 'r1', name: 'Student Performance Report', href: '/admin/reports' },
  { id: 'r2', name: 'Attendance Summary', href: '/admin/reports' },
  { id: 'r3', name: 'Fee Collection Report', href: '/admin/reports' },
];

const SETTINGS = [
  { id: 's1', name: 'General Settings', href: '/admin/settings' },
  { id: 's2', name: 'Notification Settings', href: '/admin/settings' },
  { id: 's3', name: 'Academic Settings', href: '/admin/settings' },
];

export class SharedSearchService {
  private getDelay(ms: number = 150): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async search(query: string): Promise<SearchResult[]> {
    await this.getDelay(300);
    if (!query.trim()) return [];

    const lower = query.toLowerCase();
    const results: SearchResult[] = [];

    for (const student of STUDENTS) {
      if (
        student.name.toLowerCase().includes(lower) ||
        student.email.toLowerCase().includes(lower)
      ) {
        results.push({
          id: student.id,
          type: 'student',
          title: student.name,
          description: student.email,
          href: student.href,
          icon: 'user',
        });
      }
    }

    for (const faculty of FACULTY) {
      if (
        faculty.name.toLowerCase().includes(lower) ||
        faculty.email.toLowerCase().includes(lower)
      ) {
        results.push({
          id: faculty.id,
          type: 'faculty',
          title: faculty.name,
          description: faculty.email,
          href: faculty.href,
          icon: 'briefcase',
        });
      }
    }

    for (const course of COURSES) {
      if (course.name.toLowerCase().includes(lower) || course.code.toLowerCase().includes(lower)) {
        results.push({
          id: course.id,
          type: 'course',
          title: course.name,
          description: course.code,
          href: course.href,
          icon: 'bookOpen',
        });
      }
    }

    for (const assignment of ASSIGNMENTS) {
      if (
        assignment.title.toLowerCase().includes(lower) ||
        assignment.course.toLowerCase().includes(lower)
      ) {
        results.push({
          id: assignment.id,
          type: 'assignment',
          title: assignment.title,
          description: assignment.course,
          href: assignment.href,
          icon: 'clipboardList',
        });
      }
    }

    for (const exam of EXAMS) {
      if (exam.title.toLowerCase().includes(lower) || exam.course.toLowerCase().includes(lower)) {
        results.push({
          id: exam.id,
          type: 'exam',
          title: exam.title,
          description: `${exam.course} - ${exam.date}`,
          href: exam.href,
          icon: 'fileText',
        });
      }
    }

    for (const message of MESSAGES) {
      if (
        message.subject.toLowerCase().includes(lower) ||
        message.from.toLowerCase().includes(lower)
      ) {
        results.push({
          id: message.id,
          type: 'message',
          title: message.subject,
          description: `From: ${message.from}`,
          href: message.href,
          icon: 'messageSquare',
        });
      }
    }

    for (const report of REPORTS) {
      if (report.name.toLowerCase().includes(lower)) {
        results.push({
          id: report.id,
          type: 'report',
          title: report.name,
          description: 'View report',
          href: report.href,
          icon: 'barChart3',
        });
      }
    }

    for (const setting of SETTINGS) {
      if (setting.name.toLowerCase().includes(lower)) {
        results.push({
          id: setting.id,
          type: 'settings',
          title: setting.name,
          description: 'Configure settings',
          href: setting.href,
          icon: 'settings',
        });
      }
    }

    return results;
  }

  async getRecentSearches(): Promise<string[]> {
    await this.getDelay(200);
    return [];
  }

  async saveRecentSearch(_query: string): Promise<void> {
    await this.getDelay(100);
  }
}

export const sharedSearchService = new SharedSearchService();
