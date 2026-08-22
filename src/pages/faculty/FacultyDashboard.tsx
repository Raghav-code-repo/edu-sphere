import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CalendarDays, ClipboardList, TrendingUp, Users } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { PageHeader, KpiCard, ChartCard, QuickActions } from '@/features/faculty';
import { facultyMockService } from '@/services/mock/facultyMockService';
import type {
  FacultyDashboardStats,
  TodayClass,
  PendingAction,
  Submission,
  StudentPerformanceData,
  AttendanceAnalyticsData,
  SubmissionTrend,
} from '@/types/faculty';

export function FacultyDashboard() {
  const [stats, setStats] = useState<FacultyDashboardStats | null>(null);
  const [todayClasses, setTodayClasses] = useState<TodayClass[]>([]);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [studentPerformance, setStudentPerformance] = useState<StudentPerformanceData[]>([]);
  const [attendanceAnalytics, setAttendanceAnalytics] = useState<AttendanceAnalyticsData[]>([]);
  const [submissionTrends, setSubmissionTrends] = useState<SubmissionTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [
        dashboardStats,
        classesData,
        actionsData,
        submissionsData,
        performanceData,
        analyticsData,
        trendsData,
      ] = await Promise.all([
        facultyMockService.getDashboardStats(),
        facultyMockService.getTodayClasses(),
        facultyMockService.getPendingActions(),
        facultyMockService.getSubmissions(),
        facultyMockService.getStudentPerformance(),
        facultyMockService.getAttendanceAnalytics(),
        facultyMockService.getSubmissionTrends(),
      ]);

      setStats(dashboardStats);
      setTodayClasses(classesData);
      setPendingActions(actionsData);
      setSubmissions(submissionsData);
      setStudentPerformance(performanceData);
      setAttendanceAnalytics(analyticsData);
      setSubmissionTrends(trendsData);
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

  const recentSubmissions = submissions.slice(0, 5);

  const assignmentCompletionData = submissionTrends.map((trend) => ({
    date: trend.date,
    submitted: trend.submitted,
    pending: trend.total - trend.submitted,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Good morning, Prof. Smith"
        subtitle="Here's what's happening with your classes today."
      />

      <QuickActions />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={<Users className="h-6 w-6" />}
          color="#0ea5e9"
          description="Across all courses"
        />
        <KpiCard
          title="Classes Today"
          value={stats?.classesToday || 0}
          icon={<CalendarDays className="h-6 w-6" />}
          color="#10b981"
          description="Scheduled sessions"
        />
        <KpiCard
          title="Assignments Pending Review"
          value={stats?.pendingReview || 0}
          icon={<ClipboardList className="h-6 w-6" />}
          color="#f59e0b"
          description="Awaiting grading"
        />
        <KpiCard
          title="Average Class Performance"
          value={`${stats?.averagePerformance || 0}%`}
          icon={<TrendingUp className="h-6 w-6" />}
          color="#8b5cf6"
          description="Overall average"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ChartCard title="Today's Classes" description="Your schedule for today">
            <div className="space-y-3">
              {todayClasses.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No classes scheduled for today.
                </p>
              ) : (
                todayClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="flex items-center gap-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                  >
                    <div
                      className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: `${cls.color || '#0ea5e9'}15`,
                        color: cls.color || '#0ea5e9',
                      }}
                    >
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {cls.courseName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {cls.courseCode} • {cls.startTime} - {cls.endTime} • {cls.location}
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 capitalize">
                      {cls.type}
                    </span>
                  </div>
                ))
              )}
            </div>
          </ChartCard>

          <ChartCard title="Student Performance" description="Average scores by student">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={studentPerformance}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200 dark:stroke-gray-700"
                />
                <XAxis
                  dataKey="studentName"
                  className="text-xs"
                  angle={-45}
                  textAnchor="end"
                  height={80}
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
                <Bar dataKey="overall" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Assignment Completion" description="Submission trends">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={assignmentCompletionData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200 dark:stroke-gray-700"
                />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(31 41 55)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white',
                  }}
                />
                <Bar dataKey="submitted" fill="#10b981" radius={[4, 4, 0, 0]} name="Submitted" />
                <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="space-y-6">
          <ChartCard title="Pending Actions" description="Tasks requiring attention">
            <div className="space-y-3">
              {pendingActions.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No pending actions.</p>
              ) : (
                pendingActions.map((action) => (
                  <Link
                    key={action.id}
                    to={action.routerLink}
                    className="block rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-750"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {action.courseCode}
                      </span>
                      {action.count !== undefined && (
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400">
                          {action.count}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      {action.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{action.description}</p>
                  </Link>
                ))
              )}
            </div>
          </ChartCard>

          <ChartCard title="Recent Submissions" description="Latest student submissions">
            <div className="space-y-1">
              {recentSubmissions.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No submissions yet.</p>
              ) : (
                recentSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-750"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {submission.studentName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Submitted {submission.submittedAt}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        submission.status === 'graded'
                          ? 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
                          : submission.status === 'reviewed'
                            ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
                            : 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20'
                      }`}
                    >
                      {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </ChartCard>

          <ChartCard title="Attendance Analytics" description="Overview by course">
            <div className="space-y-3">
              {attendanceAnalytics.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No attendance data available.
                </p>
              ) : (
                attendanceAnalytics.map((item) => (
                  <div key={item.courseCode} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.courseName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.courseCode}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {item.percentage}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-2 rounded-full bg-primary-500"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>Present: {item.present}</span>
                      <span>Absent: {item.absent}</span>
                      <span>Late: {item.late}</span>
                      <span>Excused: {item.excused}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
