import type { AdminDepartment } from '@/types/admin';
import { formatDate, addMonths } from './helpers';

const today = new Date();

export const DEPARTMENTS: AdminDepartment[] = [
  {
    id: 'd1',
    name: 'Computer Science',
    code: 'CS',
    headOfDepartment: 'Dr. Sarah Johnson',
    facultyCount: 12,
    studentCount: 180,
    courseCount: 15,
    description: 'Department of Computer Science and Engineering.',
    createdAt: formatDate(addMonths(today, -36)),
  },
  {
    id: 'd2',
    name: 'Electronics',
    code: 'EC',
    headOfDepartment: 'Dr. Emily Davis',
    facultyCount: 8,
    studentCount: 120,
    courseCount: 12,
    description: 'Department of Electronics and Communication.',
    createdAt: formatDate(addMonths(today, -36)),
  },
  {
    id: 'd3',
    name: 'Mechanical',
    code: 'ME',
    headOfDepartment: 'Prof. James Wilson',
    facultyCount: 10,
    studentCount: 150,
    courseCount: 14,
    description: 'Department of Mechanical Engineering.',
    createdAt: formatDate(addMonths(today, -36)),
  },
];
