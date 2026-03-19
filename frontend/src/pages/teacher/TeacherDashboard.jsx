import { useState, useEffect } from 'react'
import { teacherAPI, courseAPI, attendanceAPI, resultAPI, timetableAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  BookOpen, 
  Users, 
  CalendarDays, 
  FileText,
  Clock,
  Award,
  TrendingUp
} from 'lucide-react'

const TeacherDashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    upcomingClasses: 0,
    pendingResults: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Starting dashboard data fetch...')
      console.log('Current user:', user)
      console.log('User token available:', !!localStorage.getItem('token'))
      
      let courses = []
      let teacherProfile = null
      let timetables = []
      
      // Test courses API
      try {
        console.log('Testing courses API...')
        const coursesResponse = await fetch('http://localhost:8081/api/courses/my-courses', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })
        console.log('Courses API response status:', coursesResponse.status)
        if (coursesResponse.ok) {
          const coursesData = await coursesResponse.json()
          console.log('Courses API response data:', coursesData)
          courses = coursesData || []
        } else {
          console.log('Courses API failed, using mock data')
        }
        console.log('Processed courses:', courses)
      } catch (error) {
        console.error('Direct courses fetch error:', error)
      }
      
      // Test teacher profile API
      try {
        console.log('Testing teacher profile API...')
        const profileResponse = await fetch('http://localhost:8081/api/teachers/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })
        console.log('Profile API response status:', profileResponse.status)
        if (profileResponse.ok) {
          const profileData = await profileResponse.json()
          console.log('Profile API response data:', profileData)
          teacherProfile = profileData || null
        } else {
          console.log('Profile API failed, using mock data')
        }
        console.log('Processed teacher profile:', teacherProfile)
      } catch (error) {
        console.error('Direct profile fetch error:', error)
      }
      
      // Test timetables API - CORRECTED ENDPOINT
      try {
        console.log('Testing timetables API...')
        const timetablesResponse = await fetch('http://localhost:8081/api/timetable/all', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })
        console.log('Timetables API response status:', timetablesResponse.status)
        if (timetablesResponse.ok) {
          const timetablesData = await timetablesResponse.json()
          console.log('Timetables API response data:', timetablesData)
          timetables = timetablesData || []
        } else {
          console.log('Timetables API failed, using mock data')
        }
        console.log('Processed timetables:', timetables)
      } catch (error) {
        console.error('Direct timetables fetch error:', error)
      }
      
      // Use mock data for testing if APIs fail
      const mockCourses = [
        { id: 1, name: "Computer Science 101", students: [{id: 1}, {id: 2}] },
        { id: 2, name: "Java Programming", students: [{id: 3}, {id: 4}] }
      ]
      const mockTeacherProfile = { id: 33, user: { name: "Harpreet" } }
      const mockTimetables = [
        { subject: "Computer Science 101", teacherName: "Harpreet", dayOfWeek: "4" },
        { subject: "Java Programming", teacherName: "Harpreet", dayOfWeek: "4" }
      ]
      
      // Use real data if available, otherwise use mock data
      const finalCourses = courses?.length > 0 ? courses : mockCourses
      const finalTeacherProfile = teacherProfile || mockTeacherProfile
      const finalTimetables = timetables?.length > 0 ? timetables : mockTimetables
      
      console.log('Using data:', {
        courses: finalCourses.length,
        teacherProfile: finalTeacherProfile ? 'found' : 'not found',
        timetables: finalTimetables.length,
        usingMockData: courses?.length === 0
      })
      
      // Simple calculations
      const totalCourses = finalCourses?.length || 0
      const totalStudents = finalCourses?.reduce((acc, course) => acc + (course.students?.length || 0), 0) || 0
      
      // Filter timetables for this teacher
      const myTimetables = finalTimetables?.filter(timetable => 
        finalTeacherProfile?.user?.name && 
        (timetable.teacherName === finalTeacherProfile.user.name || 
         timetable.teacher?.user?.name === finalTeacherProfile.user.name)
      ) || []
      
      // Get today's classes
      const today = new Date().getDay()
      const upcomingClasses = myTimetables?.filter(timetable => {
        const dayNum = parseInt(timetable.dayOfWeek) || 0
        return dayNum === today
      }).length || 0
      
      console.log('Final stats:', {
        totalCourses,
        totalStudents,
        upcomingClasses,
        today,
        coursesSample: finalCourses?.[0],
        myTimetablesSample: myTimetables?.[0],
        usingMockData: courses?.length === 0
      })
      
      setStats({
        totalCourses,
        totalStudents,
        upcomingClasses,
        pendingResults: 5,
      })
    } catch (error) {
      console.error('Dashboard fetch error:', error)
      setError('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAttendance = () => navigate('/teacher/attendance')
  const handleUploadResults = () => navigate('/teacher/results')
  const handleManageCourses = () => navigate('/teacher/courses')
  const handleViewStudents = () => navigate('/teacher/students')
  const handleViewTimetable = () => navigate('/teacher/timetable')

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Dashboard Error</h3>
          <p className="text-gray-500 mb-4">There was an error loading the dashboard.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">My Courses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 bg-purple-500 rounded-lg">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Classes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.upcomingClasses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 bg-orange-500 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingResults}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          <Award className="w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={handleMarkAttendance}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            <CalendarDays className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Mark Attendance</p>
          </button>
          
          <button 
            onClick={handleUploadResults}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            <Award className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Upload Results</p>
          </button>
          
          <button 
            onClick={handleManageCourses}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">Manage Courses</p>
          </button>
          
          <button 
            onClick={handleViewStudents}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">View Students</p>
          </button>
          
          <button 
            onClick={handleViewTimetable}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
          >
            <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-900">View Timetable</p>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard
