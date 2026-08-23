import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, ClipboardList, CalendarCheck, UserCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Home() {
  return (
    <div className="min-h-screen">
      <nav className="border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                PRIMUS Olympiad
                <br />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Shape your future..
                </span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              Welcome to Optimus -{' '}
              <span className="text-primary-600">Unlocking Olympiad Excellence</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Interactive Live Discussions, AI-Powered Practice Tests, and Expert Guidance to Help
              Students from Classes 3 to 8 Achieve Their Dreams.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-lg px-8 py-3 text-lg font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-lg px-8 py-2 text-lg font-medium bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20 dark:bg-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <a
                href="#"
                className="block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-primary-300 dark:border-gray-700 dark:bg-gray-800 text-center"
              >
                <BookOpen className="mx-auto h-12 w-12 text-primary-600" />
                {/* <p className="mt-2 text-gray-600 dark:text-gray-300">Explore Our Courses</p> */}
                <br />
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Explore Our Courses
                </h3>
              </a>
              <a
                href="#"
                className="block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-primary-300 dark:border-gray-700 dark:bg-gray-800 text-center"
              >
                <ClipboardList className="mx-auto h-12 w-12 text-primary-600" />
                {/* <p className="mt-2 text-gray-600 dark:text-gray-300">Explore Our Courses</p> */}
                <br />
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Our Methodology
                </h3>
              </a>
              <a
                href="#"
                className="block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-primary-300 dark:border-gray-700 dark:bg-gray-800 text-center"
              >
                <CalendarCheck className="mx-auto h-12 w-12 text-primary-600" />
                {/* <p className="mt-2 text-gray-600 dark:text-gray-300">Explore Our Courses</p> */}
                <br />
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Book Your Free Demo Sesstion
                </h3>
              </a>
              <a
                href="#"
                className="block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-primary-300 dark:border-gray-700 dark:bg-gray-800 text-center"
              >
                <UserCheck className="mx-auto h-12 w-12 text-primary-600" />
                {/* <p className="mt-2 text-gray-600 dark:text-gray-300">Explore Our Courses</p> */}
                <br />
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  Explore Our Faculty
                </h3>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 py-8 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 text-center text-gray-600 dark:text-gray-300">
          © {new Date().getFullYear()} PRIMUS. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
