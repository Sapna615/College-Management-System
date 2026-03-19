import { useState, useEffect } from 'react'
import { resultAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { 
  FileText, 
  TrendingUp,
  Calendar,
  Award,
  BookOpen,
  Filter,
  ArrowUpDown
} from 'lucide-react'

const StudentResults = () => {
  const { user } = useAuth()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      console.log('Fetching student results...')
      const data = await resultAPI.getMyResults()
      console.log('Results fetched:', data)
      setResults(data || [])
    } catch (error) {
      console.error('Failed to fetch results:', error)
      alert('Failed to load results. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredResults = results.filter(result => {
    if (filter === 'all') return true
    if (filter === 'excellent') return result.grade?.match(/^[AAB]/)
    if (filter === 'good') return result.grade?.match(/^[BC]/)
    if (filter === 'average') return result.grade?.match(/^[CD]/)
    return true
  })

  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.examDate || 0) - new Date(a.examDate || 0)
    if (sortBy === 'marks') return b.marks - a.marks
    if (sortBy === 'grade') return a.grade?.localeCompare(b.grade)
    return 0
  })

  const calculateStats = () => {
    if (results.length === 0) return { average: 0, highest: 0, lowest: 0 }
    
    const marks = results.map(r => r.marks || 0)
    const average = marks.reduce((a, b) => a + b, 0) / marks.length
    const highest = Math.max(...marks)
    const lowest = Math.min(...marks)
    
    return { average, highest, lowest }
  }

  const stats = calculateStats()

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
        <h1 className="text-2xl font-bold text-gray-900">Results</h1>
        <p className="text-gray-600">View your academic results and grades</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Marks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.average.toFixed(1)}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Highest Score</p>
              <p className="text-2xl font-bold text-gray-900">{stats.highest}</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-100">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Results</p>
              <p className="text-2xl font-bold text-gray-900">{results.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Grades</option>
              <option value="excellent">Excellent (A+, A, A-)</option>
              <option value="good">Good (B+, B, B-)</option>
              <option value="average">Average (C+, C, C-)</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="date">Sort by Date</option>
              <option value="marks">Sort by Marks</option>
              <option value="grade">Sort by Grade</option>
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
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exam Type
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedResults.length > 0 ? (
                sortedResults.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50">
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No results found</p>
                    <p className="text-sm text-gray-400">
                      {filter === 'all' 
                        ? 'You haven\'t received any results yet.' 
                        : `No ${filter} results found.`
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

export default StudentResults