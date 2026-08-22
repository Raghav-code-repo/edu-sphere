import { GraduationCap, BookOpen, Users, Award } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-between bg-gray-50 dark:bg-gray-800 p-12">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-10 w-10 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">EduSphere</span>
            </div>
          </div>

          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Education Management Reimagined
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Streamline your educational institution with our comprehensive management platform.
            </p>

            <div className="grid gap-6">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
                  <BookOpen className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Course Management</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Organize and manage courses with ease.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
                  <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Student Tracking</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Monitor student progress and attendance.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-900/30">
                  <Award className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Grading System</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Efficient grading and report generation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} EduSphere. All rights reserved.
          </div>
        </div>

        <div className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <div className="lg:hidden mb-8 text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <GraduationCap className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">EduSphere</span>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
                {subtitle && <p className="mt-2 text-gray-600 dark:text-gray-300">{subtitle}</p>}
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
