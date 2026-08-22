import { Link } from 'react-router-dom';
import { Video, FileText, BarChart3, Calendar } from 'lucide-react';

const actions = [
  {
    title: 'Join Class',
    icon: Video,
    href: '/student/courses',
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  },
  {
    title: 'Submit Assignment',
    icon: FileText,
    href: '/student/assignments',
    color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  },
  {
    title: 'View Grades',
    icon: BarChart3,
    href: '/student/grades',
    color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  },
  {
    title: 'View Schedule',
    icon: Calendar,
    href: '/student/calendar',
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
  },
];

export function QuickActions() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.href}
            className={`flex flex-col items-center justify-center gap-2 rounded-lg p-4 transition-colors hover:opacity-80 ${action.color}`}
          >
            <action.icon className="h-6 w-6" />
            <span className="text-xs font-medium">{action.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
