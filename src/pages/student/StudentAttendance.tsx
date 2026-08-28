import { useEffect, useState } from 'react';
import { PageHeader } from '@/features/student';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { studentApi } from '@/services/api/studentApi';
import type { AttendanceRecord } from '@/types/student';

const monthlyAttendanceData = [
  { month: 'Jan', present: 20, absent: 1, late: 2 },
  { month: 'Feb', present: 18, absent: 0, late: 1 },
  { month: 'Mar', present: 22, absent: 2, late: 0 },
  { month: 'Apr', present: 19, absent: 1, late: 1 },
  { month: 'May', present: 21, absent: 0, late: 0 },
  { month: 'Jun', present: 17, absent: 1, late: 2 },
];

export function StudentAttendance() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentApi.getAttendance().then((data) => {
      setRecords(data);
      setLoading(false);
    });
  }, []);

  const filtered =
    selectedCourse === 'all' ? records : records.filter((r) => r.courseId === selectedCourse);
  const total = filtered.length;
  const present = filtered.filter((r) => r.status === 'present').length;
  const absent = filtered.filter((r) => r.status === 'absent').length;
  const late = filtered.filter((r) => r.status === 'late').length;
  const excused = filtered.filter((r) => r.status === 'excused').length;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  const courseIds = Array.from(new Set(records.map((r) => r.courseId)));
  const courseNames: Record<string, string> = {};
  records.forEach((r) => {
    if (!courseNames[r.courseId]) courseNames[r.courseId] = r.courseName;
  });

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" subtitle="Track your attendance across all courses" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{percentage}%</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Overall Attendance</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{present}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Present</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{absent}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Absent</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{late}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Late</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{excused}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Excused</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Attendance
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyAttendanceData}>
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
              <Area
                type="monotone"
                dataKey="present"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="late"
                stackId="1"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="absent"
                stackId="1"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Subject-wise Attendance
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={courseIds.map((id) => {
                const courseRecords = records.filter((r) => r.courseId === id);
                const presentCount = courseRecords.filter((r) => r.status === 'present').length;
                const totalCount = courseRecords.length;
                return {
                  name: courseNames[id] || id,
                  present: totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0,
                };
              })}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-gray-200 dark:stroke-gray-700"
              />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgb(31 41 55)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: 'white',
                }}
                formatter={(value) => [`${value}%`, 'Attendance']}
              />
              <Bar dataKey="present" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Attendance History
            </h3>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="all">All Courses</option>
              {courseIds.map((id) => (
                <option key={id} value={id}>
                  {courseNames[id] || id}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
              No attendance records found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((record) => (
                <div
                  key={record.id}
                  className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {record.courseName}
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${record.status === 'present' ? 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20' : record.status === 'absent' ? 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20' : record.status === 'late' ? 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20' : 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20'}`}
                    >
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {record.courseCode} • {record.date}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
