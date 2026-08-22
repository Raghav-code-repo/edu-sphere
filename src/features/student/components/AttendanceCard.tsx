import type { AttendanceRecord } from '@/types/student';
import { CheckCircle, XCircle, Clock, HelpCircle } from 'lucide-react';

interface AttendanceCardProps {
  record: AttendanceRecord;
}

const statusConfig = {
  present: {
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
    icon: CheckCircle,
  },
  absent: {
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
    icon: XCircle,
  },
  late: {
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    icon: Clock,
  },
  excused: {
    color: 'text-gray-600 dark:text-gray-400',
    bg: 'bg-gray-50 dark:bg-gray-900/20',
    icon: HelpCircle,
  },
};

export function AttendanceCard({ record }: AttendanceCardProps) {
  const config = statusConfig[record.status];
  const StatusIcon = config.icon;

  return (
    <div className={`rounded-lg px-3 py-2 ${config.bg}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{record.courseName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {record.courseCode} • {record.date}
          </p>
        </div>
        <span className={`flex items-center gap-1 text-xs font-medium ${config.color}`}>
          <StatusIcon className="h-3.5 w-3.5" />
          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
        </span>
      </div>
    </div>
  );
}
