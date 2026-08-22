import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export function UnauthorizedPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <GraduationCap className="h-16 w-16 text-gray-400 mb-4" />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Unauthorized</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        You don't have permission to access this page.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}
