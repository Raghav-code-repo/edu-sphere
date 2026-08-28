import type { NavigationConfig } from '@/types/navigation';

export const studentNavigation: NavigationConfig = {
  label: 'Main Menu',
  items: [
    {
      title: 'Dashboard',
      href: '/student',
      icon: 'layoutDashboard',
    },
    {
      title: 'Courses',
      href: '/student/courses',
      icon: 'bookOpen',
    },
    {
      title: 'Assignments',
      href: '/student/assignments',
      icon: 'clipboardList',
      badge: 3,
    },
    {
      title: 'Exams',
      href: '/student/exams',
      icon: 'fileText',
    },
    {
      title: 'Attendance',
      href: '/student/attendance',
      icon: 'calendarCheck',
    },
    {
      title: 'Grades',
      href: '/student/grades',
      icon: 'barChart3',
    },
    {
      title: 'Schedule',
      href: '/student/calendar',
      icon: 'calendar',
    },
    {
      title: 'Messages',
      href: '/student/messages',
      icon: 'messageSquare',
      badge: 5,
    },
    {
      title: 'Notifications',
      href: '/student/notifications',
      icon: 'bell',
    },
    {
      title: 'Profile',
      href: '/student/profile',
      icon: 'user',
    },
    {
      title: 'Settings',
      href: '/student/settings',
      icon: 'settings',
    },
  ],
};

export const parentNavigation: NavigationConfig = {
  label: 'Main Menu',
  items: [
    {
      title: 'Dashboard',
      href: '/parent',
      icon: 'layoutDashboard',
    },
    {
      title: 'Children',
      href: '/parent/children',
      icon: 'users',
    },
    {
      title: 'Attendance',
      href: '/parent/attendance',
      icon: 'calendarCheck',
    },
    {
      title: 'Academics',
      href: '/parent/academics',
      icon: 'trendingUp',
    },
    {
      title: 'Assignments',
      href: '/parent/assignments',
      icon: 'clipboardList',
      badge: 3,
    },
    {
      title: 'Exams',
      href: '/parent/exams',
      icon: 'fileText',
    },
    {
      title: 'Fees',
      href: '/parent/fees',
      icon: 'creditCard',
    },
    {
      title: 'Messages',
      href: '/parent/messages',
      icon: 'messageSquare',
      badge: 2,
    },
    {
      title: 'Calendar',
      href: '/parent/calendar',
      icon: 'calendar',
    },
    {
      title: 'Notifications',
      href: '/parent/notifications',
      icon: 'bell',
    },
    {
      title: 'Documents',
      href: '/parent/documents',
      icon: 'folderOpen',
    },
    {
      title: 'Profile',
      href: '/parent/profile',
      icon: 'user',
    },
    {
      title: 'Settings',
      href: '/parent/settings',
      icon: 'settings',
    },
  ],
};

export const facultyNavigation: NavigationConfig = {
  label: 'Main Menu',
  items: [
    {
      title: 'Dashboard',
      href: '/faculty/dashboard',
      icon: 'layoutDashboard',
    },
    {
      title: 'Classes',
      href: '/faculty/classes',
      icon: 'bookOpen',
    },
    {
      title: 'Students',
      href: '/faculty/students',
      icon: 'users',
    },
    {
      title: 'Attendance',
      href: '/faculty/attendance',
      icon: 'calendarCheck',
    },
    {
      title: 'Assignments',
      href: '/faculty/assignments',
      icon: 'clipboardList',
      badge: 3,
    },
    {
      title: 'Gradebook',
      href: '/faculty/gradebook',
      icon: 'barChart3',
    },
    {
      title: 'Courses',
      href: '/faculty/courses',
      icon: 'graduationCap',
    },
    {
      title: 'Materials',
      href: '/faculty/materials',
      icon: 'folderOpen',
    },
    {
      title: 'Announcements',
      href: '/faculty/announcements',
      icon: 'megaphone',
    },
    {
      title: 'Messages',
      href: '/faculty/messages',
      icon: 'messageSquare',
      badge: 5,
    },
    {
      title: 'Calendar',
      href: '/faculty/calendar',
      icon: 'calendar',
    },
    {
      title: 'Notifications',
      href: '/faculty/notifications',
      icon: 'bell',
    },
    {
      title: 'Reports',
      href: '/faculty/reports',
      icon: 'trendingUp',
    },
    {
      title: 'Profile',
      href: '/faculty/profile',
      icon: 'user',
    },
    {
      title: 'Settings',
      href: '/faculty/settings',
      icon: 'settings',
    },
  ],
};

export const adminNavigation: NavigationConfig = {
  label: 'Administration',
  items: [
    { title: 'Dashboard', href: '/admin/dashboard', icon: 'layoutDashboard' },
    { title: 'User Management', href: '/admin/users', icon: 'users' },
    { title: 'Students', href: '/admin/students', icon: 'graduationCap' },
    { title: 'Parents', href: '/admin/parents', icon: 'userCheck' },
    { title: 'Faculty', href: '/admin/faculty', icon: 'briefcase' },
    { title: 'Courses', href: '/admin/courses', icon: 'bookOpen' },
    { title: 'Classes', href: '/admin/classes', icon: 'school' },
    { title: 'Subjects', href: '/admin/subjects', icon: 'fileText' },
    { title: 'Departments', href: '/admin/departments', icon: 'building2' },
    { title: 'Attendance', href: '/admin/attendance', icon: 'calendarCheck' },
    { title: 'Assignments', href: '/admin/assignments', icon: 'clipboardList' },
    { title: 'Examinations', href: '/admin/exams', icon: 'fileCheck' },
    { title: 'Fees Management', href: '/admin/fees', icon: 'creditCard' },
    { title: 'Announcements', href: '/admin/announcements', icon: 'megaphone' },
    { title: 'Notifications', href: '/admin/notifications', icon: 'bell' },
    { title: 'Reports', href: '/admin/reports', icon: 'barChart3' },
    { title: 'Analytics', href: '/admin/analytics', icon: 'trendingUp' },
    { title: 'Documents', href: '/admin/documents', icon: 'folderOpen' },
    { title: 'Audit Logs', href: '/admin/audit-logs', icon: 'scrollText' },
    { title: 'Settings', href: '/admin/settings', icon: 'settings' },
  ],
};
