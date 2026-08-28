import { useEffect, useState } from 'react';
import { PageHeader, ChildSwitcher, EmptyState } from '@/features/parent';
import { parentApi } from '@/services/api/parentApi';
import type { Child, ParentAssignment } from '@/types/parent';

export function ParentAssignments() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [assignments, setAssignments] = useState<ParentAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [childrenData, assignmentsData] = await Promise.all([
        parentApi.getChildren(),
        parentApi.getAssignments(),
      ]);
      setChildren(childrenData);
      setSelectedChildId(childrenData[0]?.id || '');
      setAssignments(assignmentsData);
      setLoading(false);
    }
    loadData();
  }, []);

  const childAssignments = assignments.filter((a) => a.childId === selectedChildId);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Assignments" subtitle="View your children's assignments" />

      <ChildSwitcher
        items={children}
        selectedChildId={selectedChildId}
        onSelect={setSelectedChildId}
      />

      {childAssignments.length === 0 ? (
        <EmptyState
          title="No assignments found"
          description="Assignments will appear here when assigned."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {childAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {assignment.courseCode}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        assignment.status === 'pending'
                          ? 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20'
                          : assignment.status === 'submitted'
                            ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
                            : assignment.status === 'graded'
                              ? 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
                              : 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20'
                      }`}
                    >
                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-white">
                    {assignment.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {assignment.courseName}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>Due: {assignment.dueDate}</span>
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
