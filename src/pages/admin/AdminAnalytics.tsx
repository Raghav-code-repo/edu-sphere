import { useEffect, useState } from 'react';
import { PageHeader } from '@/features/admin';
import { adminMockService } from '@/services/mock/adminMockService';
import type { AdminAnalytics } from '@/types/admin';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const tooltipStyle = {
  backgroundColor: '#1f2937',
  border: 'none',
  borderRadius: '8px',
  color: '#fff',
};

export function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    async function loadAnalytics() {
      setLoading(true);
      const data = await adminMockService.getAnalytics();
      setAnalytics(data);
      setLoading(false);
    }
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Analytics" subtitle="View analytics and insights" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-600 mb-4" />
              <div className="h-64 animate-pulse rounded bg-gray-200 dark:bg-gray-600" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" subtitle="View analytics and insights" />

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date From
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date To
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Enrollment Trend
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.enrollmentTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Line type="monotone" dataKey="students" stroke="#3b82f6" name="Students" />
                <Line type="monotone" dataKey="parents" stroke="#22c55e" name="Parents" />
                <Line type="monotone" dataKey="faculty" stroke="#a855f7" name="Faculty" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Attendance Trend
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="present"
                  stroke="#22c55e"
                  fill="#86efac"
                  name="Present"
                />
                <Area
                  type="monotone"
                  dataKey="absent"
                  stroke="#ef4444"
                  fill="#fca5a5"
                  name="Absent"
                />
                <Area type="monotone" dataKey="late" stroke="#eab308" fill="#fde047" name="Late" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Academic Performance
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.academicPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="course" />
                <YAxis />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="average" fill="#3b82f6" name="Average" />
                <Bar dataKey="passRate" fill="#22c55e" name="Pass Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Fee Collection
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.feeCollection}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="collected"
                  stroke="#22c55e"
                  fill="#86efac"
                  name="Collected"
                />
                <Area
                  type="monotone"
                  dataKey="pending"
                  stroke="#ef4444"
                  fill="#fca5a5"
                  name="Pending"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Course Activity
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.courseActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="course" />
                <YAxis />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="engagement" fill="#8b5cf6" name="Engagement %" />
                <Bar dataKey="submissions" fill="#06b6d4" name="Submissions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Faculty Workload
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.facultyWorkload} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="faculty" type="category" width={100} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="hours" fill="#f97316" name="Hours" />
                <Bar dataKey="classes" fill="#3b82f6" name="Classes" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
