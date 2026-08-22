import { Link } from 'react-router-dom';
import type { Assignment } from '@/types/student';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

interface AssignmentCardProps {
  assignment: Assignment;
}

const statusConfig = {
  pending: {
    color: 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20',
    icon: Clock,
    label: 'Pending',
  },
  submitted: {
    color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20',
    icon: FileText,
    label: 'Submitted',
  },
  graded: {
    color: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20',
    icon: CheckCircle,
    label: 'Graded',
  },
  overdue: {
    color: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20',
    icon: XCircle,
    label: 'Overdue',
  },
};

export function AssignmentCard({ assignment }: AssignmentCardProps) {
  const status = statusConfig[assignment.status];
  const StatusIcon = status.icon;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {assignment.courseCode}
            </span>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}
            >
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </span>
          </div>
          <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-white">
            {assignment.title}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{assignment.courseName}</p>
          <div className="mt-2 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              Due: {assignment.dueDate}
            </span>
            <span>Faculty: {assignment.faculty}</span>
          </div>
          {assignment.description && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {assignment.description}
            </p>
          )}
          {assignment.grade && (
            <div className="mt-2 inline-flex items-center rounded-lg bg-green-50 px-2 py-1 text-sm font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
              Grade: {assignment.grade}/{assignment.maxGrade}
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Link
          to={`/student/assignments/${assignment.id}`}
          className="inline-flex items-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          View Details
        </Link>
        {(assignment.status === 'pending' || assignment.status === 'overdue') && (
          <Link
            to={`/student/assignments/${assignment.id}/submit`}
            className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Submit
          </Link>
        )}
      </div>
    </div>
  );
}
