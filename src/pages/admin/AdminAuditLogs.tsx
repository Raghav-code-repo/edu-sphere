import { useEffect, useState } from 'react';
import { PageHeader, DataTable, FilterPanel } from '@/features/admin';
import { adminApi } from '@/services/api/adminApi';
import type { AdminAuditLog, FilterOptions } from '@/types/admin';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export function AdminAuditLogs() {
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
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
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const response = await adminApi.getAuditLogs(filters);
      setAuditLogs(response.data);
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

  const columns = [
    {
      key: 'timestamp',
      label: 'Timestamp',
      render: (log: AdminAuditLog) => (
        <span className="text-sm text-gray-900 dark:text-white">{log.timestamp}</span>
      ),
      sortable: true,
    },
    {
      key: 'userName',
      label: 'User',
      render: (log: AdminAuditLog) => (
        <span className="font-medium text-gray-900 dark:text-white">{log.userName}</span>
      ),
    },
    {
      key: 'userRole',
      label: 'Role',
      render: (log: AdminAuditLog) => (
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
          {log.userRole}
        </span>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      render: (log: AdminAuditLog) => (
        <span className="text-sm text-gray-900 dark:text-white">{log.action}</span>
      ),
    },
    {
      key: 'module',
      label: 'Module',
      render: (log: AdminAuditLog) => (
        <span className="text-sm text-gray-900 dark:text-white">{log.module}</span>
      ),
    },
    {
      key: 'entityType',
      label: 'Entity Type',
      render: (log: AdminAuditLog) => (
        <span className="text-sm text-gray-900 dark:text-white">{log.entityType}</span>
      ),
    },
    {
      key: 'entityName',
      label: 'Entity Name',
      render: (log: AdminAuditLog) => (
        <span className="text-sm text-gray-900 dark:text-white">{log.entityName}</span>
      ),
    },
    {
      key: 'ipAddress',
      label: 'IP Address',
      render: (log: AdminAuditLog) => (
        <span className="text-sm text-gray-900 dark:text-white">{log.ipAddress || '-'}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Logs" subtitle="Track all system activities" />

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search audit logs..."
              className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors ${showFilters ? 'bg-primary-50 border-primary-300 text-primary-700 dark:bg-primary-900/20 dark:border-primary-700 dark:text-primary-300' : 'text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700'}`}
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>
        {showFilters && (
          <div className="mt-4">
            <FilterPanel
              open={showFilters}
              onClose={() => setShowFilters(false)}
              filters={filters}
              onFilterChange={handleFilterChange}
              roles={[
                { value: 'STUDENT', label: 'Student' },
                { value: 'PARENT', label: 'Parent' },
                { value: 'FACULTY', label: 'Faculty' },
                { value: 'ADMIN', label: 'Admin' },
                { value: 'SUPER_ADMIN', label: 'Super Admin' },
              ]}
            />
          </div>
        )}
      </div>

      <DataTable
        data={auditLogs}
        columns={columns}
        getRowId={(log) => log.id}
        loading={loading}
        emptyMessage="No audit logs found"
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
    </div>
  );
}
