import { useState, useEffect } from 'react'
import { resultAPI, courseAPI, studentAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  FileText, 
  Plus,
  Search,
  Filter,
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  Edit2,
  Trash2,
  Save
} from 'lucide-react'

const ManageResults = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [results, setResults] = useState([])
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedResult, setSelectedResult] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    marks: '',
    grade: '',
    examType: '',
    semester: '',
    studentId: '',
    courseId: ''
  })
  const [filter, setFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchInitialData()
  }, [])

  const fetchInitialData = async () => {
    try {
      console.log('Fetching teacher initial data...')
      const [resultsData, coursesData, studentsData] = await Promise.all([
        resultAPI.getAllResultsForTeacher(),
        courseAPI.getAllCourses(),
        studentAPI.getAllStudents()
      ])
      
      console.log('Results:', resultsData?.length || 0)
      console.log('Courses:', coursesData?.length || 0)
      console.log('Students:', studentsData?.length || 0)
      
      setResults(resultsData || [])
      setCourses(coursesData || [])
      setStudents(studentsData || [])
    } catch (error) {
      console.error('Failed to fetch initial data:', error)
      alert('Failed to load data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateResult = () => {
    setSelectedResult(null)
    setIsEditing(true)
    setFormData({
      marks: '',
      grade: '',
      examType: '',
      semester: '',
      studentId: '',
      courseId: ''
    })
  }

  const handleEditResult = (result) => {
    setSelectedResult(result)
    setIsEditing(true)
    setFormData({
      marks: result.marks || '',
      grade: result.grade || '',
      examType: result.examType || '',
      semester: result.semester || '',
      studentId: result.student?.id || '',
      courseId: result.course?.id || ''
    })
  }

  const handleDeleteResult = async (id) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      try {
        await resultAPI.deleteResult(id)
        setResults(results.filter(r => r.id !== id))
        alert('Result deleted successfully')
      } catch (error) {
        console.error('Failed to delete result:', error)
        alert('Failed to delete result')
      }
    }
  }

  const handleSaveResult = async () => {
    try {
      setLoading(true)
      
      if (selectedResult) {
        // Update existing result
        await resultAPI.updateResult(selectedResult.id, formData)
        setResults(results.map(r => 
          r.id === selectedResult.id ? { ...r, ...formData } : r
        ))
        alert('Result updated successfully')
      } else {
        // Create new result
        const resultData = {
          ...formData,
          marks: parseInt(formData.marks),
          semester: parseInt(formData.semester)
        }
        await resultAPI.createResult(resultData)
        setResults([resultData, ...results])
        alert('Result created successfully')
      }
      
      setIsEditing(false)
      setSelectedResult(null)
      setFormData({
        marks: '',
        grade: '',
        examType: '',
        semester: '',
        studentId: '',
        courseId: ''
      })
    } catch (error) {
      console.error('Failed to save result:', error)
      alert('Failed to save result')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setSelectedResult(null)
    setFormData({
      marks: '',
      grade: '',
      examType: '',
      semester: '',
      studentId: '',
      courseId: ''
    })
  }

  const filteredResults = results.filter(result => {
    const matchesSearch = result.student?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        result.course?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        result.grade?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === '' || result.examType?.toLowerCase() === filter.toLowerCase()
    return matchesSearch && matchesFilter
  })

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
          <h1 className="text-2xl font-bold text-gray-900">Manage Results</h1>
          <p className="text-gray-600">Upload and manage student results</p>
        </div>
        <button
          onClick={handleCreateResult}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Result
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search results..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Types</option>
              <option value="mid term">Mid Term</option>
              <option value="final term">Final Term</option>
              <option value="assignment">Assignment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.length > 0 ? (
                filteredResults.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {result.student?.user?.name || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {result.student?.rollNumber || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {result.course?.name || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {result.course?.courseCode || ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {result.examType || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{result.marks || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        result.grade?.match(/^[AAB]/) ? 'bg-green-100 text-green-800' :
                        result.grade?.match(/^[BC]/) ? 'bg-blue-100 text-blue-800' :
                        result.grade?.match(/^[CD]/) ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {result.grade || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{result.semester || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditResult(result)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteResult(result.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No results found</p>
                    <p className="text-sm text-gray-400">
                      {filter === '' && searchTerm === '' 
                        ? 'No results found. Create your first result above.'
                        : 'No results match your filters.'
                      }
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(isEditing || selectedResult) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full m-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {selectedResult ? 'Edit Result' : 'Create New Result'}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveResult(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Student</label>
                  <select
                    value={formData.studentId}
                    onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.user?.name} ({student.rollNumber})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Course</label>
                  <select
                    value={formData.courseId}
                    onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.name} ({course.courseCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Exam Type</label>
                  <select
                    value={formData.examType}
                    onChange={(e) => setFormData({...formData, examType: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="mid term">Mid Term</option>
                    <option value="final term">Final Term</option>
                    <option value="assignment">Assignment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Marks</label>
                  <input
                    type="number"
                    value={formData.marks}
                    onChange={(e) => setFormData({...formData, marks: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                    min="0"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Grade</label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Semester</label>
                  <input
                    type="number"
                    value={formData.semester}
                    onChange={(e) => setFormData({...formData, semester: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    required
                    min="1"
                    max="8"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageResults