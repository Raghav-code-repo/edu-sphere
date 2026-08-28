import { useEffect, useState } from 'react';
import { PageHeader, DataTable, FilterPanel, StatusBadge } from '@/features/admin';
import { adminApi } from '@/services/api/adminApi';
import type { AdminAttendanceRecord, FilterOptions } from '@/types/admin';
import { Calendar, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';

export function AdminAttendance() {
  const [records, setRecords] = useState<AdminAttendanceRecord[]>([]);
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
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, excused: 0 });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [recordsResponse, statsData] = await Promise.all([
        adminApi.getAttendanceRecords(filters),
        adminApi.getAttendanceStats(),
      ]);
      setRecords(recordsResponse.data);
      setStats(statsData);
      setLoading(false);
    }
    loadData();
  }, [filters, selectedDate, selectedClass]);

  const columns = [
    { key: 'studentName', label: 'Student', sortable: true },
    { key: 'enrollmentNumber', label: 'Enrollment No.', sortable: true },
    { key: 'className', label: 'Class', sortable: true },
    { key: 'date', label: 'Date', sortable: true },
    {
      key: 'status',
      label: 'Status',
      render: (record: AdminAttendanceRecord) => <StatusBadge status={record.status} />,
    },
    { key: 'markedBy', label: 'Marked By' },
  ];

  const classOptions = [
    { value: 'c1', label: 'CS-A' },
    { value: 'c2', label: 'CS-B' },
    { value: 'c3', label: 'EC-A' },
    { value: 'c4', label: 'ME-A' },
    { value: 'c5', label: 'ME-A (2nd Year)' },
  ];

  const attendanceRate =
    records.length > 0 ? Math.round((stats.present / records.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Management"
        subtitle="Track and manage student attendance"
        action={
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">All Classes</option>
              {classOptions.map((cls) => (
                <option key={cls.value} value={cls.value}>
                  {cls.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              Filters
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/20">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.present}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Present</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/20">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.absent}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Absent</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2 dark:bg-yellow-900/20">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.late}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Late</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.excused}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Excused</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary-100 p-2 dark:bg-primary-900/20">
              <TrendingUp className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{attendanceRate}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Attendance Rate</p>
            </div>
          </div>
        </div>
      </div>

      {showFilters && (
        <FilterPanel
          open={showFilters}
          onClose={() => setShowFilters(false)}
          filters={filters}
          onFilterChange={setFilters}
          classes={classOptions}
        />
      )}

      <DataTable
        data={records}
        columns={columns}
        getRowId={(record) => record.id}
        loading={loading}
        emptyMessage="No attendance records found"
      />
    </div>
  );
}
