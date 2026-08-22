import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit2,
  Trash2,
  Users,
  GraduationCap,
  BookOpen,
} from 'lucide-react';
import { PageHeader, DataTable, Drawer } from '@/features/admin';
import { adminMockService } from '@/services/mock/adminMockService';
import type { AdminDepartment } from '@/types/admin';

export function AdminDepartments() {
  const [departments, setDepartments] = useState<AdminDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<AdminDepartment | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await adminMockService.getDepartments();
      setDepartments(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleView = async (department: AdminDepartment) => {
    const fullDepartment = await adminMockService.getDepartment(department.id);
    if (fullDepartment) {
      setSelectedDepartment(fullDepartment);
      setDrawerOpen(true);
    }
    setActionMenu(null);
  };

  const handleEdit = (_department: AdminDepartment) => {
    setActionMenu(null);
  };

  const handleDelete = async (department: AdminDepartment) => {
    await adminMockService.deleteDepartment(department.id);
    const data = await adminMockService.getDepartments();
    setDepartments(data);
    setActionMenu(null);
  };

  const total = departments.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const paginatedData = departments.slice((page - 1) * pageSize, page * pageSize);

  const columns = [
    {
      key: 'code',
      label: 'Code',
      render: (department: AdminDepartment) => (
        <span className="font-medium text-gray-900 dark:text-white">{department.code}</span>
      ),
      sortable: true,
    },
    {
      key: 'name',
      label: 'Name',
      render: (department: AdminDepartment) => department.name,
      sortable: true,
    },
    {
      key: 'headOfDepartment',
      label: 'Head of Department',
      render: (department: AdminDepartment) => department.headOfDepartment || '-',
    },
    {
      key: 'facultyCount',
      label: 'Faculty Count',
      render: (department: AdminDepartment) => department.facultyCount,
    },
    {
      key: 'studentCount',
      label: 'Student Count',
      render: (department: AdminDepartment) => department.studentCount,
    },
    {
      key: 'courseCount',
      label: 'Course Count',
      render: (department: AdminDepartment) => department.courseCount,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (department: AdminDepartment) => (
        <div className="relative">
          <button
            onClick={() => setActionMenu(actionMenu === department.id ? null : department.id)}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          {actionMenu === department.id && (
            <div className="absolute right-0 z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <button
                onClick={() => handleView(department)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Eye className="h-4 w-4" /> View
              </button>
              <button
                onClick={() => handleEdit(department)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Edit2 className="h-4 w-4" /> Edit
              </button>
              <button
                onClick={() => handleDelete(department)}
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
        title="Departments"
        subtitle="Manage all departments"
        action={
          <Link
            to="/admin/departments/add"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Department
          </Link>
        }
      />

      <DataTable
        data={paginatedData}
        columns={columns}
        getRowId={(department) => department.id}
        loading={loading}
        emptyMessage="No departments found"
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total}{' '}
          results
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${page === p ? 'bg-primary-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
        title="Department Details"
        width="max-w-2xl"
      >
        {selectedDepartment && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedDepartment.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{selectedDepartment.code}</p>
            </div>
            {selectedDepartment.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedDepartment.description}
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Head of Department
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedDepartment.headOfDepartment || '-'}
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                Department Statistics
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedDepartment.facultyCount}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Faculty</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
                    <GraduationCap className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedDepartment.studentCount}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Students</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
                    <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedDepartment.courseCount}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Courses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
