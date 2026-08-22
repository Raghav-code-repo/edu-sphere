import { formatDateTime, addDays } from './helpers';

const today = new Date();

export const ACTIVITY_LOGS = [
  {
    id: 'act1',
    action: 'User Created',
    description: 'Created student account for Rahul Sharma',
    timestamp: formatDateTime(addDays(today, -1)),
  },
  {
    id: 'act2',
    action: 'Course Published',
    description: 'Published Data Structures & Algorithms',
    timestamp: formatDateTime(addDays(today, -2)),
  },
  {
    id: 'act3',
    action: 'Exam Scheduled',
    description: 'Scheduled Mid-Term Examination for CS-A',
    timestamp: formatDateTime(addDays(today, -3)),
  },
  {
    id: 'act4',
    action: 'Fee Collected',
    description: 'Received tuition fee from Rahul Sharma',
    timestamp: formatDateTime(addDays(today, -5)),
  },
  {
    id: 'act5',
    action: 'Announcement Published',
    description: 'Published mid-term exam schedule',
    timestamp: formatDateTime(addDays(today, -1)),
  },
  {
    id: 'act6',
    action: 'User Deactivated',
    description: 'Deactivated Vikram Reddy account',
    timestamp: formatDateTime(addDays(today, -30)),
  },
  {
    id: 'act7',
    action: 'Settings Updated',
    description: 'Changed email notifications to enabled',
    timestamp: formatDateTime(addDays(today, -1)),
  },
];
