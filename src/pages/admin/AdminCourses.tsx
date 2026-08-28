import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { PageHeader, DataTable, Drawer, FilterPanel, StatusBadge } from '@/features/admin';
import { adminApi } from '@/services/api/adminApi';
import type { AdminCourse, FilterOptions } from '@/types/admin';

export function AdminCourses() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    role: '',
    status: '',
    department: '',
    classId: '',
    dateFrom: '',
    dateTo: '',
    page: 1,
    pageSize: 10,
    sortBy: '',
    sortOrder: 'asc',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<AdminCourse | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const response = await adminApi.getCourses(filters);
      setCourses(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
      setLoading(false);
    }
    loadData();
  }, [filters]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters({ ...newFilters, page: 1 });
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
    setPage(1);
  };

  const handleView = async (course: AdminCourse) => {
    const fullCourse = await adminApi.getCourse(course.id);
    if (fullCourse) {
      setSelectedCourse(fullCourse);
      setDrawerOpen(true);
    }
    setActionMenu(null);
  };

  const handleEdit = (_course: AdminCourse) => {
    setActionMenu(null);
  };

  const handleDelete = async (course: AdminCourse) => {
    await adminApi.deleteCourse(course.id);
    const response = await adminApi.getCourses(filters);
    setCourses(response.data);
    setTotalPages(response.totalPages);
    setTotal(response.total);
    setActionMenu(null);
  };

  const handlePublishToggle = async (course: AdminCourse) => {
    if (course.status === 'published') {
      await adminApi.unpublishCourse(course.id);
    } else {
      await adminApi.publishCourse(course.id);
    }
    const response = await adminApi.getCourses(filters);
    setCourses(response.data);
    setTotalPages(response.totalPages);
    setTotal(response.total);
    setActionMenu(null);
  };

  const columns = [
    {
      key: 'code',
      label: 'Code',
      render: (course: AdminCourse) => (
        <span className="font-medium text-gray-900 dark:text-white">{course.code}</span>
      ),
      sortable: true,
    },
    {
      key: 'name',
      label: 'Name',
      render: (course: AdminCourse) => course.name,
      sortable: true,
    },
    {
      key: 'department',
      label: 'Department',
      render: (course: AdminCourse) => course.department,
    },
    {
      key: 'credits',
      label: 'Credits',
      render: (course: AdminCourse) => course.credits,
    },
    {
      key: 'semester',
      label: 'Semester',
      render: (course: AdminCourse) => course.semester,
    },
    {
      key: 'faculty',
      label: 'Faculty',
      render: (course: AdminCourse) => course.facultyName || '-',
    },
    {
      key: 'status',
      label: 'Status',
      render: (course: AdminCourse) => <StatusBadge status={course.status} />,
    },
    {
      key: 'students',
      label: 'Students',
      render: (course: AdminCourse) => course.studentCount,
    },
    {
      key: 'modules',
      label: 'Modules/Lessons',
      render: (course: AdminCourse) => `${course.moduleCount} / ${course.lessonCount}`,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (course: AdminCourse) => (
        <div className="relative">
          <button
            onClick={() => setActionMenu(actionMenu === course.id ? null : course.id)}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          {actionMenu === course.id && (
            <div className="absolute right-0 z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <button
                onClick={() => handleView(course)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Eye className="h-4 w-4" /> View
              </button>
              <button
                onClick={() => handleEdit(course)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Edit2 className="h-4 w-4" /> Edit
              </button>
              <button
                onClick={() => handleDelete(course)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
              <button
                onClick={() => handlePublishToggle(course)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                {course.status === 'published' ? (
                  <>
                    <XCircle className="h-4 w-4" /> Unpublish
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" /> Publish
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      ),
      width: '80px',
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        subtitle="Manage all courses"
        action={
          <Link
            to="/admin/courses/add"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Course
          </Link>
        }
      />

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search courses..."
              className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors ${showFilters ? 'bg-primary-50 border-primary-300 text-primary-700 dark:bg-primary-900/20 dark:border-primary-700 dark:text-primary-300' : 'text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'}`}
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>
        {showFilters && (
          <div className="mt-4">
            <FilterPanel
              open={showFilters}
              onClose={() => setShowFilters(false)}
              filters={filters}
              onFilterChange={handleFilterChange}
              departments={['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Business']}
            />
          </div>
        )}
      </div>

      <DataTable
        data={courses}
        columns={columns}
        getRowId={(course) => course.id}
        loading={loading}
        emptyMessage="No courses found"
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {(page - 1) * filters.pageSize + 1} to {Math.min(page * filters.pageSize, total)}{' '}
          of {total} results
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
              setFilters((prev) => ({ ...prev, page: Math.max(1, page - 1) }));
            }}
            disabled={page === 1}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => {
                setPage(p);
                setFilters((prev) => ({ ...prev, page: p }));
              }}
              className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${page === p ? 'bg-primary-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => {
              setPage((p) => Math.min(totalPages, p + 1));
              setFilters((prev) => ({ ...prev, page: Math.min(totalPages, page + 1) }));
            }}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Course Details"
        width="max-w-2xl"
      >
        {selectedCourse && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedCourse.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedCourse.code}</p>
              </div>
              <StatusBadge status={selectedCourse.status} />
            </div>
            {selectedCourse.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedCourse.description}
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Department
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedCourse.department}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Credits
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedCourse.credits}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Semester
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedCourse.semester}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Year
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedCourse.year}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Faculty
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedCourse.facultyName || '-'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Students Enrolled
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedCourse.studentCount}
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Course Structure
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3 text-center">
                  <p className="text-2xl font-bold text-primary-600">
                    {selectedCourse.moduleCount}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Modules</p>
                </div>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3 text-center">
                  <p className="text-2xl font-bold text-primary-600">
                    {selectedCourse.lessonCount}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Lessons</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
