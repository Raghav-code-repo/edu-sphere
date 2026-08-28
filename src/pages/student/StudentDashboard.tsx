import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ClipboardList, CalendarDays, TrendingUp } from 'lucide-react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  PageHeader,
  KpiCard,
  ChartCard,
  QuickActions,
  AnnouncementCard,
  ActivityItem,
  ScheduleItem,
} from '@/features/student';
import { studentApi } from '@/services/api/studentApi';
import type {
  Course,
  Assignment,
  Exam,
  Announcement,
  ActivityLog,
  CalendarEvent,
  DashboardStats,
} from '@/types/student';

const subjectPerformanceData = [
  { subject: 'CS201', score: 85 },
  { subject: 'CS301', score: 72 },
  { subject: 'CS401', score: 91 },
  { subject: 'CS302', score: 68 },
];

const examPerformanceData = [
  { name: 'A+', value: 2 },
  { name: 'A', value: 5 },
  { name: 'B+', value: 1 },
  { name: 'B', value: 0 },
];

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];

export function StudentDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [schedule, setSchedule] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [
        dashboardStats,
        coursesData,
        assignmentsData,
        examsData,
        announcementsData,
        activitiesData,
        scheduleData,
      ] = await Promise.all([
        studentApi.getDashboardStats(),
        studentApi.getCourses(),
        studentApi.getAssignments(),
        studentApi.getExams(),
        studentApi.getAnnouncements(),
        studentApi.getActivityLog(),
        studentApi.getCalendarEvents(),
      ]);

      setStats(dashboardStats);
      setCourses(coursesData);
      setAssignments(assignmentsData);
      setExams(examsData);
      setAnnouncements(announcementsData);
      setActivities(activitiesData);
      setSchedule(scheduleData);
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

  const upcomingAssignments = assignments
    .filter((a) => a.status === 'pending' || a.status === 'overdue')
    .slice(0, 3);
  const upcomingExams = exams.filter((e) => e.status === 'upcoming').slice(0, 3);
  const continueCourses = courses.filter((c) => c.progress < 100 && c.progress > 0).slice(0, 3);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Good morning, Rahul"
        subtitle="Here's what's happening with your studies today."
      />

      <QuickActions />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Attendance"
          value={`${stats?.attendancePercentage || 0}%`}
          icon={<BookOpen className="h-6 w-6" />}
          color="#0ea5e9"
          description={`${stats?.totalLessons || 0} total lessons`}
          trend={{ value: 2, isPositive: true }}
        />
        <KpiCard
          title="Academic Progress"
          value={`${stats?.academicProgress || 0}%`}
          icon={<TrendingUp className="h-6 w-6" />}
          color="#10b981"
          description={`${stats?.totalCourses || 0} active courses`}
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
          <ChartCard title="Performance Analytics" description="Your academic performance overview">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h4 className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                  Subject Performance
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={subjectPerformanceData}>
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
                    <Bar dataKey="score" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h4 className="mb-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                  Exam Performance
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={examPerformanceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {examPerformanceData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgb(31 41 55)',
                        border: 'none',
                        borderRadius: '0.5rem',
                        color: 'white',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ChartCard>

          <ChartCard title="Continue Learning" description="Pick up where you left off">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {continueCourses.map((course) => (
                <Link
                  key={course.id}
                  to={`/student/courses/${course.id}`}
                  className="block rounded-lg border border-gray-200 p-4 hover:shadow-md dark:border-gray-700"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: course.color }}
                    />
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {course.code}
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {course.name}
                  </h4>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                    Next: {course.nextLesson?.title}
                  </p>
                  <div className="mt-2 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-1.5 rounded-full bg-primary-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Today's Schedule" description="Your classes and events for today">
            <div className="space-y-2">
              {schedule.slice(0, 4).map((event) => (
                <ScheduleItem key={event.id} event={event} />
              ))}
              {schedule.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No events scheduled for today.
                </p>
              )}
            </div>
          </ChartCard>
        </div>

        <div className="space-y-6">
          <ChartCard title="Upcoming Assignments" description="Due soon">
            <div className="space-y-3">
              {upcomingAssignments.map((assignment) => (
                <Link
                  key={assignment.id}
                  to={`/student/assignments/${assignment.id}`}
                  className="block rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-750"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {assignment.courseCode}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${assignment.status === 'overdue' ? 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20' : 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20'}`}
                    >
                      {assignment.status === 'overdue' ? 'Overdue' : 'Pending'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                    {assignment.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Due: {assignment.dueDate}
                  </p>
                </Link>
              ))}
            </div>
            <Link
              to="/student/assignments"
              className="mt-3 inline-block text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              View all assignments →
            </Link>
          </ChartCard>

          <ChartCard title="Upcoming Exams" description="Prepare for these">
            <div className="space-y-3">
              {upcomingExams.map((exam) => (
                <Link
                  key={exam.id}
                  to={`/student/exams/${exam.id}`}
                  className="block rounded-lg border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-750"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {exam.courseCode}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{exam.date}</span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white line-clamp-1">
                    {exam.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {exam.startTime} - {exam.endTime} • {exam.location}
                  </p>
                </Link>
              ))}
            </div>
            <Link
              to="/student/exams"
              className="mt-3 inline-block text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              View all exams →
            </Link>
          </ChartCard>

          <ChartCard title="Announcements">
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} />
              ))}
            </div>
          </ChartCard>

          <ChartCard title="Recent Activity">
            <div className="space-y-1">
              {activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
