import { useState, useEffect } from 'react'
import { attendanceAPI, courseAPI, studentAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  CalendarDays, 
  Users, 
  BookOpen,
  Check,
  X,
  Plus,
  Search,
  Filter,
  Save,
  Calendar
} from 'lucide-react'

const ManageAttendance = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [attendance, setAttendance] = useState([])
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedCourse, setSelectedCourse] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [attendanceData, setAttendanceData] = useState({})

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      console.log('Fetching teacher attendance data...')
      const [coursesData, studentsData] = await Promise.all([
        courseAPI.getAllCourses(),
        studentAPI.getAllStudents()
      ])
      
      console.log('Courses:', coursesData?.length || 0)
      console.log('Students:', studentsData?.length || 0)
      
      setCourses(coursesData || [])
      setStudents(studentsData || [])
      
      // Fetch attendance for selected date
      if (selectedDate) {
        fetchAttendanceForDate(selectedDate)
      }
    } catch (error) {
      console.error('Failed to fetch initial data:', error)
      alert('Failed to load data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchAttendanceForDate = async (date) => {
    try {
      const attendanceRecords = await attendanceAPI.getAttendanceByDate(date)
      console.log('Attendance for date:', attendanceRecords)
      setAttendance(attendanceRecords || [])
      
      // Convert to object for easy lookup
      const attendanceMap = {}
      attendanceRecords.forEach(record => {
        attendanceMap[record.studentId] = record
      })
      setAttendanceData(attendanceMap)
    } catch (error) {
      console.error('Failed to fetch attendance:', error)
      setAttendance([])
      setAttendanceData({})
    }
  }

  const handleDateChange = (date) => {
    const dateStr = date.target.value
    setSelectedDate(dateStr)
    fetchAttendanceForDate(dateStr)
  }

  const handleCourseChange = (course) => {
    setSelectedCourse(course)
  }

  const handleMarkAttendance = (studentId, status) => {
    const newAttendanceData = {
      ...attendanceData,
      [studentId]: {
        studentId,
        date: selectedDate,
        courseId: selectedCourse,
        status,
        markedBy: user.id,
        markedAt: new Date().toISOString()
      }
    }
    
    setAttendanceData(newAttendanceData)
  }

  const handleSaveAttendance = async () => {
    try {
      setLoading(true)
      
      // Convert attendance data object to array
      const attendanceRecords = Object.values(attendanceData)
      
      console.log('Saving attendance records:', attendanceRecords.length)
      
      // Save all attendance records with correct backend format
      for (const record of attendanceRecords) {
        const attendanceData = {
          student: { id: record.studentId },           // Backend expects Student object
          course: { id: record.courseId },             // Backend expects Course object
          date: record.date,                           // LocalDate format
          present: record.status === 'present',        // Backend expects Boolean
          markedBy: user?.name || 'Teacher'            // Backend expects markedBy field
        }
        
        console.log('Sending attendance data:', JSON.stringify(attendanceData, null, 2))
        
        const response = await attendanceAPI.markAttendance(attendanceData)
        console.log('Attendance saved response:', response)
      }
      
      alert('Attendance saved successfully!')
      
      // Refresh attendance data
      await fetchAttendanceForDate(selectedDate)
    } catch (error) {
      console.error('Failed to save attendance:', error)
      console.error('Error details:', error.response?.data)
      console.error('Full error:', error)
      
      // More specific error message
      if (error.response?.status === 500) {
        alert('Server error: Student or Course not found. Please check the data and try again.')
      } else {
        alert('Failed to save attendance. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800'
      case 'absent': return 'bg-red-100 text-red-800'
      case 'late': return 'bg-yellow-100 text-yellow-800'
      case 'excused': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'present': return 'Present'
      case 'absent': return 'Absent'
      case 'late': return 'Late'
      case 'excused': return 'Excused'
      default: return 'Not Marked'
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Manage Attendance</h1>
          <p className="text-gray-600">Mark and manage student attendance</p>
        </div>
        <button
          onClick={handleSaveAttendance}
          disabled={loading}
          className="btn btn-primary flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Attendance
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.courseCode})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Search Students</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {student.user?.name || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {student.user?.email || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.rollNumber || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {['present', 'absent', 'late', 'excused'].map(status => (
                          <button
                            key={status}
                            onClick={() => handleMarkAttendance(student.id, status)}
                            className={`px-3 py-1 text-xs font-medium rounded-full ${
                              attendanceData[student.id]?.status === status
                                ? 'ring-2 ring-offset-2 ' + getStatusColor(status)
                                : getStatusColor(status)
                            }`}
                          >
                            {getStatusText(status)}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getStatusText(attendanceData[student.id]?.status || 'Not Marked')}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No students found</p>
                    <p className="text-sm text-gray-400">
                      {searchTerm === '' 
                        ? 'No students found.'
                        : 'No students match your search.'
                      }
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Summary */}
      {Object.keys(attendanceData).length > 0 && (
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Attendance Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['present', 'absent', 'late', 'excused'].map(status => {
              const count = Object.values(attendanceData).filter(record => record.status === status).length
              return (
                <div key={status} className="text-center">
                  <div className={`text-2xl font-bold ${getStatusColor(status).split(' ')[0]}`}>
                    {count}
                  </div>
                  <div className="text-sm text-gray-600">
                    {getStatusText(status)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageAttendance