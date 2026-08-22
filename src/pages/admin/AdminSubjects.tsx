import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ChevronLeft, ChevronRight, Filter, Eye, Edit2, Trash2 } from 'lucide-react';
import { PageHeader, DataTable, Drawer, FilterPanel } from '@/features/admin';
import { adminMockService } from '@/services/mock/adminMockService';
import type { AdminSubject, FilterOptions } from '@/types/admin';

export function AdminSubjects() {
  const [subjects, setSubjects] = useState<AdminSubject[]>([]);
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
  const [selectedSubject, setSelectedSubject] = useState<AdminSubject | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const response = await adminMockService.getSubjects(filters);
      setSubjects(response.data);
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

  const handleView = async (subject: AdminSubject) => {
    const fullSubject = await adminMockService.getSubject(subject.id);
    if (fullSubject) {
      setSelectedSubject(fullSubject);
      setDrawerOpen(true);
    }
    setActionMenu(null);
  };

  const handleEdit = (_subject: AdminSubject) => {
    setActionMenu(null);
  };

  const handleDelete = async (subject: AdminSubject) => {
    await adminMockService.deleteSubject(subject.id);
    const response = await adminMockService.getSubjects(filters);
    setSubjects(response.data);
    setTotalPages(response.totalPages);
    setTotal(response.total);
    setActionMenu(null);
  };

  const columns = [
    {
      key: 'code',
      label: 'Code',
      render: (subject: AdminSubject) => (
        <span className="font-medium text-gray-900 dark:text-white">{subject.code}</span>
      ),
      sortable: true,
    },
    {
      key: 'name',
      label: 'Name',
      render: (subject: AdminSubject) => subject.name,
      sortable: true,
    },
    {
      key: 'department',
      label: 'Department',
      render: (subject: AdminSubject) => subject.department,
    },
    {
      key: 'credits',
      label: 'Credits',
      render: (subject: AdminSubject) => subject.credits,
    },
    {
      key: 'prerequisites',
      label: 'Prerequisites',
      render: (subject: AdminSubject) => (
        <div className="flex flex-wrap gap-1">
          {subject.prerequisites && subject.prerequisites.length > 0 ? (
            subject.prerequisites.map((prereq) => (
              <span
                key={prereq}
                className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
              >
                {prereq}
              </span>
            ))
          ) : (
            <span className="text-gray-400 dark:text-gray-500">None</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (subject: AdminSubject) => (
        <div className="relative">
          <button
            onClick={() => setActionMenu(actionMenu === subject.id ? null : subject.id)}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          {actionMenu === subject.id && (
            <div className="absolute right-0 z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <button
                onClick={() => handleView(subject)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Eye className="h-4 w-4" /> View
              </button>
              <button
                onClick={() => handleEdit(subject)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Edit2 className="h-4 w-4" /> Edit
              </button>
              <button
                onClick={() => handleDelete(subject)}
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
        title="Subjects"
        subtitle="Manage all subjects"
        action={
          <Link
            to="/admin/subjects/add"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Subject
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
              placeholder="Search subjects..."
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
        data={subjects}
        columns={columns}
        getRowId={(subject) => subject.id}
        loading={loading}
        emptyMessage="No subjects found"
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
        title="Subject Details"
        width="max-w-2xl"
      >
        {selectedSubject && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedSubject.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{selectedSubject.code}</p>
            </div>
            {selectedSubject.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedSubject.description}
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Department
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedSubject.department}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Credits
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedSubject.credits}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Prerequisites
              </label>
              {selectedSubject.prerequisites && selectedSubject.prerequisites.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedSubject.prerequisites.map((prereq) => (
                    <span
                      key={prereq}
                      className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                    >
                      {prereq}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500">No prerequisites</p>
              )}
            </div>
            {selectedSubject.courseIds && selectedSubject.courseIds.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Linked Courses
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedSubject.courseIds.length} course(s)
                </p>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
