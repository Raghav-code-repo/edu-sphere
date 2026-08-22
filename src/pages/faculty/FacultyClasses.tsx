import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Clock } from 'lucide-react';
import { PageHeader, EmptyState } from '@/features/faculty';
import { facultyMockService } from '@/services/mock/facultyMockService';
import type { FacultyClass } from '@/types/faculty';

export function FacultyClasses() {
  const [classes, setClasses] = useState<FacultyClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    facultyMockService.getClasses().then((data) => {
      setClasses(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Classes" subtitle={`You are teaching ${classes.length} classes`} />

      {classes.length === 0 ? (
        <EmptyState
          title="No classes found"
          description="There are no classes assigned to you yet."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {classes.map((cls) => (
            <Link
              key={cls.id}
              to={`/faculty/courses/${cls.courseId}`}
              className="block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg"
                  style={{
                    backgroundColor: `${cls.color || '#0ea5e9'}15`,
                    color: cls.color || '#0ea5e9',
                  }}
                >
                  <BookOpen className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                  {cls.semester}
                </span>
              </div>

              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                {cls.courseName}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{cls.courseCode}</p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{cls.description}</p>

              <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    {cls.schedule.day} • {cls.schedule.time}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>{cls.studentCount} students</span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Faculty: {cls.faculty}
                </span>
                <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                  View Details →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
