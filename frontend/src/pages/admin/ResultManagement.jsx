import { useState, useEffect } from 'react'
import { resultAPI, studentAPI, courseAPI } from '../../services/api'
import { FileText, Plus, Edit, Trash2, Eye, X } from 'lucide-react'

const ResultManagement = () => {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingResult, setEditingResult] = useState(null)
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    marks: '',
    grade: '',
    semester: '',
    examType: ''
  })

  useEffect(() => {
    fetchResults()
    fetchStudents()
    fetchCourses()
  }, [])

  const fetchResults = async () => {
    try {
      const data = await resultAPI.getAllResults()
      setResults(data)
    } catch (error) {
      console.error('Failed to fetch results:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      console.log('Fetching students...')
      const data = await studentAPI.getAllStudents()
      console.log('Students fetched:', data)
      setStudents(data || [])
    } catch (error) {
      console.error('Failed to fetch students:', error)
      setStudents([])
    }
  }

  const fetchCourses = async () => {
    try {
      console.log('Fetching courses...')
      const data = await courseAPI.getAllCourses()
      console.log('Courses fetched:', data)
      setCourses(data || [])
    } catch (error) {
      console.error('Failed to fetch courses:', error)
      setCourses([])
    }
  }

  const handleAddResult = () => {
    setFormData({
      studentId: '',
      courseId: '',
      marks: '',
      grade: '',
      semester: '',
      examType: ''
    })
    setEditingResult(null)
    setShowAddModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Submitting result form with data:', formData)
    console.log('Students available:', students.length)
    console.log('Courses available:', courses.length)
    
    // Validate required fields
    if (!formData.studentId || !formData.courseId || !formData.marks || !formData.grade || !formData.semester || !formData.examType) {
      console.error('Missing required fields:', formData)
      alert('Please fill in all required fields')
      return
    }
    
    try {
      if (editingResult) {
        console.log('Updating result:', editingResult.id)
        await resultAPI.updateResult(editingResult.id, formData)
        alert('Result updated successfully')
      } else {
        console.log('Creating new result')
        await resultAPI.createResult(formData)
        alert('Result created successfully')
      }
      setShowAddModal(false)
      fetchResults()
      // Reset form
      setFormData({
        studentId: '',
        courseId: '',
        marks: '',
        grade: '',
        semester: '',
        examType: ''
      })
    } catch (error) {
      console.error('Error saving result:', error)
      alert('Failed to save result: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleEdit = (result) => {
    setFormData({
      studentId: result.student?.id || '',
      courseId: result.course?.id || '',
      marks: result.marks || '',
      grade: result.grade || '',
      semester: result.semester || '',
      examType: result.examType || ''
    })
    setEditingResult(result)
    setShowAddModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this result?')) {
      try {
        await resultAPI.deleteResult(id)
        fetchResults()
      } catch (error) {
        console.error('Error deleting result:', error)
      }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Result Management</h1>
          <p className="text-gray-600">Manage student results and grades</p>
        </div>
        <button 
          onClick={handleAddResult}
          className="btn btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Result
        </button>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingResult ? 'Edit Result' : 'Add New Result'}
              </h2>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Student</label>
                <select
                  required
                  value={formData.studentId}
                  onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">Select Student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.user?.name} ({student.rollNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Course</label>
                <select
                  required
                  value={formData.courseId}
                  onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name} ({course.courseCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Marks</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={formData.marks}
                  onChange={(e) => setFormData({...formData, marks: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Grade</label>
                <input
                  type="text"
                  required
                  value={formData.grade}
                  onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Semester</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="8"
                  value={formData.semester}
                  onChange={(e) => setFormData({...formData, semester: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Exam Type</label>
                <select
                  required
                  value={formData.examType}
                  onChange={(e) => setFormData({...formData, examType: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">Select Exam Type</option>
                  <option value="MID_TERM">Mid Term</option>
                  <option value="FINAL_TERM">Final Term</option>
                  <option value="PRACTICAL">Practical</option>
                  <option value="ASSIGNMENT">Assignment</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  {editingResult ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {result.student?.user?.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {result.student?.rollNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{result.course?.name}</div>
                    <div className="text-xs text-gray-500">{result.course?.courseCode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.marks}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.grade}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.semester}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.examType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleEdit(result)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(result.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ResultManagement
