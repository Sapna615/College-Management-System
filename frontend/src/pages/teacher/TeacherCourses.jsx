import { useState, useEffect } from 'react'
import { courseAPI, teacherAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  BookOpen, 
  Users, 
  Calendar,
  Search,
  Plus,
  Edit2,
  Trash2
} from 'lucide-react'

const TeacherCourses = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [teacherProfile, setTeacherProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      console.log('Fetching teacher courses data...')
      const [coursesData, teacherData] = await Promise.all([
        courseAPI.getAllCourses(),
        teacherAPI.getCurrentTeacherProfile()
      ])
      
      console.log('Courses:', coursesData?.length || 0)
      console.log('Teacher profile:', teacherData)
      
      setCourses(coursesData || [])
      setTeacherProfile(teacherData)
    } catch (error) {
      console.error('Failed to fetch initial data:', error)
      alert('Failed to load data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        course.courseCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        course.department?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleViewStudents = (course) => {
    navigate('/teacher/students', { state: { selectedCourse: course } })
  }

  const handleViewTimetable = (course) => {
    navigate('/teacher/timetable', { state: { selectedCourse: course } })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-600">View and manage your assigned courses</p>
        </div>
        <button
          onClick={() => navigate('/teacher/courses/create')}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Course
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="flex items-center space-x-2">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Courses Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Teacher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{course.courseCode || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {course.name || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {course.description || 'No description available'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.department || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.credits || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {teacherProfile?.user?.name || 'Not assigned'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {teacherProfile?.employeeId || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewStudents(course)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Students"
                        >
                          <Users className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleViewTimetable(course)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Timetable"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No courses found</p>
                    <p className="text-sm text-gray-400">
                      {searchTerm === '' 
                        ? 'No courses found. You can create a new course.'
                        : 'No courses match your search.'
                      }
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TeacherCourses
