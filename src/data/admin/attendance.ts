import type { AdminAttendanceRecord } from '@/types/admin';
import { formatDate, formatDateTime, addDays, addMonths } from './helpers';
import { STUDENTS } from './students';

const today = new Date();

export const ATTENDANCE: AdminAttendanceRecord[] = (() => {
  const records: AdminAttendanceRecord[] = [];
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
  for (let i = 0; i < 200; i++) {
    const date = addDays(addMonths(today, -2), i);
    if (date > today) continue;
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    STUDENTS.forEach((student) => {
      records.push({
        id: `att-${i}-${student.id}`,
        studentId: student.id,
        studentName: `${student.firstName} ${student.lastName}`,
        enrollmentNumber: student.enrollmentNumber,
        classId: student.classId || 'c1',
        className: student.className || 'CS-A',
        date: formatDate(date),
        status: statuses[i % statuses.length],
        markedBy: 'Dr. Sarah Johnson',
        markedAt: formatDateTime(date),
      });
    });
  }
  return records;
})();
