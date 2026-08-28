import { useEffect, useState, useMemo } from 'react';
import { PageHeader, KpiCard, ChartCard } from '@/features/faculty';
import { facultyApi } from '@/services/api/facultyApi';
import type { GradeBookStudent } from '@/types/faculty';
import {
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit2,
  X,
  Eye,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type SortKey = 'name' | 'percentage' | 'grade';
type SortDir = 'asc' | 'desc';

const gradeDistribution = [
  { grade: 'A+', count: 3 },
  { grade: 'A', count: 5 },
  { grade: 'B+', count: 4 },
  { grade: 'B', count: 2 },
  { grade: 'C', count: 1 },
  { grade: 'D', count: 0 },
  { grade: 'F', count: 0 },
];

const safeScore = (score: number | null): number => score ?? 0;

export function FacultyGradebook() {
  const [students, setStudents] = useState<GradeBookStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<GradeBookStudent | null>(null);
  const [editingCell, setEditingCell] = useState<{ studentId: string; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const perPage = 10;

  useEffect(() => {
    facultyApi.getGradebook().then((data) => {
      setStudents(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    const result = students.filter(
      (s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.enrollmentNumber.toLowerCase().includes(search.toLowerCase())
    );
    result.sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      if (sortKey === 'name') {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      } else if (sortKey === 'percentage') {
        aVal = a.percentage;
        bVal = b.percentage;
      } else if (sortKey === 'grade') {
        aVal = a.grade;
        bVal = b.grade;
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [students, search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const avgGrade =
    students.length > 0
      ? Math.round(students.reduce((sum, s) => sum + s.percentage, 0) / students.length)
      : 0;
  const highestGrade = students.length > 0 ? Math.max(...students.map((s) => s.percentage)) : 0;
  const lowestGrade = students.length > 0 ? Math.min(...students.map((s) => s.percentage)) : 0;
  const passRate =
    students.length > 0
      ? Math.round((students.filter((s) => s.percentage >= 40).length / students.length) * 100)
      : 0;

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const startEdit = (studentId: string, field: string, currentValue: number | null) => {
    setEditingCell({ studentId, field });
    setEditValue(String(currentValue ?? 0));
  };

  const saveEdit = async () => {
    if (!editingCell) return;
    const { studentId, field } = editingCell;
    const numValue = parseFloat(editValue);
    if (isNaN(numValue)) return;

    await facultyApi.updateGradebook(studentId, {
      [field]: numValue,
    });

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const updated = { ...s };
        if (field === 'quiz') updated.quiz = { ...updated.quiz, score: numValue };
        else if (field === 'midterm') updated.midterm = { ...updated.midterm, score: numValue };
        else if (field === 'final') updated.final = { ...updated.final, score: numValue };
        else if (field.startsWith('assignment')) {
          const idx = parseInt(field.replace('assignment', ''), 10);
          if (updated.assignments[idx]) {
            updated.assignments[idx] = { ...updated.assignments[idx], score: numValue };
          }
        }
        const totalScore =
          (safeScore(updated.assignments[0].score) / updated.assignments[0].max) *
            updated.assignments[0].weight *
            100 +
          (safeScore(updated.assignments[1].score) / updated.assignments[1].max) *
            updated.assignments[1].weight *
            100 +
          (safeScore(updated.quiz.score) / updated.quiz.max) * updated.quiz.weight * 100 +
          (safeScore(updated.midterm.score) / updated.midterm.max) * updated.midterm.weight * 100 +
          (safeScore(updated.final.score) / updated.final.max) * updated.final.weight * 100;
        updated.total = Math.round(totalScore);
        updated.percentage = updated.total;
        if (updated.total >= 90) updated.grade = 'A+';
        else if (updated.total >= 80) updated.grade = 'A';
        else if (updated.total >= 70) updated.grade = 'B+';
        else if (updated.total >= 60) updated.grade = 'B';
        else if (updated.total >= 50) updated.grade = 'C';
        else if (updated.total >= 40) updated.grade = 'D';
        else updated.grade = 'F';
        return updated;
      })
    );
    setEditingCell(null);
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return null;
    return sortDir === 'asc' ? (
      <ChevronUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline ml-1" />
    );
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Gradebook" subtitle="View and manage student grades" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Class Average"
          value={`${avgGrade}%`}
          icon={<span className="text-lg font-bold">%</span>}
          color="#0ea5e9"
          description="Average across all students"
        />
        <KpiCard
          title="Highest Grade"
          value={`${highestGrade}%`}
          icon={<span className="text-lg font-bold">H</span>}
          color="#10b981"
          description="Top performer"
        />
        <KpiCard
          title="Lowest Grade"
          value={`${lowestGrade}%`}
          icon={<span className="text-lg font-bold">L</span>}
          color="#ef4444"
          description="Needs improvement"
        />
        <KpiCard
          title="Pass Rate"
          value={`${passRate}%`}
          icon={<span className="text-lg font-bold">P</span>}
          color="#f59e0b"
          description="Students passing"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard title="Grade Distribution" description="Overview of class grades">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={gradeDistribution}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-gray-200 dark:stroke-gray-700"
                />
                <XAxis dataKey="grade" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(31 41 55)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white',
                  }}
                />
                <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
        <div>
          <ChartCard title="Performance Summary" description="Key metrics at a glance">
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-300">Total Students</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {students.length}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-300">A+ Grades</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {students.filter((s) => s.grade === 'A+').length}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-300">A Grades</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {students.filter((s) => s.grade === 'A').length}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-300">Below Average</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {students.filter((s) => s.percentage < avgGrade).length}
                </span>
              </div>
            </div>
          </ChartCard>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Student Grades</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="h-9 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
          </div>
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Student <SortIcon column="name" />
                  </button>
                </th>
                {paginated[0]?.assignments.map((_, i) => (
                  <th
                    key={i}
                    className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
                  >
                    Asgn {i + 1}
                  </th>
                ))}
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                  Quiz
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                  Midterm
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                  Final
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                  Total
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                  <button
                    onClick={() => handleSort('grade')}
                    className="flex items-center justify-center hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Grade <SortIcon column="grade" />
                  </button>
                </th>
                <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                  <button
                    onClick={() => handleSort('percentage')}
                    className="flex items-center justify-center hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    % <SortIcon column="percentage" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginated.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-xs font-medium text-primary-700 dark:text-primary-300">
                        {student.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {student.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {student.enrollmentNumber}
                        </p>
                      </div>
                    </div>
                  </td>
                  {student.assignments.map((a, i) => (
                    <td
                      key={i}
                      className="px-3 py-3 text-center text-sm text-gray-700 dark:text-gray-300"
                    >
                      {editingCell?.studentId === student.id &&
                      editingCell?.field === `assignment${i}` ? (
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={saveEdit}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                          className="w-16 rounded border border-gray-300 px-1 py-0.5 text-center text-xs dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                          autoFocus
                        />
                      ) : (
                        <button
                          onClick={() => startEdit(student.id, `assignment${i}`, a.score)}
                          className="flex items-center justify-center gap-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 mx-auto"
                        >
                          <span
                            className={`${(a.score ?? 0) < a.max * 0.5 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}
                          >
                            {safeScore(a.score)}/{a.max}
                          </span>
                          <Edit2 className="h-3 w-3 text-gray-400" />
                        </button>
                      )}
                    </td>
                  ))}
                  <td className="px-3 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
                    {editingCell?.studentId === student.id && editingCell?.field === 'quiz' ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                        className="w-16 rounded border border-gray-300 px-1 py-0.5 text-center text-xs dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => startEdit(student.id, 'quiz', student.quiz.score)}
                        className="flex items-center justify-center gap-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 mx-auto"
                      >
                        <span>
                          {safeScore(student.quiz.score)}/{student.quiz.max}
                        </span>
                        <Edit2 className="h-3 w-3 text-gray-400" />
                      </button>
                    )}
                  </td>
                  <td className="px-3 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
                    {editingCell?.studentId === student.id && editingCell?.field === 'midterm' ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                        className="w-16 rounded border border-gray-300 px-1 py-0.5 text-center text-xs dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => startEdit(student.id, 'midterm', student.midterm.score)}
                        className="flex items-center justify-center gap-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 mx-auto"
                      >
                        <span>
                          {safeScore(student.midterm.score)}/{student.midterm.max}
                        </span>
                        <Edit2 className="h-3 w-3 text-gray-400" />
                      </button>
                    )}
                  </td>
                  <td className="px-3 py-3 text-center text-sm text-gray-700 dark:text-gray-300">
                    {editingCell?.studentId === student.id && editingCell?.field === 'final' ? (
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                        className="w-16 rounded border border-gray-300 px-1 py-0.5 text-center text-xs dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                        autoFocus
                      />
                    ) : (
                      <button
                        onClick={() => startEdit(student.id, 'final', student.final.score)}
                        className="flex items-center justify-center gap-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 mx-auto"
                      >
                        <span>
                          {safeScore(student.final.score)}/{student.final.max}
                        </span>
                        <Edit2 className="h-3 w-3 text-gray-400" />
                      </button>
                    )}
                  </td>
                  <td className="px-3 py-3 text-center text-sm font-medium text-gray-900 dark:text-white">
                    {student.total}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        student.grade.startsWith('A')
                          ? 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
                          : student.grade.startsWith('B')
                            ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
                            : student.grade.startsWith('C')
                              ? 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20'
                              : 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20'
                      }`}
                    >
                      {student.grade}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center text-sm font-medium text-gray-900 dark:text-white">
                    {student.percentage}%
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="rounded p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden divide-y divide-gray-200 dark:divide-gray-700">
          {paginated.map((student) => (
            <div key={student.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-sm font-medium text-primary-700 dark:text-primary-300">
                    {student.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {student.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {student.enrollmentNumber}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    student.grade.startsWith('A')
                      ? 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
                      : student.grade.startsWith('B')
                        ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
                        : student.grade.startsWith('C')
                          ? 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20'
                          : 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20'
                  }`}
                >
                  {student.grade}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div className="rounded-lg bg-gray-50 p-2 text-center dark:bg-gray-900/50">
                  <p className="text-gray-500 dark:text-gray-400">Quiz</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {safeScore(student.quiz.score)}/{student.quiz.max}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-2 text-center dark:bg-gray-900/50">
                  <p className="text-gray-500 dark:text-gray-400">Midterm</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {safeScore(student.midterm.score)}/{student.midterm.max}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-2 text-center dark:bg-gray-900/50">
                  <p className="text-gray-500 dark:text-gray-400">Final</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {safeScore(student.final.score)}/{student.final.max}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {student.percentage}%
                </span>
                <button
                  onClick={() => setSelectedStudent(student)}
                  className="text-xs font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 px-5 py-4 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, filtered.length)} of{' '}
            {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-gray-300 p-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Student Details
              </h3>
              <button
                onClick={() => setSelectedStudent(null)}
                className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-lg font-medium text-primary-700 dark:text-primary-300">
                  {selectedStudent.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {selectedStudent.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedStudent.enrollmentNumber}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Course</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedStudent.courseName}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Course Code</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {selectedStudent.courseCode}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Assignments Avg</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {Math.round(
                      (safeScore(selectedStudent.assignments[0].score) /
                        selectedStudent.assignments[0].max) *
                        100
                    )}{' '}
                    % /{' '}
                    {Math.round(
                      (safeScore(selectedStudent.assignments[1].score) /
                        selectedStudent.assignments[1].max) *
                        100
                    )}
                    %
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Quiz</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {safeScore(selectedStudent.quiz.score)}/{selectedStudent.quiz.max} (
                    {Math.round(
                      (safeScore(selectedStudent.quiz.score) / selectedStudent.quiz.max) * 100
                    )}
                    %)
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Midterm</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {safeScore(selectedStudent.midterm.score)}/{selectedStudent.midterm.max} (
                    {Math.round(
                      (safeScore(selectedStudent.midterm.score) / selectedStudent.midterm.max) * 100
                    )}
                    %)
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Final</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {safeScore(selectedStudent.final.score)}/{selectedStudent.final.max} (
                    {Math.round(
                      (safeScore(selectedStudent.final.score) / selectedStudent.final.max) * 100
                    )}
                    %)
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Overall Grade
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                    selectedStudent.grade.startsWith('A')
                      ? 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
                      : selectedStudent.grade.startsWith('B')
                        ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
                        : selectedStudent.grade.startsWith('C')
                          ? 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20'
                          : 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20'
                  }`}
                >
                  {selectedStudent.grade} - {selectedStudent.percentage}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
