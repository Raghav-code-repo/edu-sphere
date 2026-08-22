import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { PageHeader, AssignmentCard, EmptyState } from '@/features/student';
import { studentMockService } from '@/services/mock/studentMockService';
import type { Assignment } from '@/types/student';

type AssignmentStatus = 'all' | 'pending' | 'submitted' | 'graded' | 'overdue';

export function StudentAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<AssignmentStatus>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentMockService.getAssignments().then((data) => {
      setAssignments(data);
      setLoading(false);
    });
  }, []);

  const filtered = assignments.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.courseName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'all' || a.status === status;
    return matchesSearch && matchesStatus;
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
      <PageHeader
        title="Assignments"
        subtitle={`You have ${assignments.filter((a) => a.status === 'pending' || a.status === 'overdue').length} pending assignments`}
      />

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search assignments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as AssignmentStatus)}
          className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="submitted">Submitted</option>
          <option value="graded">Graded</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No assignments found"
          description="Try adjusting your search or filter."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      )}
    </div>
  );
}
