import { useEffect, useState } from 'react';
import { PageHeader, DataTable, Drawer, FilterPanel, StatusBadge } from '@/features/admin';
import { adminMockService } from '@/services/mock/adminMockService';
import type { AdminExam, AdminExamResult, FilterOptions } from '@/types/admin';
import {
  MoreVertical,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  Edit2,
  Trash2,
  FileCheck,
} from 'lucide-react';

export function AdminExams() {
  const [exams, setExams] = useState<AdminExam[]>([]);
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
  const [selectedExam, setSelectedExam] = useState<AdminExam | null>(null);
  const [examResults, setExamResults] = useState<AdminExamResult[]>([]);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const response = await adminMockService.getExams(filters);
      setExams(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
      setLoading(false);
    }
    loadData();
  }, [filters]);

  const handleView = async (exam: AdminExam) => {
    setSelectedExam(exam);
    const results = await adminMockService.getExamResults(exam.id);
    setExamResults(results);
    setDrawerOpen(true);
    setActionMenu(null);
  };

  const handleDelete = async (id: string) => {
    await adminMockService.deleteExam(id);
    const response = await adminMockService.getExams(filters);
    setExams(response.data);
    setTotalPages(response.totalPages);
    setTotal(response.total);
    setActionMenu(null);
  };

  const columns = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'courseCode', label: 'Course', sortable: true },
    { key: 'className', label: 'Class', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    { key: 'startTime', label: 'Time', sortable: true },
    { key: 'duration', label: 'Duration (min)', sortable: true },
    { key: 'totalMarks', label: 'Total Marks', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (exam: AdminExam) => <StatusBadge status={exam.status} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (exam: AdminExam) => (
        <div className="relative">
          <button
            onClick={() => setActionMenu(actionMenu === exam.id ? null : exam.id)}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {actionMenu === exam.id && (
            <div className="absolute right-0 z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <button
                onClick={() => handleView(exam)}
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
                onClick={() => handleView(exam)}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                <FileCheck className="h-4 w-4" /> Results
              </button>
              <button
                onClick={() => handleDelete(exam.id)}
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
        title="Examinations"
        subtitle="Manage exams, schedules, and results"
        action={
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors">
            <Plus className="h-4 w-4" />
            Create Exam
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
        data={exams}
        columns={columns}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        getRowId={(exam) => exam.id}
        loading={loading}
        emptyMessage="No exams found"
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {startItem} to {endItem} of {total} exams
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
        title="Exam Details"
        width="max-w-2xl"
      >
        {selectedExam && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedExam.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedExam.courseName} - {selectedExam.className}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Date</p>
                <p className="text-sm text-gray-900 dark:text-white">{selectedExam.date}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Time</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedExam.startTime} - {selectedExam.endTime}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Duration</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {selectedExam.duration} minutes
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Location</p>
                <p className="text-sm text-gray-900 dark:text-white">{selectedExam.location}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Marks</p>
                <p className="text-sm text-gray-900 dark:text-white">{selectedExam.totalMarks}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Passing Marks
                </p>
                <p className="text-sm text-gray-900 dark:text-white">{selectedExam.passingMarks}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</p>
                <StatusBadge status={selectedExam.status} />
              </div>
            </div>

            {examResults.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Results</h4>
                <div className="space-y-2">
                  {examResults.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {result.studentName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {result.enrollmentNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {result.obtainedMarks} / {result.totalMarks}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Grade: {result.grade}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
