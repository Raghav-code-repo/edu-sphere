import { Link } from 'react-router-dom';
import type { Exam } from '@/types/student';
import { Calendar, Clock, MapPin, FileText, CheckCircle, XCircle } from 'lucide-react';

interface ExamCardProps {
  exam: Exam;
}

const statusConfig = {
  upcoming: {
    color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20',
    icon: Calendar,
    label: 'Upcoming',
  },
  completed: {
    color: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20',
    icon: CheckCircle,
    label: 'Completed',
  },
  missed: {
    color: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20',
    icon: XCircle,
    label: 'Missed',
  },
};

export function ExamCard({ exam }: ExamCardProps) {
  const status = statusConfig[exam.status];
  const StatusIcon = status.icon;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {exam.courseCode}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}
            >
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </span>
          </div>
          <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-white">
            {exam.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{exam.courseName}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {exam.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {exam.startTime} - {exam.endTime}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {exam.location}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              Total: {exam.totalMarks}
            </span>
          </div>
          {exam.status === 'completed' && exam.obtainedMarks !== undefined && (
            <div className="mt-2 inline-flex items-center rounded-lg bg-green-50 px-2 py-1 text-sm font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
              Score: {exam.obtainedMarks}/{exam.totalMarks} ({exam.result})
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        <Link
          to={`/student/exams/${exam.id}`}
          className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
