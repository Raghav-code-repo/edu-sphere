import { useEffect, useState } from 'react';
import { PageHeader, ChildSwitcher, EmptyState } from '@/features/parent';
import { parentMockService } from '@/services/mock/parentMockService';
import type { Child, ParentExam } from '@/types/parent';

export function ParentExams() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [exams, setExams] = useState<ParentExam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [childrenData, examsData] = await Promise.all([
        parentMockService.getChildren(),
        parentMockService.getExams(),
      ]);
      setChildren(childrenData);
      setSelectedChildId(childrenData[0]?.id || '');
      setExams(examsData);
      setLoading(false);
    }
    loadData();
  }, []);

  const childExams = exams.filter((e) => e.childId === selectedChildId);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Exams" subtitle="View your children's exam schedule and results" />

      <ChildSwitcher
        items={children}
        selectedChildId={selectedChildId}
        onSelect={setSelectedChildId}
      />

      {childExams.length === 0 ? (
        <EmptyState
          title="No exams found"
          description="Exam details will appear here when scheduled."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {childExams.map((exam) => (
            <div
              key={exam.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {exam.courseCode}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        exam.status === 'upcoming'
                          ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
                          : exam.status === 'completed'
                            ? 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
                            : 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20'
                      }`}
                    >
                      {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-white">
                    {exam.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{exam.courseName}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>{exam.date}</span>
                    <span>
                      {exam.startTime} - {exam.endTime}
                    </span>
                    <span>{exam.location}</span>
                    <span>Total: {exam.totalMarks}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
