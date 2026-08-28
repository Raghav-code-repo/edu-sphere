import { useEffect, useState } from 'react';
import { PageHeader, ChildSwitcher } from '@/features/parent';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { parentApi } from '@/services/api/parentApi';
import type { Child, ChildAcademicSummary } from '@/types/parent';

export function ParentAcademics() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [summaries, setSummaries] = useState<ChildAcademicSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [childrenData, summariesData] = await Promise.all([
        parentApi.getChildren(),
        parentApi.getChildAcademicSummary(),
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

  const performanceData = [
    { subject: 'CS201', score: 85 },
    { subject: 'CS301', score: 72 },
    { subject: 'CS401', score: 91 },
    { subject: 'CS302', score: 68 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Academic Performance" subtitle="Track your children's academic progress" />

      <ChildSwitcher
        items={children}
        selectedChildId={selectedChildId}
        onSelect={setSelectedChildId}
      />

      {selectedSummary && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {selectedSummary.gpa}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">GPA</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {selectedSummary.percentage}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Percentage</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                #{selectedSummary.rank}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Class Rank</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {selectedSummary.grade}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Grade</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Performance Overview
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={performanceData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" className="text-xs" />
                  <PolarRadiusAxis className="text-xs" />
                  <Radar
                    name="Score"
                    dataKey="score"
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
                {performanceData.map((item) => (
                  <div key={item.subject} className="flex items-center gap-3">
                    <span className="w-12 text-xs font-medium text-gray-600 dark:text-gray-400">
                      {item.subject}
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-2 rounded-full bg-primary-500"
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                    <span className="w-10 text-xs font-medium text-gray-900 dark:text-white text-right">
                      {item.score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
