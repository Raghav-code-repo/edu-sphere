import { useEffect, useState } from 'react';
import { PageHeader, EmptyState, ChartCard } from '@/features/faculty';
import { facultyApi } from '@/services/api/facultyApi';
import type { Report, StudentPerformanceData } from '@/types/faculty';
import { FileText, Users, BarChart3, TrendingUp, Download } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444'];

export function FacultyReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [performanceData, setPerformanceData] = useState<StudentPerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [reportType, setReportType] = useState<string>('performance');
  const [reportPeriod, setReportPeriod] = useState<string>('Q3 2026');

  useEffect(() => {
    async function loadData() {
      const [reportsData, performance] = await Promise.all([
        facultyApi.getReports(),
        facultyApi.getStudentPerformance(),
      ]);
      setReports(reportsData);
      setPerformanceData(performance);
      setLoading(false);
    }
    loadData();
  }, []);

  const typeIcons: Record<string, React.ReactNode> = {
    attendance: <Users className="h-5 w-5" />,
    grades: <FileText className="h-5 w-5" />,
    performance: <BarChart3 className="h-5 w-5" />,
    enrollment: <TrendingUp className="h-5 w-5" />,
  };

  const typeColors: Record<string, string> = {
    attendance: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    grades: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    performance: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
    enrollment: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
  };

  const summaryCards = [
    {
      title: 'Total Reports',
      value: reports.length,
      color: '#0ea5e9',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: 'Avg Performance',
      value: `${performanceData.length > 0 ? Math.round(performanceData.reduce((sum, p) => sum + p.overall, 0) / performanceData.length) : 0}%`,
      color: '#10b981',
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: 'Top Performer',
      value:
        performanceData.length > 0
          ? performanceData
              .reduce((a, b) => (a.overall > b.overall ? a : b))
              .studentName.split(' ')[0]
          : '-',
      color: '#f59e0b',
      icon: <TrendingUp className="h-5 w-5" />,
    },
  ];

  const chartData = performanceData.map((p) => ({
    name: p.studentName.split(' ')[0],
    overall: p.overall,
    assignments: p.assignmentsAvg,
    quizzes: p.quizzesAvg,
  }));

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        subtitle="Generate and view academic reports"
        actions={
          <button
            onClick={() => setShowGenerateForm(!showGenerateForm)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500"
          >
            <Download className="h-4 w-4" />
            Generate Report
          </button>
        }
      />

      {showGenerateForm && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Generate New Report
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="attendance">Attendance</option>
                <option value="grades">Grades</option>
                <option value="performance">Performance</option>
                <option value="enrollment">Enrollment</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Period
              </label>
              <select
                value={reportPeriod}
                onChange={(e) => setReportPeriod(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="Q1 2026">Q1 2026</option>
                <option value="Q2 2026">Q2 2026</option>
                <option value="Q3 2026">Q3 2026</option>
                <option value="Q4 2026">Q4 2026</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-500">
                Generate
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{card.title}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {card.value}
                </p>
              </div>
              <div
                className="rounded-lg p-2"
                style={{ backgroundColor: `${card.color}15`, color: card.color }}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Performance Overview" description="Student performance comparison">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
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
              />
              <Bar dataKey="overall" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Score Distribution" description="Overall vs assignments vs quizzes">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Overall', value: performanceData.reduce((s, p) => s + p.overall, 0) },
                  {
                    name: 'Assignments',
                    value: performanceData.reduce((s, p) => s + p.assignmentsAvg, 0),
                  },
                  { name: 'Quizzes', value: performanceData.reduce((s, p) => s + p.quizzesAvg, 0) },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {[0, 1, 2].map((index) => (
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
        </ChartCard>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Reports</h3>
        </div>
        <div className="p-4">
          {reports.length === 0 ? (
            <EmptyState
              title="No reports"
              description="Generate your first report to see it here."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-lg p-1.5 ${typeColors[report.type] || typeColors.performance}`}
                      >
                        {typeIcons[report.type] || typeIcons.performance}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[report.type] || typeColors.performance}`}
                      >
                        {report.type}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {report.period}
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                    {report.title}
                  </h4>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Generated on{' '}
                    {new Date(report.generatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
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
