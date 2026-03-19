import { useState, useEffect } from 'react'
import { userAPI, studentAPI, teacherAPI, courseAPI } from '../../services/api'
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  TrendingUp,
  UserPlus,
  UserCheck,
  Calendar,
  Award,
  RefreshCw
} from 'lucide-react'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    recentUsers: [],
    topPerformers: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      console.log('Fetching dashboard data...')
      const [users, students, teachers, courses] = await Promise.all([
        userAPI.getAllUsers(),
        studentAPI.getAllStudents(),
        teacherAPI.getAllTeachers(),
        courseAPI.getAllCourses()
      ])

      console.log('Dashboard data fetched:', { users: users.length, students: students.length, teachers: teachers.length, courses: courses.length })

      setStats({
        totalUsers: users.length,
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalCourses: courses.length,
        recentUsers: users.slice(-5).reverse(),
        topPerformers: students.slice(0, 5)
      })
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      alert('Failed to load dashboard data. Please try refreshing the page.')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: GraduationCap,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Total Teachers',
      value: stats.totalTeachers,
      icon: UserCheck,
      color: 'bg-purple-500',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Total Courses',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'bg-orange-500',
      change: '+3%',
      changeType: 'positive'
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome to admin dashboard</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="btn btn-secondary flex items-center"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
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
                <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity and Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Users</h3>
            <UserPlus className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats.recentUsers.map((user, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800">
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <UserPlus className="w-5 h-5 text-primary-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Add New Student</p>
                  <p className="text-xs text-gray-500">Register a new student</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <GraduationCap className="w-5 h-5 text-primary-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Add New Teacher</p>
                  <p className="text-xs text-gray-500">Register a new teacher</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <BookOpen className="w-5 h-5 text-primary-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Create Course</p>
                  <p className="text-xs text-gray-500">Add a new course</p>
                </div>
              </div>
            </button>
            <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-primary-600 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Manage Timetable</p>
                  <p className="text-xs text-gray-500">Update class schedules</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">System Overview</h3>
          <Award className="w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.totalStudents}</div>
            <div className="text-sm text-blue-600">Active Students</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.totalTeachers}</div>
            <div className="text-sm text-green-600">Active Teachers</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.totalCourses}</div>
            <div className="text-sm text-purple-600">Available Courses</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
