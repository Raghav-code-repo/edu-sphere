import type {
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
  AdminAnalytics,
  AdminSettings,
  AdminDashboardStats,
  FilterOptions,
  PaginatedResponse,
} from '@/types/admin';
import {
  USERS,
  STUDENTS,
  PARENTS,
  FACULTY,
  COURSES,
  CLASSES,
  SUBJECTS,
  DEPARTMENTS,
  ATTENDANCE,
  ASSIGNMENTS,
  EXAMS,
  EXAM_RESULTS,
  FEES,
  ANNOUNCEMENTS,
  DOCUMENTS,
  AUDIT_LOGS,
  REPORTS,
  SETTINGS,
  formatDate,
  addDays,
} from '@/data/admin';

export class AdminMockService {
  private getDelay(ms: number = 300): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private applyFilters<T>(items: T[], filters?: Partial<FilterOptions>): T[] {
    if (!filters) return items;
    let filtered = [...items];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter((item: unknown) =>
        JSON.stringify(item).toLowerCase().includes(search)
      );
    }

    if (filters.role) {
      filtered = filtered.filter(
        (item: unknown) => (item as Record<string, unknown>).role === filters.role
      );
    }

    if (filters.status) {
      filtered = filtered.filter(
        (item: unknown) => (item as Record<string, unknown>).status === filters.status
      );
    }

    if (filters.department) {
      filtered = filtered.filter(
        (item: unknown) => (item as Record<string, unknown>).department === filters.department
      );
    }

    if (filters.sortBy) {
      filtered.sort((a: unknown, b: unknown) => {
        const aVal = (a as Record<string, unknown>)[filters.sortBy!];
        const bVal = (b as Record<string, unknown>)[filters.sortBy!];
        if (aVal === bVal) return 0;
        if (aVal === undefined || aVal === null) return 1;
        if (bVal === undefined || bVal === null) return -1;
        const cmp = aVal < bVal ? -1 : 1;
        return filters.sortOrder === 'desc' ? -cmp : cmp;
      });
    }

    return filtered;
  }

  private paginate<T>(items: T[], page: number, pageSize: number): PaginatedResponse<T> {
    const total = items.length;
    const totalPages = Math.ceil(total / pageSize) || 1;
    const start = (page - 1) * pageSize;
    const data = items.slice(start, start + pageSize);
    return { data, total, page, pageSize, totalPages };
  }

  async getDashboardStats(): Promise<AdminDashboardStats> {
    await this.getDelay(500);
    const todayStr = new Date().toISOString().split('T')[0];
    const attendanceToday = ATTENDANCE.filter((a) => a.date === todayStr).length;
    const pendingFees = FEES.filter((f) => f.status === 'pending' || f.status === 'overdue').length;
    const upcomingExams = EXAMS.filter((e) => e.status === 'scheduled').length;

    return {
      totalStudents: STUDENTS.length,
      totalParents: PARENTS.length,
      totalFaculty: FACULTY.length,
      activeCourses: COURSES.filter((c) => c.status === 'published').length,
      attendanceToday,
      pendingFees,
      upcomingExams,
      newEnrollments: STUDENTS.filter((s) => {
        const created = new Date(s.createdAt);
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return created >= monthAgo;
      }).length,
      activeClasses: CLASSES.length,
    };
  }

  async getUsers(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminUser>> {
    await this.getDelay(400);
    const filtered = this.applyFilters(USERS, filters);
    return this.paginate(filtered, filters?.page || 1, filters?.pageSize || 10);
  }

  async getUser(id: string): Promise<AdminUser | undefined> {
    await this.getDelay(300);
    return USERS.find((u) => u.id === id);
  }

  async createUser(user: Partial<AdminUser>): Promise<AdminUser> {
    await this.getDelay(500);
    const newUser: AdminUser = {
      id: `u${Date.now()}`,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      role: user.role || 'STUDENT',
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      ...user,
    };
    USERS.push(newUser);
    return newUser;
  }

  async updateUser(id: string, user: Partial<AdminUser>): Promise<AdminUser> {
    await this.getDelay(500);
    const index = USERS.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('User not found');
    USERS[index] = { ...USERS[index], ...user, updatedAt: new Date().toISOString().split('T')[0] };
    return USERS[index];
  }

  async deleteUser(id: string): Promise<void> {
    await this.getDelay(400);
    const index = USERS.findIndex((u) => u.id === id);
    if (index !== -1) USERS.splice(index, 1);
  }

  async deactivateUser(id: string): Promise<AdminUser> {
    await this.getDelay(400);
    const index = USERS.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('User not found');
    USERS[index] = {
      ...USERS[index],
      status: 'inactive',
      updatedAt: new Date().toISOString().split('T')[0],
    };
    return USERS[index];
  }

  async getStudents(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminStudent>> {
    await this.getDelay(400);
    const filtered = this.applyFilters(STUDENTS, filters);
    return this.paginate(filtered, filters?.page || 1, filters?.pageSize || 10);
  }

  async getStudent(id: string): Promise<AdminStudent | undefined> {
    await this.getDelay(300);
    return STUDENTS.find((s) => s.id === id);
  }

  async getParents(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminParent>> {
    await this.getDelay(400);
    const filtered = this.applyFilters(PARENTS, filters);
    return this.paginate(filtered, filters?.page || 1, filters?.pageSize || 10);
  }

  async getParent(id: string): Promise<AdminParent | undefined> {
    await this.getDelay(300);
    return PARENTS.find((p) => p.id === id);
  }

  async getFaculty(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminFaculty>> {
    await this.getDelay(400);
    const filtered = this.applyFilters(FACULTY, filters);
    return this.paginate(filtered, filters?.page || 1, filters?.pageSize || 10);
  }

  async getFacultyMember(id: string): Promise<AdminFaculty | undefined> {
    await this.getDelay(300);
    return FACULTY.find((f) => f.id === id);
  }

  async getCourses(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminCourse>> {
    await this.getDelay(400);
    const filtered = this.applyFilters(COURSES, filters);
    return this.paginate(filtered, filters?.page || 1, filters?.pageSize || 10);
  }

  async getCourse(id: string): Promise<AdminCourse | undefined> {
    await this.getDelay(300);
    return COURSES.find((c) => c.id === id);
  }

  async createCourse(course: Partial<AdminCourse>): Promise<AdminCourse> {
    await this.getDelay(500);
    const newCourse: AdminCourse = {
      id: `cr${Date.now()}`,
      name: course.name || '',
      code: course.code || '',
      department: course.department || '',
      credits: course.credits || 3,
      semester: course.semester || '',
      year: course.year || new Date().getFullYear().toString(),
      status: 'draft',
      studentCount: 0,
      moduleCount: 0,
      lessonCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      ...course,
    };
    COURSES.push(newCourse);
    return newCourse;
  }

  async updateCourse(id: string, course: Partial<AdminCourse>): Promise<AdminCourse> {
    await this.getDelay(500);
    const index = COURSES.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Course not found');
    COURSES[index] = {
      ...COURSES[index],
      ...course,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    return COURSES[index];
  }

  async deleteCourse(id: string): Promise<void> {
    await this.getDelay(400);
    const index = COURSES.findIndex((c) => c.id === id);
    if (index !== -1) COURSES.splice(index, 1);
  }

  async publishCourse(id: string): Promise<AdminCourse> {
    await this.getDelay(400);
    const index = COURSES.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Course not found');
    COURSES[index] = {
      ...COURSES[index],
      status: 'published',
      updatedAt: new Date().toISOString().split('T')[0],
    };
    return COURSES[index];
  }

  async unpublishCourse(id: string): Promise<AdminCourse> {
    await this.getDelay(400);
    const index = COURSES.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Course not found');
    COURSES[index] = {
      ...COURSES[index],
      status: 'draft',
      updatedAt: new Date().toISOString().split('T')[0],
    };
    return COURSES[index];
  }

  async getClasses(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminClass>> {
    await this.getDelay(400);
    const filtered = this.applyFilters(CLASSES, filters);
    return this.paginate(filtered, filters?.page || 1, filters?.pageSize || 10);
  }

  async getClass(id: string): Promise<AdminClass | undefined> {
    await this.getDelay(300);
    return CLASSES.find((c) => c.id === id);
  }

  async createClass(cls: Partial<AdminClass>): Promise<AdminClass> {
    await this.getDelay(500);
    const newClass: AdminClass = {
      id: `c${Date.now()}`,
      name: cls.name || '',
      code: cls.code || '',
      department: cls.department || '',
      semester: cls.semester || '',
      year: cls.year || new Date().getFullYear().toString(),
      studentCount: 0,
      capacity: cls.capacity || 50,
      createdAt: new Date().toISOString().split('T')[0],
      ...cls,
    };
    CLASSES.push(newClass);
    return newClass;
  }

  async updateClass(id: string, cls: Partial<AdminClass>): Promise<AdminClass> {
    await this.getDelay(500);
    const index = CLASSES.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Class not found');
    CLASSES[index] = { ...CLASSES[index], ...cls };
    return CLASSES[index];
  }

  async deleteClass(id: string): Promise<void> {
    await this.getDelay(400);
    const index = CLASSES.findIndex((c) => c.id === id);
    if (index !== -1) CLASSES.splice(index, 1);
  }

  async getSubjects(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminSubject>> {
    await this.getDelay(400);
    const filtered = this.applyFilters(SUBJECTS, filters);
    return this.paginate(filtered, filters?.page || 1, filters?.pageSize || 10);
  }

  async getSubject(id: string): Promise<AdminSubject | undefined> {
    await this.getDelay(300);
    return SUBJECTS.find((s) => s.id === id);
  }

  async createSubject(subject: Partial<AdminSubject>): Promise<AdminSubject> {
    await this.getDelay(500);
    const newSubject: AdminSubject = {
      id: `sub${Date.now()}`,
      name: subject.name || '',
      code: subject.code || '',
      department: subject.department || '',
      credits: subject.credits || 3,
      courseIds: [],
      createdAt: new Date().toISOString().split('T')[0],
      ...subject,
    };
    SUBJECTS.push(newSubject);
    return newSubject;
  }

  async updateSubject(id: string, subject: Partial<AdminSubject>): Promise<AdminSubject> {
    await this.getDelay(500);
    const index = SUBJECTS.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Subject not found');
    SUBJECTS[index] = { ...SUBJECTS[index], ...subject };
    return SUBJECTS[index];
  }

  async deleteSubject(id: string): Promise<void> {
    await this.getDelay(400);
    const index = SUBJECTS.findIndex((s) => s.id === id);
    if (index !== -1) SUBJECTS.splice(index, 1);
  }

  async getDepartments(): Promise<AdminDepartment[]> {
    await this.getDelay(400);
    return DEPARTMENTS;
  }

  async getDepartment(id: string): Promise<AdminDepartment | undefined> {
    await this.getDelay(300);
    return DEPARTMENTS.find((d) => d.id === id);
  }

  async createDepartment(dept: Partial<AdminDepartment>): Promise<AdminDepartment> {
    await this.getDelay(500);
    const newDept: AdminDepartment = {
      id: `d${Date.now()}`,
      name: dept.name || '',
      code: dept.code || '',
      facultyCount: 0,
      studentCount: 0,
      courseCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      ...dept,
    };
    DEPARTMENTS.push(newDept);
    return newDept;
  }

  async updateDepartment(id: string, dept: Partial<AdminDepartment>): Promise<AdminDepartment> {
    await this.getDelay(500);
    const index = DEPARTMENTS.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('Department not found');
    DEPARTMENTS[index] = { ...DEPARTMENTS[index], ...dept };
    return DEPARTMENTS[index];
  }

  async deleteDepartment(id: string): Promise<void> {
    await this.getDelay(400);
    const index = DEPARTMENTS.findIndex((d) => d.id === id);
    if (index !== -1) DEPARTMENTS.splice(index, 1);
  }

  async getAttendanceRecords(
    filters?: Partial<FilterOptions>
  ): Promise<PaginatedResponse<AdminAttendanceRecord>> {
    await this.getDelay(400);
    const filtered = this.applyFilters(ATTENDANCE, filters);
    return this.paginate(filtered, filters?.page || 1, filters?.pageSize || 10);
  }

  async markAttendance(record: Partial<AdminAttendanceRecord>): Promise<AdminAttendanceRecord> {
    await this.getDelay(500);
    const newRecord: AdminAttendanceRecord = {
      id: `att-${Date.now()}`,
      studentId: record.studentId || '',
      studentName: record.studentName || '',
      enrollmentNumber: record.enrollmentNumber || '',
      classId: record.classId || '',
      className: record.className || '',
      date: record.date || new Date().toISOString().split('T')[0],
      status: record.status || 'present',
      markedBy: 'Admin',
      markedAt: new Date().toISOString(),
      ...record,
    };
    ATTENDANCE.push(newRecord);
    return newRecord;
  }

  async getAttendanceStats(): Promise<{
    present: number;
    absent: number;
    late: number;
    excused: number;
  }> {
    await this.getDelay(400);
    return {
      present: ATTENDANCE.filter((a) => a.status === 'present').length,
      absent: ATTENDANCE.filter((a) => a.status === 'absent').length,
      late: ATTENDANCE.filter((a) => a.status === 'late').length,
      excused: ATTENDANCE.filter((a) => a.status === 'excused').length,
    };
  }

  async getAssignments(
    filters?: Partial<FilterOptions>
  ): Promise<PaginatedResponse<AdminAssignment>> {
    await this.getDelay(400);
    const filtered = this.applyFilters(ASSIGNMENTS, filters);
    return this.paginate(filtered, filters?.page || 1, filters?.pageSize || 10);
  }

  async getAssignment(id: string): Promise<AdminAssignment | undefined> {
    await this.getDelay(300);
    return ASSIGNMENTS.find((a) => a.id === id);
  }

  async createAssignment(assignment: Partial<AdminAssignment>): Promise<AdminAssignment> {
    await this.getDelay(500);
    const newAssignment: AdminAssignment = {
      id: `a${Date.now()}`,
      title: assignment.title || '',
      courseId: assignment.courseId || '',
      courseName: assignment.courseName || '',
      courseCode: assignment.courseCode || '',
      classId: assignment.classId || '',
      className: assignment.className || '',
      dueDate: assignment.dueDate || '',
      totalMarks: assignment.totalMarks || 100,
      status: 'draft',
      submissionCount: 0,
      totalStudents: 0,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'Admin',
      ...assignment,
    };
    ASSIGNMENTS.push(newAssignment);
    return newAssignment;
  }

  async updateAssignment(
    id: string,
    assignment: Partial<AdminAssignment>
  ): Promise<AdminAssignment> {
    await this.getDelay(500);
    const index = ASSIGNMENTS.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Assignment not found');
    ASSIGNMENTS[index] = { ...ASSIGNMENTS[index], ...assignment };
    return ASSIGNMENTS[index];
  }

  async deleteAssignment(id: string): Promise<void> {
    await this.getDelay(400);
    const index = ASSIGNMENTS.findIndex((a) => a.id === id);
    if (index !== -1) ASSIGNMENTS.splice(index, 1);
  }

  async getExams(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminExam>> {
    await this.getDelay(400);
    const filtered = this.applyFilters(EXAMS, filters);
    return this.paginate(filtered, filters?.page || 1, filters?.pageSize || 10);
  }

  async getExam(id: string): Promise<AdminExam | undefined> {
    await this.getDelay(300);
    return EXAMS.find((e) => e.id === id);
  }

  async createExam(exam: Partial<AdminExam>): Promise<AdminExam> {
    await this.getDelay(500);
    const newExam: AdminExam = {
      id: `e${Date.now()}`,
      title: exam.title || '',
      courseId: exam.courseId || '',
      courseName: exam.courseName || '',
      courseCode: exam.courseCode || '',
      classId: exam.classId || '',
      className: exam.className || '',
      date: exam.date || '',
      startTime: exam.startTime || '',
      endTime: exam.endTime || '',
      duration: exam.duration || 60,
      totalMarks: exam.totalMarks || 100,
      passingMarks: exam.passingMarks || 40,
      location: exam.location || '',
      status: 'scheduled',
      createdAt: new Date().toISOString().split('T')[0],
      ...exam,
    };
    EXAMS.push(newExam);
    return newExam;
  }

  async updateExam(id: string, exam: Partial<AdminExam>): Promise<AdminExam> {
    await this.getDelay(500);
    const index = EXAMS.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Exam not found');
    EXAMS[index] = { ...EXAMS[index], ...exam };
    return EXAMS[index];
  }

  async deleteExam(id: string): Promise<void> {
    await this.getDelay(400);
    const index = EXAMS.findIndex((e) => e.id === id);
    if (index !== -1) EXAMS.splice(index, 1);
  }

  async getExamResults(examId: string): Promise<AdminExamResult[]> {
    await this.getDelay(400);
    return EXAM_RESULTS.filter((r) => r.examId === examId);
  }

  async getFees(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminFee>> {
    await this.getDelay(400);
    const filtered = this.applyFilters(FEES, filters);
    return this.paginate(filtered, filters?.page || 1, filters?.pageSize || 10);
  }

  async getFee(id: string): Promise<AdminFee | undefined> {
    await this.getDelay(300);
    return FEES.find((f) => f.id === id);
  }

  async updateFeeStatus(id: string, status: string): Promise<AdminFee> {
    await this.getDelay(400);
    const index = FEES.findIndex((f) => f.id === id);
    if (index === -1) throw new Error('Fee not found');
    FEES[index] = {
      ...FEES[index],
      status: status as AdminFee['status'],
    };
    return FEES[index];
  }

  async getAnnouncements(
    filters?: Partial<FilterOptions>
  ): Promise<PaginatedResponse<AdminAnnouncement>> {
    await this.getDelay(400);
    const filtered = this.applyFilters(ANNOUNCEMENTS, filters);
    return this.paginate(filtered, filters?.page || 1, filters?.pageSize || 10);
  }

  async getAnnouncement(id: string): Promise<AdminAnnouncement | undefined> {
    await this.getDelay(300);
    return ANNOUNCEMENTS.find((a) => a.id === id);
  }

  async createAnnouncement(announcement: Partial<AdminAnnouncement>): Promise<AdminAnnouncement> {
    await this.getDelay(500);
    const newAnnouncement: AdminAnnouncement = {
      id: `ann${Date.now()}`,
      title: announcement.title || '',
      content: announcement.content || '',
      category: announcement.category || 'general',
      targetAudience: announcement.targetAudience || ['all'],
      status: 'draft',
      authorId: 'u10',
      authorName: 'Admin User',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      ...announcement,
    };
    ANNOUNCEMENTS.push(newAnnouncement);
    return newAnnouncement;
  }

  async updateAnnouncement(
    id: string,
    announcement: Partial<AdminAnnouncement>
  ): Promise<AdminAnnouncement> {
    await this.getDelay(500);
    const index = ANNOUNCEMENTS.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Announcement not found');
    ANNOUNCEMENTS[index] = {
      ...ANNOUNCEMENTS[index],
      ...announcement,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    return ANNOUNCEMENTS[index];
  }

  async deleteAnnouncement(id: string): Promise<void> {
    await this.getDelay(400);
    const index = ANNOUNCEMENTS.findIndex((a) => a.id === id);
    if (index !== -1) ANNOUNCEMENTS.splice(index, 1);
  }

  async publishAnnouncement(id: string): Promise<AdminAnnouncement> {
    await this.getDelay(400);
    const index = ANNOUNCEMENTS.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Announcement not found');
    ANNOUNCEMENTS[index] = {
      ...ANNOUNCEMENTS[index],
      status: 'published',
      publishedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    return ANNOUNCEMENTS[index];
  }

  async getDocuments(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminDocument>> {
    await this.getDelay(400);
    const filtered = this.applyFilters(DOCUMENTS, filters);
    return this.paginate(filtered, filters?.page || 1, filters?.pageSize || 10);
  }

  async uploadDocument(doc: Partial<AdminDocument>): Promise<AdminDocument> {
    await this.getDelay(500);
    const newDoc: AdminDocument = {
      id: `doc${Date.now()}`,
      name: doc.name || '',
      type: doc.type || 'other',
      category: doc.category || 'General',
      fileSize: doc.fileSize || '0 KB',
      url: doc.url || '',
      uploadedBy: 'Admin User',
      uploadedAt: new Date().toISOString().split('T')[0],
      accessLevel: doc.accessLevel || 'internal',
      tags: doc.tags || [],
      ...doc,
    };
    DOCUMENTS.push(newDoc);
    return newDoc;
  }

  async deleteDocument(id: string): Promise<void> {
    await this.getDelay(400);
    const index = DOCUMENTS.findIndex((d) => d.id === id);
    if (index !== -1) DOCUMENTS.splice(index, 1);
  }

  async getAuditLogs(filters?: Partial<FilterOptions>): Promise<PaginatedResponse<AdminAuditLog>> {
    await this.getDelay(400);
    const filtered = this.applyFilters(AUDIT_LOGS, filters);
    return this.paginate(filtered, filters?.page || 1, filters?.pageSize || 10);
  }

  async getReports(): Promise<AdminReport[]> {
    await this.getDelay(400);
    return REPORTS;
  }

  async generateReport(type: string, filters: Record<string, unknown>): Promise<AdminReport> {
    await this.getDelay(800);
    const newReport: AdminReport = {
      id: `r${Date.now()}`,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${new Date().toLocaleDateString()}`,
      type: type as AdminReport['type'],
      period: new Date().toLocaleDateString(),
      generatedAt: new Date().toISOString().split('T')[0],
      generatedBy: 'Admin User',
      data: {},
      filters,
    };
    REPORTS.push(newReport);
    return newReport;
  }

  async getAnalytics(): Promise<AdminAnalytics> {
    await this.getDelay(600);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return {
      enrollmentTrend: months.map((month) => ({
        month,
        students: Math.floor(Math.random() * 50) + 20,
        parents: Math.floor(Math.random() * 40) + 10,
        faculty: Math.floor(Math.random() * 10) + 2,
      })),
      attendanceTrend: Array.from({ length: 30 }, (_, i) => ({
        date: formatDate(addDays(new Date(), -29 + i)),
        present: Math.floor(Math.random() * 50) + 100,
        absent: Math.floor(Math.random() * 20) + 5,
        late: Math.floor(Math.random() * 10) + 2,
      })),
      academicPerformance: COURSES.map((course) => ({
        course: course.name,
        average: Math.floor(Math.random() * 20) + 70,
        passRate: Math.floor(Math.random() * 15) + 85,
      })),
      feeCollection: months.map((month) => ({
        month,
        collected: Math.floor(Math.random() * 500000) + 500000,
        pending: Math.floor(Math.random() * 200000) + 50000,
      })),
      courseActivity: COURSES.map((course) => ({
        course: course.name,
        engagement: Math.floor(Math.random() * 30) + 70,
        submissions: Math.floor(Math.random() * 40) + 20,
      })),
      facultyWorkload: FACULTY.map((f) => ({
        faculty: `${f.firstName} ${f.lastName}`,
        classes: f.classesCount,
        students: f.studentsCount,
        hours: Math.floor(Math.random() * 10) + 15,
      })),
    };
  }

  async getSettings(): Promise<AdminSettings> {
    await this.getDelay(300);
    return SETTINGS;
  }

  async updateSettings(settings: Partial<AdminSettings>): Promise<AdminSettings> {
    await this.getDelay(500);
    Object.assign(SETTINGS, settings);
    return { ...SETTINGS };
  }
}

export const adminMockService = new AdminMockService();
