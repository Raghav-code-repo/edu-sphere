import { useEffect, useState } from 'react';
import { PageHeader, KpiCard } from '@/features/faculty';
import { facultyApi } from '@/services/api/facultyApi';
import type { Assignment, Submission, FacultyCourse } from '@/types/faculty';
import { Search, Plus, X, Edit2, Save, Send } from 'lucide-react';

type AssignmentFilter = 'all' | 'published' | 'closed' | 'draft';

export function FacultyAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [courses, setCourses] = useState<FacultyCourse[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AssignmentFilter>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [reviewingSubmission, setReviewingSubmission] = useState<Submission | null>(null);
  const [reviewForm, setReviewForm] = useState({
    grade: '',
    feedback: '',
    status: 'graded' as 'graded' | 'reviewed',
  });

  useEffect(() => {
    Promise.all([facultyApi.getAssignments(), facultyApi.getCourses()]).then(([asgns, crs]) => {
      setAssignments(asgns);
      setCourses(crs);
      setLoading(false);
    });
  }, []);

  const filtered = assignments.filter((a) => {
    const matchesFilter = filter === 'all' || a.status === filter;
    const matchesCourse = selectedCourse === 'all' || a.courseId === selectedCourse;
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.courseName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesCourse && matchesSearch;
  });

  const pendingReviews = submissions.filter((s) => s.status === 'submitted').length;

  const openAssignment = async (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    const subs = await facultyApi.getSubmissions(assignment.id);
    setSubmissions(subs);
  };

  const handleReview = async () => {
    if (!reviewingSubmission) return;
    await facultyApi.reviewSubmission({
      submissionId: reviewingSubmission.id,
      grade: parseInt(reviewForm.grade, 10) || 0,
      feedback: reviewForm.feedback,
      status: reviewForm.status,
    });
    setReviewingSubmission(null);
    if (selectedAssignment) {
      const updated = await facultyApi.getSubmissions(selectedAssignment.id);
      setSubmissions(updated);
    }
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
      <PageHeader
        title="Assignments"
        subtitle="Create and review assignments"
        actions={
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            Create Assignment
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          title="Total Assignments"
          value={assignments.length}
          icon={<span className="text-lg font-bold">A</span>}
          color="#0ea5e9"
        />
        <KpiCard
          title="Published"
          value={assignments.filter((a) => a.status === 'published').length}
          icon={<span className="text-lg font-bold">P</span>}
          color="#10b981"
        />
        <KpiCard
          title="Pending Reviews"
          value={pendingReviews || submissions.filter((s) => s.status === 'submitted').length}
          icon={<span className="text-lg font-bold">R</span>}
          color="#f59e0b"
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-gray-700">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">All Assignments</h3>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as AssignmentFilter)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                <option value="all">All Courses</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-4">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
              No assignments found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((assignment) => (
                <div
                  key={assignment.id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {assignment.courseCode}
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        assignment.status === 'published'
                          ? 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
                          : assignment.status === 'closed'
                            ? 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20'
                            : 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20'
                      }`}
                    >
                      {assignment.status}
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                    {assignment.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {assignment.courseName}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Due: {assignment.dueDate}</span>
                    <span>
                      {assignment.submissionCount}/{assignment.totalStudents} submitted
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {assignment.type} • {assignment.maxPoints} pts
                    </span>
                    <button
                      onClick={() => openAssignment(assignment)}
                      className="text-xs font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                    >
                      Review Submissions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedAssignment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedAssignment(null)}
        >
          <div
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedAssignment.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedAssignment.courseName} • {selectedAssignment.type} •{' '}
                  {selectedAssignment.maxPoints} pts
                </p>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              {submissions.length === 0 ? (
                <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                  No submissions yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="rounded-xl border border-gray-200 p-4 dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-sm font-medium text-primary-700 dark:text-primary-300">
                            {submission.studentName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {submission.studentName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {submission.enrollmentNumber}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            submission.status === 'graded'
                              ? 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
                              : submission.status === 'reviewed'
                                ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20'
                                : 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20'
                          }`}
                        >
                          {submission.status}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                        {submission.content}
                      </p>
                      {submission.attachmentUrl && (
                        <p className="mt-1 text-xs text-primary-600 dark:text-primary-400">
                          Attachment: {submission.attachmentUrl}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Submitted: {submission.submittedAt}
                      </p>
                      {submission.grade !== undefined && (
                        <div className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                          Grade: {submission.grade}/{submission.maxPoints}
                        </div>
                      )}
                      {submission.feedback && (
                        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 italic">
                          Feedback: {submission.feedback}
                        </p>
                      )}
                      {submission.status === 'submitted' && (
                        <button
                          onClick={() => setReviewingSubmission(submission)}
                          className="mt-3 inline-flex items-center gap-1 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700"
                        >
                          <Edit2 className="h-3 w-3" />
                          Grade Submission
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {reviewingSubmission && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setReviewingSubmission(null)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Grade Submission
              </h3>
              <button
                onClick={() => setReviewingSubmission(null)}
                className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Student
                </label>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {reviewingSubmission.studentName}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Grade (out of {reviewingSubmission.maxPoints})
                </label>
                <input
                  type="number"
                  value={reviewForm.grade}
                  onChange={(e) => setReviewForm({ ...reviewForm, grade: e.target.value })}
                  className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Feedback
                </label>
                <textarea
                  value={reviewForm.feedback}
                  onChange={(e) => setReviewForm({ ...reviewForm, feedback: e.target.value })}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
              <button
                onClick={handleReview}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
              >
                <Save className="h-4 w-4" />
                Save Review
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreateForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowCreateForm(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create Assignment
              </h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  type="text"
                  className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Course
                </label>
                <select className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Due Date
                </label>
                <input
                  type="date"
                  className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Max Points
                </label>
                <input
                  type="number"
                  className="mt-1 h-10 w-full rounded-lg border border-gray-300 px-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700">
                <Send className="h-4 w-4" />
                Create Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
