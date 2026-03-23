import axios from 'axios'
import toast from 'react-hot-toast'

// Use full backend URL for now to bypass proxy issues
const API_BASE_URL = 'http://localhost:8081'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
      toast.error('Session expired. Please login again.')
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials).then(res => res.data),
  register: (userData) => api.post('/auth/register', userData).then(res => res.data),
  forgotPassword: (email) => api.post('/auth/forgot-password', email).then(res => res.data),
  resetPassword: (data) => api.post('/auth/reset-password', data).then(res => res.data),
}

export const userAPI = {
  getAllUsers: () => api.get('/users/all').then(res => res.data),
  getUserById: (id) => api.get(`/users/${id}`).then(res => res.data),
  updateUser: (id, data) => api.put(`/users/${id}`, data).then(res => res.data),
  updateMyProfile: (data) => api.put('/users/update-my-profile', data).then(res => res.data),
  deleteUser: (id) => api.delete(`/users/${id}`).then(res => res.data),
  getCurrentUser: () => api.get('/users/profile').then(res => res.data),
}

export const studentAPI = {
  getAllStudents: () => api.get('/students/all').then(res => res.data),
  getStudentById: (id) => api.get(`/students/${id}`).then(res => res.data),
  createStudent: (data) => api.post('/students/create', data).then(res => res.data),
  createStudentProfile: (data) => api.post('/students/create-my-profile', data).then(res => res.data),
  updateStudent: (id, data) => api.put(`/students/${id}`, data).then(res => res.data),
  deleteStudent: (id) => api.delete(`/students/${id}`).then(res => res.data),
  getCurrentStudentProfile: () => api.get('/students/profile').then(res => res.data),
  getStudentsByDepartment: (department) => api.get(`/students/department/${department}`).then(res => res.data),
  getStudentsBySemester: (semester) => api.get(`/students/semester/${semester}`).then(res => res.data),
}

export const teacherAPI = {
  getAllTeachers: () => api.get('/teachers/all').then(res => res.data),
  getTeacherById: (id) => api.get(`/teachers/${id}`).then(res => res.data),
  createTeacher: (data) => api.post('/teachers/create', data).then(res => res.data),
  updateTeacher: (id, data) => api.put(`/teachers/${id}`, data).then(res => res.data),
  deleteTeacher: (id) => api.delete(`/teachers/${id}`).then(res => res.data),
  getCurrentTeacherProfile: () => api.get('/teachers/profile').then(res => res.data),
  getTeachersByDepartment: (department) => api.get(`/teachers/department/${department}`).then(res => res.data),
  getTeachersBySpecialization: (specialization) => api.get(`/teachers/specialization/${specialization}`).then(res => res.data),
}

export const courseAPI = {
  getAllCourses: () => api.get('/courses/all').then(res => res.data),
  getCourseById: (id) => api.get(`/courses/${id}`).then(res => res.data),
  createCourse: (data) => api.post('/courses/create', data).then(res => res.data),
  updateCourse: (id, data) => api.put(`/courses/${id}`, data).then(res => res.data),
  deleteCourse: (id) => api.delete(`/courses/${id}`).then(res => res.data),
  getCoursesByDepartment: (department) => api.get(`/courses/department/${department}`).then(res => res.data),
  getCoursesBySemester: (semester) => api.get(`/courses/semester/${semester}`).then(res => res.data),
  getCoursesByTeacher: (teacherId) => api.get(`/courses/teacher/${teacherId}`).then(res => res.data),
  assignTeacher: (courseId, teacherId) => api.post(`/courses/${courseId}/assign-teacher/${teacherId}`).then(res => res.data),
  getMyCourses: () => api.get('/courses/my-courses').then(res => res.data),
}

export const resultAPI = {
  getAllResults: () => api.get('/results/all').then(res => res.data),
  getAllResultsForTeacher: () => api.get('/results/teacher/all').then(res => res.data),
  createResult: (data) => api.post('/results/create', data).then(res => res.data),
  getResultsByStudent: (studentId) => api.get(`/results/student/${studentId}`).then(res => res.data),
  getResultsByCourse: (courseId) => api.get(`/results/course/${courseId}`).then(res => res.data),
  getResultsByStudentAndSemester: (studentId, semester) => api.get(`/results/student/${studentId}/semester/${semester}`).then(res => res.data),
  updateResult: (id, data) => api.put(`/results/${id}`, data).then(res => res.data),
  deleteResult: (id) => api.delete(`/results/${id}`).then(res => res.data),
  getMyResults: () => api.get('/results/my-results').then(res => res.data),
}

export const timetableAPI = {
  getAllTimetables: () => api.get('/timetables/all').then(res => res.data),
  getTimetableById: (id) => api.get(`/timetables/${id}`).then(res => res.data),
  createTimetable: (data) => api.post('/timetables/create', data).then(res => res.data),
  updateTimetable: (id, data) => api.put(`/timetables/${id}`, data).then(res => res.data),
  deleteTimetable: (id) => api.delete(`/timetables/${id}`).then(res => res.data),
  getTeacherTimetable: () => api.get('/timetables/teacher-timetable').then(res => res.data),
  getStudentTimetable: () => api.get('/timetables/student-timetable').then(res => res.data),
  getTimetableBySemester: (semester) => api.get(`/timetables/semester/${semester}`).then(res => res.data),
}

export const attendanceAPI = {
  markAttendance: (data) => api.post('/attendance/mark', data).then(res => res.data),
  getAttendanceByStudent: (studentId) => api.get(`/attendance/student/${studentId}`).then(res => res.data),
  getAttendanceByCourse: (courseId) => api.get(`/attendance/course/${courseId}`).then(res => res.data),
  getAttendanceByStudentAndCourse: (studentId, courseId) => api.get(`/attendance/student/${studentId}/course/${courseId}`).then(res => res.data),
  getAttendanceByDate: (date) => api.get(`/attendance/date/${date}`).then(res => res.data),
  getStudentAttendanceInRange: (studentId, startDate, endDate) => api.get(`/attendance/student/${studentId}/range?startDate=${startDate}&endDate=${endDate}`).then(res => res.data),
  updateAttendance: (id, data) => api.put(`/attendance/${id}`, data).then(res => res.data),
  deleteAttendance: (id) => api.delete(`/attendance/${id}`).then(res => res.data),
  getMyAttendance: () => api.get('/attendance/my-attendance').then(res => res.data),
  getAttendancePercentage: (studentId, courseId) => api.get(`/attendance/student/${studentId}/course/${courseId}/percentage`).then(res => res.data),
}

export default api
