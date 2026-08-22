import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { PageHeader, ExamCard, EmptyState } from '@/features/student';
import { studentMockService } from '@/services/mock/studentMockService';
import type { Exam } from '@/types/student';

type ExamStatus = 'all' | 'upcoming' | 'completed' | 'missed';

export function StudentExams() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ExamStatus>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentMockService.getExams().then((data) => {
      setExams(data);
      setLoading(false);
    });
  }, []);

  const filtered = exams.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.courseName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'all' || e.status === status;
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
        title="Exams"
        subtitle={`${exams.filter((e) => e.status === 'upcoming').length} upcoming exams`}
      />

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search exams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ExamStatus)}
          className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="all">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="missed">Missed</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No exams found" description="Try adjusting your search or filter." />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      )}
    </div>
  );
}
