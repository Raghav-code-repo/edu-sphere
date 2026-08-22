import { useEffect, useState } from 'react';
import { PageHeader, ChildSwitcher } from '@/features/parent';
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
import { parentMockService } from '@/services/mock/parentMockService';
import type { Child, ChildAttendanceSummary } from '@/types/parent';

export function ParentAttendance() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [summaries, setSummaries] = useState<ChildAttendanceSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [childrenData, summariesData] = await Promise.all([
        parentMockService.getChildren(),
        parentMockService.getChildAttendanceSummary(),
      ]);
      setChildren(childrenData);
      setSelectedChildId(childrenData[0]?.id || '');
      setSummaries(summariesData);
      setLoading(false);
    }
    loadData();
  }, []);

  const selectedSummary = summaries.find((s) => s.childId === selectedChildId);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" subtitle="Track your children's attendance" />

      <ChildSwitcher
        items={children}
        selectedChildId={selectedChildId}
        onSelect={setSelectedChildId}
      />

      {selectedSummary && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedSummary.percentage}%
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Attendance</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {selectedSummary.present}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Present</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {selectedSummary.absent}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Absent</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {selectedSummary.late}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Late</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Monthly Attendance
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart
                  data={[
                    { month: 'Jan', attendance: 95 },
                    { month: 'Feb', attendance: 88 },
                    { month: 'Mar', attendance: 92 },
                    { month: 'Apr', attendance: 85 },
                    { month: 'May', attendance: 90 },
                    { month: 'Jun', attendance: 94 },
                  ]}
                >
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
                    dataKey="attendance"
                    stroke="#0ea5e9"
                    fill="#0ea5e9"
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
                  data={[
                    { subject: 'CS201', attendance: 89 },
                    { subject: 'CS301', attendance: 92 },
                    { subject: 'CS401', attendance: 95 },
                    { subject: 'CS302', attendance: 78 },
                  ]}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-gray-200 dark:stroke-gray-700"
                  />
                  <XAxis dataKey="subject" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(31 41 55)',
                      border: 'none',
                      borderRadius: '0.5rem',
                      color: 'white',
                    }}
                  />
                  <Bar dataKey="attendance" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
