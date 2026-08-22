import { useEffect, useState } from 'react';
import { PageHeader, DataTable, Drawer, FilterPanel, StatusBadge } from '@/features/admin';
import { adminMockService } from '@/services/mock/adminMockService';
import type { AdminFee, FilterOptions } from '@/types/admin';
import { MoreVertical, Plus, ChevronLeft, ChevronRight, Filter, Eye, Edit2 } from 'lucide-react';

export function AdminFees() {
  const [fees, setFees] = useState<AdminFee[]>([]);
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
  const [selectedFee, setSelectedFee] = useState<AdminFee | null>(null);
  const [actionMenu, setActionMenu] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const response = await adminMockService.getFees(filters);
      setFees(response.data);
      setTotalPages(response.totalPages);
      setTotal(response.total);
      setLoading(false);
    }
    loadData();
  }, [filters]);

  const handleView = (fee: AdminFee) => {
    setSelectedFee(fee);
    setDrawerOpen(true);
    setActionMenu(null);
  };

  const handleStatusChange = async (id: string, status: string) => {
    await adminMockService.updateFeeStatus(id, status);
    const response = await adminMockService.getFees(filters);
    setFees(response.data);
    setActionMenu(null);
  };

  const columns = [
    { key: 'studentName', label: 'Student', sortable: true },
    { key: 'enrollmentNumber', label: 'Enrollment No.', sortable: true },
    { key: 'academicYear', label: 'Academic Year', sortable: true },
    { key: 'semester', label: 'Semester', sortable: true },
    { key: 'feeType', label: 'Fee Type', sortable: true },
    {
      key: 'totalAmount',
      label: 'Total Amount',
      render: (fee: AdminFee) => `₹${fee.totalAmount.toLocaleString()}`,
    },
    {
      key: 'paidAmount',
      label: 'Paid Amount',
      render: (fee: AdminFee) => `₹${fee.paidAmount.toLocaleString()}`,
    },
    {
      key: 'pendingAmount',
      label: 'Pending Amount',
      render: (fee: AdminFee) => `₹${fee.pendingAmount.toLocaleString()}`,
    },
    { key: 'dueDate', label: 'Due Date', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (fee: AdminFee) => <StatusBadge status={fee.status} />,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (fee: AdminFee) => (
        <div className="relative">
          <button
            onClick={() => setActionMenu(actionMenu === fee.id ? null : fee.id)}
            className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {actionMenu === fee.id && (
            <div className="absolute right-0 z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <button
                onClick={() => handleView(fee)}
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
              {fee.status === 'pending' && (
                <button
                  onClick={() => handleStatusChange(fee.id, 'paid')}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  Mark as Paid
                </button>
              )}
              {fee.status === 'overdue' && (
                <button
                  onClick={() => handleStatusChange(fee.id, 'pending')}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                >
                  Mark as Pending
                </button>
              )}
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
        title="Fees Management"
        subtitle="Track and manage student fee payments"
        action={
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors">
            <Plus className="h-4 w-4" />
            Record Payment
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
        data={fees}
        columns={columns}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        getRowId={(fee) => fee.id}
        loading={loading}
        emptyMessage="No fee records found"
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {startItem} to {endItem} of {total} records
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
        title="Fee Details"
        width="max-w-2xl"
      >
        {selectedFee && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {selectedFee.studentName}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {selectedFee.enrollmentNumber} - {selectedFee.academicYear}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Fee Type</p>
                <p className="text-sm text-gray-900 dark:text-white">{selectedFee.feeType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Semester</p>
                <p className="text-sm text-gray-900 dark:text-white">{selectedFee.semester}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Amount</p>
                <p className="text-sm text-gray-900 dark:text-white">
                  ₹{selectedFee.totalAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Paid Amount</p>
                <p className="text-sm text-green-600 dark:text-green-400">
                  ₹{selectedFee.paidAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending Amount
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  ₹{selectedFee.pendingAmount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Due Date</p>
                <p className="text-sm text-gray-900 dark:text-white">{selectedFee.dueDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</p>
                <StatusBadge status={selectedFee.status} />
              </div>
            </div>

            {selectedFee.payments.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Payment History
                </h4>
                <div className="space-y-2">
                  {selectedFee.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          ₹{payment.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {payment.method} - {payment.date}
                        </p>
                      </div>
                      <StatusBadge status={payment.status} />
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
