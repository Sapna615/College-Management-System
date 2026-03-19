import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminLayout } from './layouts/AdminLayout'
import { TeacherLayout } from './layouts/TeacherLayout'
import { StudentLayout } from './layouts/StudentLayout'
import { AuthLayout } from './layouts/AuthLayout'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import StudentManagement from './pages/admin/StudentManagement'
import TeacherManagement from './pages/admin/TeacherManagement'
import CourseManagement from './pages/admin/CourseManagement'
import TimetableManagement from './pages/admin/TimetableManagement'
import ResultManagement from './pages/admin/ResultManagement'

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import TeacherProfile from './pages/teacher/TeacherProfile'
import ManageResults from './pages/teacher/ManageResults'
import ManageAttendance from './pages/teacher/ManageAttendance'
import TeacherStudents from './pages/teacher/TeacherStudents'
import TeacherCourses from './pages/teacher/TeacherCourses'
import TeacherTimetable from './pages/teacher/TeacherTimetable'

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard'
import StudentProfile from './pages/student/StudentProfile'
import StudentResults from './pages/student/StudentResults'
import StudentAttendance from './pages/student/StudentAttendance'
import StudentTimetable from './pages/student/StudentTimetable'

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute role="ADMIN">
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<StudentManagement />} />
        <Route path="teachers" element={<TeacherManagement />} />
        <Route path="courses" element={<CourseManagement />} />
        <Route path="timetable" element={<TimetableManagement />} />
        <Route path="results" element={<ResultManagement />} />
      </Route>

      {/* Teacher Routes */}
      <Route path="/teacher" element={
        <ProtectedRoute role="TEACHER">
          <TeacherLayout />
        </ProtectedRoute>
      }>
        <Route index element={<TeacherDashboard />} />
        <Route path="dashboard" element={<TeacherDashboard />} />
        <Route path="profile" element={<TeacherProfile />} />
        <Route path="results" element={<ManageResults />} />
        <Route path="attendance" element={<ManageAttendance />} />
        <Route path="students" element={<TeacherStudents />} />
        <Route path="courses" element={<TeacherCourses />} />
        <Route path="timetable" element={<TeacherTimetable />} />
      </Route>

      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute role="STUDENT">
          <StudentLayout />
        </ProtectedRoute>
      }>
        <Route index element={<StudentDashboard />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="results" element={<StudentResults />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="timetable" element={<StudentTimetable />} />
      </Route>
    </Routes>
  )
}

export default App
