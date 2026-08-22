import { useEffect, useState } from 'react';
import { Search, CheckSquare, Square, Save } from 'lucide-react';
import { PageHeader, EmptyState } from '@/features/faculty';
import { facultyMockService } from '@/services/mock/facultyMockService';
import type {
  AttendanceSession,
  StudentWithAttendance,
  AttendanceStatus,
  FacultyCourse,
} from '@/types/faculty';

const statusColors: Record<AttendanceStatus, string> = {
  present: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20',
  absent: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20',
  late: 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20',
  excused: 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20',
};

const statusLabels: Record<AttendanceStatus, string> = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  excused: 'Excused',
};

export function FacultyAttendance() {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [courses, setCourses] = useState<FacultyCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);
  const [sessionStudents, setSessionStudents] = useState<StudentWithAttendance[]>([]);
  const [search, setSearch] = useState('');
  const [allSelected, setAllSelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [sessionsData, coursesData] = await Promise.all([
        facultyMockService.getAttendanceSessions(),
        facultyMockService.getCourses(),
      ]);
      setSessions(sessionsData);
      setCourses(coursesData);
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (selectedSession) {
      setSessionStudents([...selectedSession.students]);
      setAllSelected(false);
    }
  }, [selectedSession]);

  const filteredSessions =
    selectedCourse === 'all' ? sessions : sessions.filter((s) => s.courseId === selectedCourse);

  const filteredStudents = sessionStudents.filter(
    (s) =>
      s.studentName.toLowerCase().includes(search.toLowerCase()) ||
      s.enrollmentNumber.toLowerCase().includes(search.toLowerCase())
  );

  const courseNames: Record<string, string> = {};
  courses.forEach((c) => {
    courseNames[c.id] = c.name;
  });

  const updateStudentStatus = (studentId: string, status: AttendanceStatus) => {
    setSessionStudents((prev) =>
      prev.map((s) => (s.studentId === studentId ? { ...s, status } : s))
    );
  };

  const toggleAll = () => {
    if (allSelected) {
      setSessionStudents((prev) =>
        prev.map((s) => ({ ...s, status: 'absent' as AttendanceStatus }))
      );
      setAllSelected(false);
    } else {
      setSessionStudents((prev) =>
        prev.map((s) => ({ ...s, status: 'present' as AttendanceStatus }))
      );
      setAllSelected(true);
    }
  };

  const handleSave = async () => {
    if (!selectedSession) return;
    setSaving(true);
    await facultyMockService.saveAttendance(selectedSession.id, sessionStudents);
    setSaving(false);
    alert('Attendance saved successfully!');
  };

  const getStats = () => {
    const present = sessionStudents.filter((s) => s.status === 'present').length;
    const absent = sessionStudents.filter((s) => s.status === 'absent').length;
    const late = sessionStudents.filter((s) => s.status === 'late').length;
    const excused = sessionStudents.filter((s) => s.status === 'excused').length;
    const total = sessionStudents.length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    return { present, absent, late, excused, total, percentage };
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
      <PageHeader title="Attendance" subtitle="Manage and track class attendance" />

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="all">All Courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      {filteredSessions.length === 0 ? (
        <EmptyState
          title="No attendance sessions found"
          description="Try adjusting your search criteria."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Attendance Sessions
            </h3>
            {filteredSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => setSelectedSession(session)}
                className={`w-full text-left rounded-xl border p-4 transition-colors ${
                  selectedSession?.id === session.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750'
                }`}
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {session.courseName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {session.courseCode} • {session.date}
                </p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {session.students.length} students
                </p>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2">
            {selectedSession ? (
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {selectedSession.courseName}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedSession.courseCode} • {selectedSession.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleAll}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        {allSelected ? (
                          <CheckSquare className="h-3.5 w-3.5" />
                        ) : (
                          <Square className="h-3.5 w-3.5" />
                        )}
                        {allSelected ? 'Mark All Absent' : 'Mark All Present'}
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700 disabled:opacity-50"
                      >
                        <Save className="h-3.5 w-3.5" />
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                </div>

                {selectedSession &&
                  (() => {
                    const stats = getStats();
                    return (
                      <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-5">
                        <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-700">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            {stats.percentage}%
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Attendance</p>
                        </div>
                        <div className="rounded-lg bg-green-50 p-3 text-center dark:bg-green-900/20">
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">
                            {stats.present}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Present</p>
                        </div>
                        <div className="rounded-lg bg-red-50 p-3 text-center dark:bg-red-900/20">
                          <p className="text-lg font-bold text-red-600 dark:text-red-400">
                            {stats.absent}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Absent</p>
                        </div>
                        <div className="rounded-lg bg-yellow-50 p-3 text-center dark:bg-yellow-900/20">
                          <p className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                            {stats.late}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Late</p>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-3 text-center dark:bg-gray-700">
                          <p className="text-lg font-bold text-gray-600 dark:text-gray-400">
                            {stats.excused}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Excused</p>
                        </div>
                      </div>
                    );
                  })()}

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredStudents.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                      No students found.
                    </div>
                  ) : (
                    filteredStudents.map((student) => (
                      <div
                        key={student.studentId}
                        className="flex items-center justify-between px-5 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 text-sm font-medium">
                            {student.studentName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {student.studentName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {student.enrollmentNumber}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {(['present', 'absent', 'late', 'excused'] as AttendanceStatus[]).map(
                            (status) => (
                              <button
                                key={status}
                                onClick={() => updateStudentStatus(student.studentId, status)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                                  student.status === status
                                    ? statusColors[status]
                                    : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                                }`}
                              >
                                {statusLabels[status]}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Select a session to view and manage attendance
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
