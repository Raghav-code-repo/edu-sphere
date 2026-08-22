import { Link } from 'react-router-dom';
import type { Course } from '@/types/student';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ backgroundColor: `${course.color}15`, color: course.color }}
            >
              {course.code}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{course.faculty}</span>
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
              <BookOpen className="h-3.5 w-3.5" />
              {course.completedLessons}/{course.totalLessons} lessons
            </span>
            {course.schedule && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {course.schedule.day}
              </span>
            )}
          </div>
          {course.nextLesson && (
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Next:{' '}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {course.nextLesson.title}
              </span>
              {course.nextLesson.scheduledAt && ` • ${course.nextLesson.scheduledAt}`}
            </p>
          )}
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400">Progress</span>
          <span className="font-medium text-gray-900 dark:text-white">{course.progress}%</span>
        </div>
        <div className="mt-1.5 h-2 rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-2 rounded-full transition-all"
            style={{ width: `${course.progress}%`, backgroundColor: course.color || '#0ea5e9' }}
          />
        </div>
      </div>
      <div className="mt-4">
        <Link
          to={`/student/courses/${course.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
