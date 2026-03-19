import { useState, useEffect } from 'react'
import { timetableAPI, courseAPI, teacherAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Calendar, 
  Clock, 
  MapPin,
  BookOpen,
  Search,
  Filter
} from 'lucide-react'

const TeacherTimetable = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [timetables, setTimetables] = useState([])
  const [courses, setCourses] = useState([])
  const [teacherProfile, setTeacherProfile] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(location.state?.selectedCourse || null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDay, setSelectedDay] = useState('')

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      console.log('Fetching teacher timetable data...')
      const [timetablesData, coursesData, teacherData] = await Promise.all([
        timetableAPI.getAllTimetables(),
        courseAPI.getAllCourses(),
        teacherAPI.getCurrentTeacherProfile()
      ])
      
      console.log('All Timetables:', timetablesData?.length || 0)
      console.log('Courses:', coursesData?.length || 0)
      console.log('Teacher Profile:', teacherData)
      
      setTimetables(timetablesData || [])
      setCourses(coursesData || [])
      setTeacherProfile(teacherData)
    } catch (error) {
      console.error('Failed to fetch initial data:', error)
      alert('Failed to load data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredTimetables = timetables.filter(timetable => {
    // Filter to show ONLY this teacher's timetable
    const isMyTimetable = teacherProfile?.user?.id && 
      (timetable.teacherName === teacherProfile.user.name || 
       (timetable.teacher?.user?.name === teacherProfile.user.name))
    
    console.log('Checking timetable:', {
      subject: timetable.subject,
      teacherName: timetable.teacherName,
      teacherProfileName: teacherProfile?.user?.name,
      isMyTimetable
    })
    
    const matchesSearch = !searchTerm || 
      timetable.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      timetable.room?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDay = !selectedDay || timetable.dayOfWeek?.toLowerCase() === selectedDay.toLowerCase()
    const matchesCourse = !selectedCourse || 
      timetable.subject === selectedCourse.name ||
      timetable.subject?.toLowerCase().includes(selectedCourse.name?.toLowerCase() || '')
    
    console.log('Filter results:', {
      matchesSearch,
      matchesDay,
      matchesCourse,
      searchTerm,
      selectedDay,
      selectedCourse
    })
    
    return isMyTimetable && matchesSearch && matchesDay && matchesCourse
  })

  // Get unique subjects from timetables for dropdown
  const uniqueSubjects = [...new Set(timetables.map(t => t.subject).filter(Boolean))]

  const getDayName = (dayValue) => {
  // Handle if dayValue is already a number
  if (typeof dayValue === 'number') {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[dayValue] || 'Unknown'
  }
  
  // Handle if dayValue is a string (day name)
  if (typeof dayValue === 'string') {
    return dayValue
  }
  
  // Handle if dayValue is a string number
  if (typeof dayValue === 'string' && !isNaN(dayValue)) {
    const dayNum = parseInt(dayValue)
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return days[dayNum] || 'Unknown'
  }
  
  return 'Unknown'
}

  const getTimeSlot = (startTime, endTime) => {
    return `${startTime} - ${endTime}`
  }

  const handleViewStudents = (course) => {
    navigate('/teacher/students', { state: { selectedCourse: course } })
  }

  const handleViewResults = (course) => {
    navigate('/teacher/results', { state: { selectedCourse: course } })
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
          <h1 className="text-2xl font-bold text-gray-900">My Timetable</h1>
          <p className="text-gray-600">
            {selectedCourse ? `Schedule for ${selectedCourse.name || selectedCourse}` : 'Your teaching schedule'}
          </p>
          {teacherProfile && (
            <p className="text-sm text-blue-600 font-medium">
              Showing only your classes (Teacher ID: {teacherProfile.employeeId})
            </p>
          )}
        </div>
        {selectedCourse && (
          <button
            onClick={() => setSelectedCourse(null)}
            className="btn btn-secondary"
          >
            Clear Course Filter
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search by course, room..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Filter by Day</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">All Days</option>
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
              <option value="wednesday">Wednesday</option>
              <option value="thursday">Thursday</option>
              <option value="friday">Friday</option>
              <option value="saturday">Saturday</option>
              <option value="sunday">Sunday</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Filter by Subject</label>
            <select
              value={selectedCourse?.name || ''}
              onChange={(e) => {
                const subject = uniqueSubjects.find(s => s === e.target.value)
                setSelectedCourse(subject ? {name: subject, courseCode: ''} : null)
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">All Subjects</option>
              {uniqueSubjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Day
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teacher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTimetables.length > 0 ? (
                filteredTimetables.map((timetable, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getDayName(timetable.dayOfWeek) || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-500 mr-2" />
                        <div className="text-sm text-gray-900">
                          {getTimeSlot(timetable.startTime, timetable.endTime) || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {timetable.subject || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        Course Code: {selectedCourse?.courseCode || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                        <div className="text-sm text-gray-900">{timetable.room || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {teacherProfile?.user?.name || timetable.teacherName || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {teacherProfile?.employeeId || timetable.teacherName || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewStudents({name: timetable.subject, courseCode: selectedCourse?.courseCode})}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Students"
                        >
                          <BookOpen className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No timetable entries found</p>
                    <p className="text-sm text-gray-400">
                      {teacherProfile 
                        ? 'No classes assigned to you yet. Contact admin to get your teaching schedule.'
                        : 'Please log in to view your teaching schedule.'
                      }
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">My Classes</p>
              <p className="text-2xl font-bold text-gray-900">{filteredTimetables.length}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Teaching Hours</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredTimetables.length * 1.5}h {/* Assuming 1.5 hours per class */}
              </p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Courses Teaching</p>
              <p className="text-2xl font-bold text-gray-900">
                {[...new Set(filteredTimetables.map(t => t.subject).filter(Boolean))].size}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherTimetable