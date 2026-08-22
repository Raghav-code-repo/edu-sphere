import type { FacultyFeedback } from '@/types/parent';
import { ThumbsUp, Minus, AlertCircle } from 'lucide-react';

interface FeedbackCardProps {
  feedback: FacultyFeedback;
}

const typeConfig = {
  positive: {
    color: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20',
    icon: ThumbsUp,
  },
  neutral: {
    color: 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20',
    icon: Minus,
  },
  concern: {
    color: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20',
    icon: AlertCircle,
  },
};

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const config = typeConfig[feedback.type];
  const Icon = config.icon;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 rounded-lg p-2 ${config.color}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              {feedback.courseName}
            </h4>
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.color}`}
            >
              {feedback.type}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {feedback.faculty} • {feedback.date}
          </p>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
            {feedback.feedback}
          </p>
        </div>
      </div>
    </div>
  );
}
