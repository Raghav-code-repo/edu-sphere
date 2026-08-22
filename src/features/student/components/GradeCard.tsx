import type { GradeRecord } from '@/types/student';

interface GradeCardProps {
  grade: GradeRecord;
}

export function GradeCard({ grade }: GradeCardProps) {
  const percentage = Math.round((grade.obtainedMarks / grade.totalMarks) * 100);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {grade.courseCode}
          </span>
          <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{grade.title}</p>
          <p className="text-xs text-gray-600 dark:text-gray-300">{grade.courseName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Faculty: {grade.faculty}</p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {grade.obtainedMarks}/{grade.totalMarks}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{percentage}%</div>
          <span className="mt-1 inline-flex items-center rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/20 dark:text-primary-400">
            {grade.grade}
          </span>
        </div>
      </div>
      <div className="mt-3 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
        <div className="h-2 rounded-full bg-primary-500" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
