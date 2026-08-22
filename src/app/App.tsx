import { Routes, Route } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { ResetPassword } from '@/pages/ResetPassword';
import { StudentLayout } from '@/layouts/StudentLayout';
import { ParentLayout } from '@/layouts/ParentLayout';
import { FacultyLayout } from '@/layouts/FacultyLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { StudentDashboard } from '@/pages/student/StudentDashboard';
import { StudentCourses } from '@/pages/student/StudentCourses';
import { StudentAssignments } from '@/pages/student/StudentAssignments';
import { StudentExams } from '@/pages/student/StudentExams';
import { StudentAttendance } from '@/pages/student/StudentAttendance';
import { StudentGrades } from '@/pages/student/StudentGrades';
import { StudentCalendar } from '@/pages/student/StudentCalendar';
import { StudentMessages } from '@/pages/student/StudentMessages';
import { StudentProfile } from '@/pages/student/StudentProfile';
import { StudentSettings } from '@/pages/student/StudentSettings';
import { ParentDashboard } from '@/pages/parent/ParentDashboard';
import { ParentChildren } from '@/pages/parent/ParentChildren';
import { ParentAttendance } from '@/pages/parent/ParentAttendance';
import { ParentAcademics } from '@/pages/parent/ParentAcademics';
import { ParentAssignments } from '@/pages/parent/ParentAssignments';
import { ParentExams } from '@/pages/parent/ParentExams';
import { ParentFees } from '@/pages/parent/ParentFees';
import { ParentMessages } from '@/pages/parent/ParentMessages';
import { ParentCalendar } from '@/pages/parent/ParentCalendar';
import { ParentDocuments } from '@/pages/parent/ParentDocuments';
import { ParentFacultyFeedback } from '@/pages/parent/ParentFacultyFeedback';
import { ParentProfile } from '@/pages/parent/ParentProfile';
import { ParentSettings } from '@/pages/parent/ParentSettings';
import { FacultyDashboard } from '@/pages/faculty/FacultyDashboard';
import { FacultyClasses } from '@/pages/faculty/FacultyClasses';
import { FacultyStudents } from '@/pages/faculty/FacultyStudents';
import { FacultyAttendance } from '@/pages/faculty/FacultyAttendance';
import { FacultyAssignments } from '@/pages/faculty/FacultyAssignments';
import { FacultyGradebook } from '@/pages/faculty/FacultyGradebook';
import { FacultyCourses } from '@/pages/faculty/FacultyCourses';
import { FacultyMaterials } from '@/pages/faculty/FacultyMaterials';
import { FacultyAnnouncements } from '@/pages/faculty/FacultyAnnouncements';
import { FacultyMessages } from '@/pages/faculty/FacultyMessages';
import { FacultyCalendar } from '@/pages/faculty/FacultyCalendar';
import { FacultyReports } from '@/pages/faculty/FacultyReports';
import { FacultyProfile } from '@/pages/faculty/FacultyProfile';
import { FacultySettings } from '@/pages/faculty/FacultySettings';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { RoleRedirect, ProtectedRoute } from '@/features/auth';
import { UnauthorizedPage } from '@/pages/Unauthorized';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RoleRedirect />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="courses/:id" element={<StudentCourses />} />
        <Route path="assignments" element={<StudentAssignments />} />
        <Route path="assignments/:id" element={<StudentAssignments />} />
        <Route path="exams" element={<StudentExams />} />
        <Route path="exams/:id" element={<StudentExams />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="grades" element={<StudentGrades />} />
        <Route path="calendar" element={<StudentCalendar />} />
        <Route path="messages" element={<StudentMessages />} />
        <Route path="messages/:id" element={<StudentMessages />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="settings" element={<StudentSettings />} />
      </Route>

      <Route
        path="/parent"
        element={
          <ProtectedRoute allowedRoles={['PARENT']}>
            <ParentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RoleRedirect />} />
        <Route path="dashboard" element={<ParentDashboard />} />
        <Route path="children" element={<ParentChildren />} />
        <Route path="children/:id" element={<ParentChildren />} />
        <Route path="attendance" element={<ParentAttendance />} />
        <Route path="academics" element={<ParentAcademics />} />
        <Route path="assignments" element={<ParentAssignments />} />
        <Route path="exams" element={<ParentExams />} />
        <Route path="fees" element={<ParentFees />} />
        <Route path="messages" element={<ParentMessages />} />
        <Route path="calendar" element={<ParentCalendar />} />
        <Route path="documents" element={<ParentDocuments />} />
        <Route path="faculty-feedback" element={<ParentFacultyFeedback />} />
        <Route path="profile" element={<ParentProfile />} />
        <Route path="settings" element={<ParentSettings />} />
      </Route>

      <Route path="/faculty" element={<FacultyLayout />}>
        <Route index element={<RoleRedirect />} />
        <Route path="dashboard" element={<FacultyDashboard />} />
        <Route path="classes" element={<FacultyClasses />} />
        <Route path="students" element={<FacultyStudents />} />
        <Route path="attendance" element={<FacultyAttendance />} />
        <Route path="assignments" element={<FacultyAssignments />} />
        <Route path="gradebook" element={<FacultyGradebook />} />
        <Route path="courses" element={<FacultyCourses />} />
        <Route path="materials" element={<FacultyMaterials />} />
        <Route path="announcements" element={<FacultyAnnouncements />} />
        <Route path="messages" element={<FacultyMessages />} />
        <Route path="calendar" element={<FacultyCalendar />} />
        <Route path="reports" element={<FacultyReports />} />
        <Route path="profile" element={<FacultyProfile />} />
        <Route path="settings" element={<FacultySettings />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<RoleRedirect />} />
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}
