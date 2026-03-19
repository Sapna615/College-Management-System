import { useState, useEffect } from 'react'
import { studentAPI, resultAPI, attendanceAPI, timetableAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  BookOpen, 
  CalendarDays, 
  FileText,
  Award,
  Clock,
  TrendingUp,
  User
} from 'lucide-react'

const StudentDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    currentSemester: 1,
    attendancePercentage: 0,
    averageGrade: 0,
    todaySchedule: [],
    recentResults: []
  })
  const [loading, setLoading] = useState(true)

  // Debug: Log user data when it changes
  useEffect(() => {
    console.log('StudentDashboard - User data changed:', user)
  }, [user])

  const handleViewResults = () => {
    console.log('Navigating to student results...')
    navigate('/student/results')
  }

  const handleViewAttendance = () => {
    console.log('Navigating to student attendance...')
    navigate('/student/attendance')
  }

  const handleViewCourses = () => {
    console.log('Navigating to student courses...')
    navigate('/student/courses')
  }

  const handleViewTimetable = () => {
    console.log('Navigating to student timetable...')
    navigate('/student/timetable')
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [studentProfile, results, attendance, timetable] = await Promise.all([
        studentAPI.getCurrentStudentProfile(),
        resultAPI.getMyResults(),
        attendanceAPI.getMyAttendance(),
        timetableAPI.getMyTimetable()
      ])

      console.log('Fetched data:', { studentProfile, results, attendance, timetable })

      // Calculate average grade
      const averageGrade = results.length > 0 
        ? (results.reduce((acc, result) => acc + (result.marks / result.maxMarks) * 100, 0) / results.length).toFixed(1)
        : 0

      // Calculate attendance percentage
      const attendancePercentage = attendance.length > 0
        ? (attendance.filter(a => a.present).length / attendance.length * 100).toFixed(1)
        : 0

      // Get today's classes
      const today = new Date().getDay()
      const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
      const todayName = dayNames[today]
      
      const todaySchedule = timetable.filter(item => item.dayOfWeek === todayName)

      setStats({
        enrolledCourses: timetable.length,
        currentSemester: studentProfile?.currentSemester || 1,
        attendancePercentage: parseFloat(attendancePercentage),
        averageGrade: parseFloat(averageGrade),
        todaySchedule: todaySchedule,
        recentResults: results.slice(0, 3)
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Set default values on error
      setStats({
        enrolledCourses: 0,
        currentSemester: 1,
        attendancePercentage: 0,
        averageGrade: 0,
        todaySchedule: [],
        recentResults: []
      })
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Enrolled Courses',
      value: stats.enrolledCourses,
      icon: BookOpen,
      color: 'bg-blue-500',
      description: 'Active courses'
    },
    {
      title: 'Current Semester',
      value: stats.currentSemester,
      icon: Award,
      color: 'bg-green-500',
      description: 'Academic semester'
    },
    {
      title: 'Attendance',
      value: `${stats.attendancePercentage}%`,
      icon: CalendarDays,
      color: 'bg-purple-500',
      description: 'Overall attendance'
    },
    {
      title: 'Average Grade',
      value: `${stats.averageGrade}%`,
      icon: FileText,
      color: 'bg-orange-500',
      description: 'Academic performance'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Schedule */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Today's Schedule</h3>
          <Clock className="w-5 h-5 text-gray-400" />
        </div>
        {stats.todaySchedule.length > 0 ? (
          <div className="space-y-3">
            {stats.todaySchedule.map((classItem, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{classItem.subject}</p>
                    <p className="text-xs text-gray-500">
                      {classItem.room} • {classItem.startTime} - {classItem.endTime}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {classItem.teacherName}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No classes scheduled for today</p>
          </div>
        )}
      </div>

      {/* Recent Results */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Results</h3>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>
        {stats.recentResults.length > 0 ? (
          <div className="space-y-3">
            {stats.recentResults.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <Award className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{result.course?.name}</p>
                    <p className="text-xs text-gray-500">{result.examType} • {result.semester} Semester</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{result.marks}/{result.maxMarks}</p>
                  <p className="text-xs text-gray-500">
                    {((result.marks / result.maxMarks) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No results available yet</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          <User className="w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={handleViewResults}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            <FileText className="w-6 h-6 text-primary-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">View Results</p>
          </button>
          <button 
            onClick={handleViewAttendance}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            <CalendarDays className="w-6 h-6 text-primary-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">View Attendance</p>
          </button>
          <button 
            onClick={handleViewCourses}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            <BookOpen className="w-6 h-6 text-primary-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">My Courses</p>
          </button>
          <button 
            onClick={handleViewTimetable}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            <Clock className="w-6 h-6 text-primary-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">View Timetable</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard