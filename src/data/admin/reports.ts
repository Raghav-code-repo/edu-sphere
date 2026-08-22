import type { AdminReport } from '@/types/admin';
import { formatDate, addDays } from './helpers';

const today = new Date();

export const REPORTS: AdminReport[] = [
  {
    id: 'r1',
    title: 'Monthly Attendance Report - August 2024',
    type: 'attendance',
    period: 'August 2024',
    generatedAt: formatDate(addDays(today, -1)),
    generatedBy: 'Admin User',
    data: { totalPresent: 1450, totalAbsent: 120, totalLate: 80 },
    filters: { month: 'August', year: '2024' },
  },
  {
    id: 'r2',
    title: 'Semester Grade Analysis - 6th Sem',
    type: 'grades',
    period: '6th Semester',
    generatedAt: formatDate(addDays(today, -3)),
    generatedBy: 'Admin User',
    data: { averageGPA: 8.2, passRate: 92 },
    filters: { semester: '6th', year: '2024' },
  },
  {
    id: 'r3',
    title: 'New Enrollment Report',
    type: 'enrollment',
    period: '2024-25',
    generatedAt: formatDate(addDays(today, -5)),
    generatedBy: 'Admin User',
    data: { totalNew: 120, departments: { CS: 60, EC: 30, ME: 30 } },
    filters: { year: '2024-25' },
  },
  {
    id: 'r4',
    title: 'Fee Collection Report - August',
    type: 'financial',
    period: 'August 2024',
    generatedAt: formatDate(addDays(today, -2)),
    generatedBy: 'Admin User',
    data: { totalCollected: 2500000, totalPending: 500000 },
    filters: { month: 'August', year: '2024' },
  },
  {
    id: 'r5',
    title: 'Faculty Performance Report',
    type: 'performance',
    period: '2024-25',
    generatedAt: formatDate(addDays(today, -7)),
    generatedBy: 'Admin User',
    data: { averageRating: 4.2, totalFaculty: 30 },
    filters: { year: '2024-25' },
  },
];
