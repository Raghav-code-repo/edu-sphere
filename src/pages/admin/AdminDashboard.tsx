import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Briefcase,
  BookOpen,
  CalendarCheck,
  CreditCard,
  FileText,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { PageHeader } from '@/features/admin';
import { adminMockService } from '@/services/mock/adminMockService';
import type { AdminDashboardStats, AdminAnalytics } from '@/types/admin';

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [dashboardStats, analyticsData] = await Promise.all([
        adminMockService.getDashboardStats(),
        adminMockService.getAnalytics(),
      ]);
      setStats(dashboardStats);
      setAnalytics(analyticsData);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: Users,
      color: '#0ea5e9',
      href: '/admin/students',
    },
    {
      title: 'Total Parents',
      value: stats?.totalParents || 0,
      icon: UserCheck,
      color: '#10b981',
      href: '/admin/parents',
    },
    {
      title: 'Total Faculty',
      value: stats?.totalFaculty || 0,
      icon: Briefcase,
      color: '#f59e0b',
      href: '/admin/faculty',
    },
    {
      title: 'Active Courses',
      value: stats?.activeCourses || 0,
      icon: BookOpen,
      color: '#8b5cf6',
      href: '/admin/courses',
    },
    {
      title: 'Attendance Today',
      value: stats?.attendanceToday || 0,
      icon: CalendarCheck,
      color: '#ec4899',
      href: '/admin/attendance',
    },
    {
      title: 'Pending Fees',
      value: stats?.pendingFees || 0,
      icon: CreditCard,
      color: '#ef4444',
      href: '/admin/fees',
    },
    {
      title: 'Upcoming Exams',
      value: stats?.upcomingExams || 0,
      icon: FileText,
      color: '#06b6d4',
      href: '/admin/exams',
    },
  ];

  const alerts = [
    { type: 'error', message: '3 students have overdue fees totaling ₹1.5 lakh', icon: XCircle },
    { type: 'warning', message: 'Vikram Reddy has attendance below 50%', icon: AlertTriangle },
    {
      type: 'success',
      message: 'Mid-term exam schedule published successfully',
      icon: CheckCircle,
    },
    { type: 'info', message: '5 new student registrations pending approval', icon: AlertTriangle },
  ];

  const quickActions = [
    { title: 'Add User', href: '/admin/users', icon: Users },
    { title: 'Create Course', href: '/admin/courses', icon: BookOpen },
    { title: 'Schedule Exam', href: '/admin/exams', icon: FileText },
    { title: 'Mark Attendance', href: '/admin/attendance', icon: CalendarCheck },
    { title: 'Send Announcement', href: '/admin/announcements', icon: Settings },
    { title: 'Generate Report', href: '/admin/reports', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        subtitle="EduSphere University - Complete system overview"
        action={
          <Link
            to="/admin/settings"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={kpi.title}
              to={kpi.href}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-lg p-2`} style={{ backgroundColor: `${kpi.color}15` }}>
                  <Icon className="h-5 w-5" style={{ color: kpi.color }} />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">{kpi.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{kpi.title}</p>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                Enrollment Trend
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={analytics?.enrollmentTrend || []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-gray-200 dark:stroke-gray-700"
                  />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(31 41 55)',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: 'white',
                    }}
                  />
                  <Area type="monotone" dataKey="students" stroke="#0ea5e9" fill="#0ea5e920" />
                  <Area type="monotone" dataKey="parents" stroke="#10b981" fill="#10b98120" />
                  <Area type="monotone" dataKey="faculty" stroke="#f59e0b" fill="#f59e0b20" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                Attendance Overview
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analytics?.attendanceTrend?.slice(-7) || []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-gray-200 dark:stroke-gray-700"
                  />
                  <XAxis
                    dataKey="date"
                    className="text-xs"
                    tickFormatter={(val) =>
                      new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    }
                  />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(31 41 55)',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: 'white',
                    }}
                  />
                  <Bar dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="late" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                Academic Performance
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analytics?.academicPerformance || []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-gray-200 dark:stroke-gray-700"
                  />
                  <XAxis
                    dataKey="course"
                    className="text-xs"
                    tickFormatter={(val) => (val.length > 15 ? val.slice(0, 15) + '...' : val)}
                  />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(31 41 55)',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: 'white',
                    }}
                  />
                  <Bar dataKey="average" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="passRate" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                Fee Collection
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={analytics?.feeCollection || []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-gray-200 dark:stroke-gray-700"
                  />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(31 41 55)',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: 'white',
                    }}
                  />
                  <Area type="monotone" dataKey="collected" stroke="#10b981" fill="#10b98120" />
                  <Area type="monotone" dataKey="pending" stroke="#f59e0b" fill="#f59e0b20" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                Course Activity
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analytics?.courseActivity || []} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-gray-200 dark:stroke-gray-700"
                  />
                  <XAxis type="number" className="text-xs" />
                  <YAxis
                    dataKey="course"
                    type="category"
                    className="text-xs"
                    tickFormatter={(val) => (val.length > 15 ? val.slice(0, 15) + '...' : val)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(31 41 55)',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: 'white',
                    }}
                  />
                  <Bar dataKey="engagement" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">
                Faculty Workload
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analytics?.facultyWorkload || []} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-gray-200 dark:stroke-gray-700"
                  />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="faculty" type="category" className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(31 41 55)',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: 'white',
                    }}
                  />
                  <Bar dataKey="hours" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">System Alerts</h3>
            <div className="space-y-3">
              {alerts.map((alert, index) => {
                const Icon = alert.icon;
                const colors = {
                  error: 'text-red-600 bg-red-50 dark:bg-red-900/20',
                  warning: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
                  success: 'text-green-600 bg-green-50 dark:bg-green-900/20',
                  info: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
                };
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-3 rounded-lg p-3 ${colors[alert.type as keyof typeof colors]}`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{alert.message}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.title}
                    to={action.href}
                    className="flex flex-col items-center gap-2 rounded-lg border border-gray-200 p-4 text-center hover:border-primary-300 hover:bg-primary-50 dark:border-gray-700 dark:hover:border-primary-700 dark:hover:bg-primary-900/10 transition-colors"
                  >
                    <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {action.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
