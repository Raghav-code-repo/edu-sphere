import { useEffect, useState } from 'react';
import { PageHeader, GradeCard, EmptyState } from '@/features/student';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { studentApi } from '@/services/api/studentApi';
import type { GradeRecord } from '@/types/student';

export function StudentGrades() {
  const [grades, setGrades] = useState<GradeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentApi.getGrades().then((data) => {
      setGrades(data);
      setLoading(false);
    });
  }, []);

  const overallPercentage =
    grades.length > 0
      ? Math.round(
          (grades.reduce((sum, g) => sum + g.obtainedMarks, 0) /
            grades.reduce((sum, g) => sum + g.totalMarks, 0)) *
            100
        )
      : 0;

  const gpa = overallPercentage / 20;

  const subjectData = grades
    .reduce(
      (acc, g) => {
        const existing = acc.find((a) => a.subject === g.courseCode);
        if (existing) {
          existing.obtained += g.obtainedMarks;
          existing.total += g.totalMarks;
        } else {
          acc.push({ subject: g.courseCode, obtained: g.obtainedMarks, total: g.totalMarks });
        }
        return acc;
      },
      [] as { subject: string; obtained: number; total: number }[]
    )
    .map((d) => ({
      ...d,
      percentage: Math.round((d.obtained / d.total) * 100),
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
      <PageHeader title="Grades" subtitle="Track your academic performance" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{overallPercentage}%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Overall Percentage</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{gpa.toFixed(2)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">GPA</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{grades.length}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Grades</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Performance Overview
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={subjectData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" className="text-xs" />
              <PolarRadiusAxis className="text-xs" />
              <Radar
                name="Percentage"
                dataKey="percentage"
                stroke="#0ea5e9"
                fill="#0ea5e9"
                fillOpacity={0.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Subject-wise Performance
          </h3>
          <div className="space-y-3">
            {subjectData.map((item) => (
              <div key={item.subject} className="flex items-center gap-3">
                <span className="w-12 text-xs font-medium text-gray-600 dark:text-gray-400">
                  {item.subject}
                </span>
                <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className="h-2 rounded-full bg-primary-500"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <span className="w-10 text-xs font-medium text-gray-900 dark:text-white text-right">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Grade Records</h3>
        </div>
        <div className="p-4">
          {grades.length === 0 ? (
            <EmptyState title="No grades yet" description="Your grades will appear here." />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {grades.map((grade) => (
                <GradeCard key={grade.id} grade={grade} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
