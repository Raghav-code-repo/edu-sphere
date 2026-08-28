import { useEffect, useState } from 'react';
import { Search, Users, Calendar, GraduationCap } from 'lucide-react';
import { PageHeader, EmptyState } from '@/features/faculty';
import { facultyApi } from '@/services/api/facultyApi';
import type { FacultyCourse } from '@/types/faculty';

export function FacultyCourses() {
  const [courses, setCourses] = useState<FacultyCourse[]>([]);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    facultyApi.getCourses().then((data) => {
      setCourses(data);
      setLoading(false);
    });
  }, []);

  const filtered = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.department.toLowerCase().includes(search.toLowerCase())
  );

  const selected = courses.find((c) => c.id === selectedId);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Courses" subtitle={`You are teaching ${courses.length} courses`} />

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No courses found" description="Try adjusting your search criteria." />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((course) => (
            <div
              key={course.id}
              onClick={() => setSelectedId(course.id)}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800 cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{ backgroundColor: `${course.color}15`, color: course.color }}
                    >
                      {course.code}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {course.department}
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-white">
                    {course.name}
                  </h3>
                  {course.description && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {course.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="h-3.5 w-3.5" />
                      {course.credits} Credits
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {course.semester}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {course.studentCount} students
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedId(null)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ backgroundColor: `${selected.color}15`, color: selected.color }}
                >
                  {selected.code}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {selected.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <p>
                <strong>Department:</strong> {selected.department}
              </p>
              <p>
                <strong>Semester:</strong> {selected.semester}
              </p>
              <p>
                <strong>Year:</strong> {selected.year}
              </p>
              <p>
                <strong>Credits:</strong> {selected.credits}
              </p>
              <p>
                <strong>Students:</strong> {selected.studentCount}
              </p>
              {selected.description && (
                <p>
                  <strong>Description:</strong> {selected.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
