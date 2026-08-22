import type { AdminSettings } from '@/types/admin';

export const SETTINGS: AdminSettings = {
  institutionName: 'EduSphere University',
  institutionCode: 'EDU-SPHERE',
  academicYear: '2024-25',
  currentSemester: '6th',
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD/MM/YYYY',
  emailNotifications: true,
  smsNotifications: false,
  autoEnrollment: true,
  gradeSystem: 'GPA',
  passPercentage: 40,
  maxAbsenceAllowed: 25,
  features: {
    attendanceTracking: true,
    onlineExams: true,
    feeManagement: true,
    documentManagement: true,
    auditLogging: true,
  },
};
