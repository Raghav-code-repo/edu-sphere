import type { AdminAnnouncement } from '@/types/admin';
import { formatDate, addDays } from './helpers';

const today = new Date();

export const ANNOUNCEMENTS: AdminAnnouncement[] = [
  {
    id: 'ann1',
    title: 'Mid-Term Examination Schedule Released',
    content:
      'The mid-term examination schedule for the current semester has been published. Please check the exam portal for your specific schedule and venue details.',
    category: 'academic',
    targetAudience: ['all'],
    status: 'published',
    publishedAt: formatDate(addDays(today, -1)),
    authorId: 'u10',
    authorName: 'Admin User',
    createdAt: formatDate(addDays(today, -1)),
    updatedAt: formatDate(addDays(today, -1)),
  },
  {
    id: 'ann2',
    title: 'Library Extended Hours During Exams',
    content: 'The library will remain open 24/7 during the mid-term examination period.',
    category: 'general',
    targetAudience: ['all'],
    status: 'published',
    publishedAt: formatDate(addDays(today, -2)),
    authorId: 'u10',
    authorName: 'Admin User',
    createdAt: formatDate(addDays(today, -2)),
    updatedAt: formatDate(addDays(today, -2)),
  },
  {
    id: 'ann3',
    title: 'Annual Tech Fest - Registration Open',
    content: 'Register for the annual technical festival with workshops and competitions.',
    category: 'event',
    targetAudience: ['students', 'faculty'],
    status: 'published',
    publishedAt: formatDate(addDays(today, -3)),
    authorId: 'u10',
    authorName: 'Admin User',
    createdAt: formatDate(addDays(today, -3)),
    updatedAt: formatDate(addDays(today, -3)),
  },
  {
    id: 'ann4',
    title: 'Urgent: Server Maintenance Notice',
    content: 'The student portal will be unavailable on Sunday from 2 AM to 6 AM for maintenance.',
    category: 'urgent',
    targetAudience: ['all'],
    status: 'draft',
    authorId: 'u10',
    authorName: 'Admin User',
    createdAt: formatDate(addDays(today, 0)),
    updatedAt: formatDate(addDays(today, 0)),
  },
  {
    id: 'ann5',
    title: 'New Course Enrollment Open',
    content:
      'Enrollment for new elective courses is now open. Choose your courses before the deadline.',
    category: 'academic',
    targetAudience: ['students'],
    status: 'published',
    publishedAt: formatDate(addDays(today, -4)),
    authorId: 'u10',
    authorName: 'Admin User',
    createdAt: formatDate(addDays(today, -4)),
    updatedAt: formatDate(addDays(today, -4)),
  },
];
