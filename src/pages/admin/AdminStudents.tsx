import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MoreVertical,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Activity,
} from 'lucide-react';
import { PageHeader, DataTable, Drawer, FilterPanel, StatusBadge } from '@/features/admin';
import { adminMockService } from '@/services/mock/adminMockService';
import type { AdminStudent, FilterOptions } from '@/types/admin';

export function AdminStudents() {
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
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
  const [selectedStudent, setSelectedStudent] = useState<AdminStudent | null>(null);
  const [bulkAction, setBulkAction] = useState('');
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const response = await adminMockService.getStudents(filters);
      setStudents(response.data);
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

  const handleBulkAction = async () => {
    if (!bulkAction || selectedRows.length === 0) return;
    for (const id of selectedRows) {
      if (bulkAction === 'delete') {
        await adminMockService.deleteUser(id);
      }
    }
    setSelectedRows([]);
    setBulkAction('');
    const response = await adminMockService.getStudents(filters);
    setStudents(response.data);
    setTotalPages(response.totalPages);
    setTotal(response.total);
  };

  const handleView = async (student: AdminStudent) => {
    const fullStudent = await adminMockService.getStudent(student.id);
    if (fullStudent) {
      setSelectedStudent(fullStudent);
      setDrawerOpen(true);
    }
    setActionMenu(null);
  };

  const handleEdit = (_student: AdminStudent) => {
    setActionMenu(null);
  };

  const handleDelete = async (student: AdminStudent) => {
    await adminMockService.deleteUser(student.id);
    const response = await adminMockService.getStudents(filters);
    setStudents(response.data);
    setTotalPages(response.totalPages);
    setTotal(response.total);
    setActionMenu(null);
  };

  const handleActivity = (_student: AdminStudent) => {
    setActionMenu(null);
  };

  const getAvatarInitials = (student: AdminStudent) => {
    return `${student.firstName[0]}${student.lastName[0]}`.toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
      'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const columns = [
    {
      key: 'select',
      label: '',
      render: (student: AdminStudent) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(student.id)}
          onChange={() => {
            if (selectedRows.includes(student.id)) {
              setSelectedRows(selectedRows.filter((id) => id !== student.id));
            } else {
              setSelectedRows([...selectedRows, student.id]);
            }
          }}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
      ),
      width: '40px',
    },
    {
      key: 'avatar',
      label: '',
      render: (student: AdminStudent) => (
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${getAvatarColor(student.firstName)}`}
        >
          {getAvatarInitials(student)}
        </div>
      ),
      width: '48px',
    },
    {
      key: 'name',
      label: 'Name',
      render: (student: AdminStudent) => (
        <span className="font-medium text-gray-900 dark:text-white">
          {student.firstName} {student.lastName}
        </span>
      ),
      sortable: true,
    },
    {
      key: 'enrollmentNumber',
      label: 'Enrollment No.',
      render: (student: AdminStudent) => student.enrollmentNumber,
    },
    {
      key: 'email',
      label: 'Email',
      render: (student: AdminStudent) => student.email,
      sortable: true,
    },
    {
      key: 'class',
      label: 'Class',
      render: (student: AdminStudent) => student.className || '-',
    },
    {
      key: 'year',
      label: 'Year/Semester',
      render: (student: AdminStudent) => `${student.year} / ${student.semester}`,
    },
    {
      key: 'attendance',
      label: 'Attendance %',
      render: (student: AdminStudent) => (
        <span
          className={`font-medium ${(student.attendancePercentage || 0) >= 75 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
        >
          {student.attendancePercentage || 0}%
        </span>
      ),
    },
    {
      key: 'gpa',
      label: 'GPA',
      render: (student: AdminStudent) => student.gpa?.toFixed(1) || '-',
    },
    {
      key: 'status',
      label: 'Status',
      render: (student: AdminStudent) => <StatusBadge status={student.status} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (student: AdminStudent) => (
        <div className="relative">
          <button
            onClick={() => setActionMenu(actionMenu === student.id ? null : student.id)}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {actionMenu === student.id && (
            <div className="absolute right-0 z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <button
                onClick={() => handleView(student)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Eye className="h-4 w-4" /> View
              </button>
              <button
                onClick={() => handleEdit(student)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Edit2 className="h-4 w-4" /> Edit
              </button>
              <button
                onClick={() => handleDelete(student)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
              <button
                onClick={() => handleActivity(student)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Activity className="h-4 w-4" /> Activity
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
        title="Student Management"
        subtitle="Manage all students"
        action={
          <Link
            to="/admin/students/add"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Student
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
              placeholder="Search students..."
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
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              disabled={selectedRows.length === 0}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Bulk Actions</option>
              <option value="delete">Delete</option>
            </select>
            <button
              onClick={handleBulkAction}
              disabled={!bulkAction || selectedRows.length === 0}
              className="inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Apply
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
              classes={[
                { value: 'c1', label: 'CS-A' },
                { value: 'c2', label: 'CS-B' },
                { value: 'c3', label: 'EC-A' },
                { value: 'c4', label: 'ME-A' },
              ]}
            />
          </div>
        )}
      </div>

      <DataTable
        data={students}
        columns={columns}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        getRowId={(student) => student.id}
        loading={loading}
        emptyMessage="No students found"
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
        title="Student Details"
        width="max-w-2xl"
      >
        {selectedStudent && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full text-xl font-medium ${getAvatarColor(selectedStudent.firstName)}`}
              >
                {getAvatarInitials(selectedStudent)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedStudent.firstName} {selectedStudent.lastName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedStudent.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enrollment Number
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedStudent.enrollmentNumber}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Class
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedStudent.className || '-'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Year / Semester
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedStudent.year} / {selectedStudent.semester}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  GPA
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedStudent.gpa?.toFixed(1) || '-'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Attendance
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedStudent.attendancePercentage || 0}%
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <div className="mt-1">
                  <StatusBadge status={selectedStudent.status} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Guardian Name
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedStudent.guardianName || '-'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Guardian Phone
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedStudent.guardianPhone || '-'}
                </p>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
