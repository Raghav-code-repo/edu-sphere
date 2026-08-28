import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ChevronLeft, ChevronRight, Filter, Eye, Edit2, Trash2 } from 'lucide-react';
import { PageHeader, DataTable, Drawer, FilterPanel } from '@/features/admin';
import { adminApi } from '@/services/api/adminApi';
import type { AdminClass, FilterOptions } from '@/types/admin';

export function AdminClasses() {
  const [classes, setClasses] = useState<AdminClass[]>([]);
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
  const [selectedClass, setSelectedClass] = useState<AdminClass | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const response = await adminApi.getClasses(filters);
      setClasses(response.data);
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

  const handleView = async (cls: AdminClass) => {
    const fullClass = await adminApi.getClass(cls.id);
    if (fullClass) {
      setSelectedClass(fullClass);
      setDrawerOpen(true);
    }
    setActionMenu(null);
  };

  const handleEdit = (_cls: AdminClass) => {
    setActionMenu(null);
  };

  const handleDelete = async (cls: AdminClass) => {
    await adminApi.deleteClass(cls.id);
    const response = await adminApi.getClasses(filters);
    setClasses(response.data);
    setTotalPages(response.totalPages);
    setTotal(response.total);
    setActionMenu(null);
  };

  const getCapacityColor = (studentCount: number, capacity: number) => {
    const percentage = (studentCount / capacity) * 100;
    if (percentage >= 90) return 'text-red-600 dark:text-red-400';
    if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const columns = [
    {
      key: 'code',
      label: 'Code',
      render: (cls: AdminClass) => (
        <span className="font-medium text-gray-900 dark:text-white">{cls.code}</span>
      ),
      sortable: true,
    },
    {
      key: 'name',
      label: 'Name',
      render: (cls: AdminClass) => cls.name,
      sortable: true,
    },
    {
      key: 'department',
      label: 'Department',
      render: (cls: AdminClass) => cls.department,
    },
    {
      key: 'semester',
      label: 'Semester',
      render: (cls: AdminClass) => cls.semester,
    },
    {
      key: 'year',
      label: 'Year',
      render: (cls: AdminClass) => cls.year,
    },
    {
      key: 'section',
      label: 'Section',
      render: (cls: AdminClass) => cls.section || '-',
    },
    {
      key: 'faculty',
      label: 'Faculty',
      render: (cls: AdminClass) => cls.facultyName || '-',
    },
    {
      key: 'capacity',
      label: 'Students/Capacity',
      render: (cls: AdminClass) => (
        <span className={getCapacityColor(cls.studentCount, cls.capacity)}>
          {cls.studentCount} / {cls.capacity}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (cls: AdminClass) => (
        <div className="relative">
          <button
            onClick={() => setActionMenu(actionMenu === cls.id ? null : cls.id)}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          {actionMenu === cls.id && (
            <div className="absolute right-0 z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <button
                onClick={() => handleView(cls)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Eye className="h-4 w-4" /> View
              </button>
              <button
                onClick={() => handleEdit(cls)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Edit2 className="h-4 w-4" /> Edit
              </button>
              <button
                onClick={() => handleDelete(cls)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" /> Delete
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
        title="Classes"
        subtitle="Manage all classes"
        action={
          <Link
            to="/admin/classes/add"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Class
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
              placeholder="Search classes..."
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
        data={classes}
        columns={columns}
        getRowId={(cls) => cls.id}
        loading={loading}
        emptyMessage="No classes found"
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
        title="Class Details"
        width="max-w-2xl"
      >
        {selectedClass && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedClass.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{selectedClass.code}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Department
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedClass.department}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Semester
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedClass.semester}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Year
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{selectedClass.year}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Section
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedClass.section || '-'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Faculty
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedClass.facultyName || '-'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Room
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedClass.room || '-'}
                </p>
              </div>
            </div>
            {selectedClass.schedule && (
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Schedule
                </h4>
                <div className="flex items-center gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                      Day
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedClass.schedule.day}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">
                      Time
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedClass.schedule.time}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Capacity</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3 text-center">
                  <p className="text-2xl font-bold text-primary-600">
                    {selectedClass.studentCount}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Students</p>
                </div>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3 text-center">
                  <p className="text-2xl font-bold text-primary-600">{selectedClass.capacity}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Capacity</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
