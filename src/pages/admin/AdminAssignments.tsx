import { useEffect, useState } from 'react';
import { PageHeader, DataTable, Drawer, FilterPanel, StatusBadge } from '@/features/admin';
import { adminMockService } from '@/services/mock/adminMockService';
import type { AdminAssignment, FilterOptions } from '@/types/admin';
import {
  MoreVertical,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  Edit2,
  Trash2,
} from 'lucide-react';

export function AdminAssignments() {
  const [assignments, setAssignments] = useState<AdminAssignment[]>([]);
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
  const [selectedAssignment, setSelectedAssignment] = useState<AdminAssignment | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const response = await adminMockService.getAssignments(filters);
      setAssignments(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
      setLoading(false);
    }
    loadData();
  }, [filters]);

  const handleView = (assignment: AdminAssignment) => {
    setSelectedAssignment(assignment);
    setDrawerOpen(true);
    setActionMenu(null);
  };

  const handleDelete = async (id: string) => {
    await adminMockService.deleteAssignment(id);
    const response = await adminMockService.getAssignments(filters);
    setAssignments(response.data);
    setTotalPages(response.totalPages);
    setTotal(response.total);
    setActionMenu(null);
  };

  const columns = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'courseCode', label: 'Course', sortable: true },
    { key: 'className', label: 'Class', sortable: true },
    { key: 'dueDate', label: 'Due Date', sortable: true },
    { key: 'totalMarks', label: 'Total Marks', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (assignment: AdminAssignment) => <StatusBadge status={assignment.status} />,
    },
    { key: 'submissionCount', label: 'Submissions', sortable: true },
    {
      key: 'actions',
      label: 'Actions',
      render: (assignment: AdminAssignment) => (
        <div className="relative">
          <button
            onClick={() => setActionMenu(actionMenu === assignment.id ? null : assignment.id)}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {actionMenu === assignment.id && (
            <div className="absolute right-0 z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <button
                onClick={() => handleView(assignment)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Eye className="h-4 w-4" /> View
              </button>
              <button
                onClick={() => setActionMenu(null)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <Edit2 className="h-4 w-4" /> Edit
              </button>
              <button
                onClick={() => handleDelete(assignment.id)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  const startItem = (page - 1) * filters.pageSize + 1;
  const endItem = Math.min(page * filters.pageSize, total);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assignments"
        subtitle="Manage course assignments and submissions"
        action={
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors">
            <Plus className="h-4 w-4" />
            Create Assignment
          </button>
        }
      />

      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
        {selectedRows.length > 0 && (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {selectedRows.length} selected
          </span>
        )}
      </div>

      {showFilters && (
        <FilterPanel
          open={showFilters}
          onClose={() => setShowFilters(false)}
          filters={filters}
          onFilterChange={setFilters}
        />
      )}

      <DataTable
        data={assignments}
        columns={columns}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        getRowId={(assignment) => assignment.id}
        loading={loading}
        emptyMessage="No assignments found"
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {startItem} to {endItem} of {total} assignments
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
              setFilters((prev) => ({ ...prev, page: Math.max(1, page - 1) }));
            }}
            disabled={page === 1}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => {
              setPage((p) => Math.min(totalPages, p + 1));
              setFilters((prev) => ({ ...prev, page: Math.min(totalPages, page + 1) }));
            }}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Assignment Details"
        width="max-w-2xl"
      >
        {selectedAssignment && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedAssignment.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedAssignment.courseName} - {selectedAssignment.className}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Due Date</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedAssignment.dueDate}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Marks</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedAssignment.totalMarks}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</p>
                <StatusBadge status={selectedAssignment.status} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Submissions</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedAssignment.submissionCount} / {selectedAssignment.totalStudents}
                </p>
              </div>
            </div>
            {selectedAssignment.description && (
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Description</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedAssignment.description}
                </p>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
