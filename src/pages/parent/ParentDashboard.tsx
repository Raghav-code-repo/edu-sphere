import { useEffect, useState } from 'react';
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
import { BookOpen, ClipboardList, CalendarDays, TrendingUp } from 'lucide-react';
import { PageHeader, ChildSection, ChildSwitcher } from '@/features/parent';
import { KpiCard, AnnouncementCard, ActivityItem } from '@/features/student';
import { parentMockService } from '@/services/mock/parentMockService';
import type { Child, ParentDashboardStats } from '@/types/parent';

export function ParentDashboard() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [stats, setStats] = useState<ParentDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [childrenData, statsData] = await Promise.all([
        parentMockService.getChildren(),
        parentMockService.getDashboardStats(),
      ]);
      setChildren(childrenData);
      setSelectedChildId(childrenData[0]?.id || '');
      setStats(statsData);
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

  const selectedChild = children.find((c) => c.id === selectedChildId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parent Dashboard"
        subtitle="Monitor your children's academic progress and activities"
      />

      <ChildSwitcher
        items={children}
        selectedChildId={selectedChildId}
        onSelect={setSelectedChildId}
      />

      {selectedChild && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              title="Attendance"
              value="92%"
              icon={<BookOpen className="h-6 w-6" />}
              color="#0ea5e9"
              description="Average attendance"
              trend={{ value: 2, isPositive: true }}
            />
            <KpiCard
              title="Academic Progress"
              value="85%"
              icon={<TrendingUp className="h-6 w-6" />}
              color="#10b981"
              description="Overall performance"
              trend={{ value: 5, isPositive: true }}
            />
            <KpiCard
              title="Pending Assignments"
              value={stats?.pendingAssignments || 0}
              icon={<ClipboardList className="h-6 w-6" />}
              color="#f59e0b"
              description="Requires attention"
            />
            <KpiCard
              title="Upcoming Exams"
              value={stats?.upcomingExams || 0}
              icon={<CalendarDays className="h-6 w-6" />}
              color="#8b5cf6"
              description="Next 30 days"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <ChildSection
                title="Performance Analytics"
                description={`${selectedChild.firstName}'s academic performance`}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                      Attendance Trend
                    </h4>
                    <ResponsiveContainer width="100%" height={200}>
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
                  <div>
                    <h4 className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                      Subject Performance
                    </h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart
                        data={[
                          { subject: 'CS201', score: 85 },
                          { subject: 'CS301', score: 72 },
                          { subject: 'CS401', score: 91 },
                          { subject: 'CS302', score: 68 },
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
                        <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </ChildSection>

              <ChildSection title="Upcoming Assignments">
                <div className="space-y-3">
                  {[
                    { title: 'Binary Tree Implementation', course: 'CS201', due: '2 days' },
                    { title: 'ER Diagram Design', course: 'CS301', due: '5 days' },
                  ].map((assignment, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {assignment.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {assignment.course}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                        Due in {assignment.due}
                      </span>
                    </div>
                  ))}
                </div>
              </ChildSection>

              <ChildSection title="Upcoming Exams">
                <div className="space-y-3">
                  {[
                    {
                      title: 'Mid-Term Examination',
                      course: 'CS201',
                      date: '14 days',
                      time: '10:00 AM - 12:00 PM',
                    },
                    {
                      title: 'Quiz 3 - SQL Joins',
                      course: 'CS301',
                      date: '5 days',
                      time: '02:00 PM - 02:45 PM',
                    },
                  ].map((exam, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {exam.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {exam.course} • {exam.time}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        In {exam.date}
                      </span>
                    </div>
                  ))}
                </div>
              </ChildSection>
            </div>

            <div className="space-y-6">
              <ChildSection title="Fees Overview">
                <div className="space-y-3">
                  {[
                    { child: 'Rahul', total: 45000, paid: 31500, pending: 13500 },
                    { child: 'Priya', total: 48000, paid: 33600, pending: 14400 },
                  ].map((fee, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {fee.child}
                        </span>
                        <span className="text-xs font-medium text-red-600 dark:text-red-400">
                          ₹{fee.pending.toLocaleString()} pending
                        </span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-2 rounded-full bg-primary-500"
                          style={{ width: `${(fee.paid / fee.total) * 100}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        ₹{fee.paid.toLocaleString()} paid of ₹{fee.total.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </ChildSection>

              <ChildSection title="Announcements">
                <div className="space-y-3">
                  <AnnouncementCard
                    announcement={{
                      id: 'ann1',
                      title: 'Parent-Teacher Meeting',
                      content: 'Scheduled for next Wednesday at 3:00 PM.',
                      author: 'Admin Office',
                      date: '2025-01-15',
                      important: true,
                    }}
                  />
                  <AnnouncementCard
                    announcement={{
                      id: 'ann2',
                      title: 'Fee Payment Reminder',
                      content: 'Semester fee payment is due soon.',
                      author: 'Accounts',
                      date: '2025-01-10',
                      important: false,
                    }}
                  />
                </div>
              </ChildSection>

              <ChildSection title="Recent Activity">
                <div className="space-y-1">
                  <ActivityItem
                    activity={{
                      id: 'a1',
                      action: 'Assignment Submitted',
                      description: 'Rahul submitted Binary Tree Implementation',
                      timestamp: '2025-01-18',
                    }}
                  />
                  <ActivityItem
                    activity={{
                      id: 'a2',
                      action: 'Grade Posted',
                      description: 'Priya received A+ in Electronics Lab',
                      timestamp: '2025-01-17',
                    }}
                  />
                  <ActivityItem
                    activity={{
                      id: 'a3',
                      action: 'Attendance Alert',
                      description: 'Rahul was absent on Jan 15',
                      timestamp: '2025-01-15',
                    }}
                  />
                </div>
              </ChildSection>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
