import { useState, useEffect } from 'react'
import { Clock, Calendar, BookOpen, MapPin, User } from 'lucide-react'
import { timetableAPI } from '../../services/api'

const StudentTimetable = () => {
  const [timetables, setTimetables] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState('ALL')

  const days = ['ALL', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
  const dayColors = {
    MONDAY: 'bg-blue-100 text-blue-800',
    TUESDAY: 'bg-green-100 text-green-800',
    WEDNESDAY: 'bg-yellow-100 text-yellow-800',
    THURSDAY: 'bg-purple-100 text-purple-800',
    FRIDAY: 'bg-red-100 text-red-800',
    SATURDAY: 'bg-indigo-100 text-indigo-800',
    SUNDAY: 'bg-gray-100 text-gray-800'
  }

  useEffect(() => {
    fetchTimetable()
  }, [])

  const fetchTimetable = async () => {
    try {
      setLoading(true)
      const data = await timetableAPI.getMyTimetable()
      console.log('Student timetable data:', data)
      console.log('Number of timetables:', data.length)
      if (data.length > 0) {
        console.log('First timetable:', data[0])
      }
      setTimetables(data)
    } catch (error) {
      console.error('Error fetching timetable:', error)
      console.error('Error details:', error.response?.data)
    } finally {
      setLoading(false)
    }
  }

  const filteredTimetables = selectedDay === 'ALL' 
    ? timetables 
    : timetables.filter(t => t.dayOfWeek === selectedDay)

  const groupedTimetables = filteredTimetables.reduce((acc, timetable) => {
    if (!acc[timetable.dayOfWeek]) {
      acc[timetable.dayOfWeek] = []
    }
    acc[timetable.dayOfWeek].push(timetable)
    return acc
  }, {})

  const sortByTime = (a, b) => {
    const timeA = parseInt(a.startTime.replace(':', ''))
    const timeB = parseInt(b.startTime.replace(':', ''))
    return timeA - timeB
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timetable</h1>
          <p className="text-gray-600">View your class schedule</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-400" />
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {days.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
      </div>

      {timetables.length === 0 ? (
        <div className="card">
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No timetable entries found.</p>
            <p className="text-sm text-gray-400 mt-2">
              Your timetable will appear here once admin adds your class schedule.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTimetables)
            .sort(([dayA], [dayB]) => days.indexOf(dayA) - days.indexOf(dayB))
            .map(([day, dayTimetables]) => (
              <div key={day} className="card">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${dayColors[day]}`}>
                    {day}
                  </span>
                  <span className="text-sm text-gray-500">
                    {dayTimetables.length} class{dayTimetables.length > 1 ? 'es' : ''}
                  </span>
                </div>
                
                <div className="space-y-3">
                  {dayTimetables.sort(sortByTime).map((timetable, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="w-4 h-4 text-blue-600" />
                            <h4 className="font-medium text-gray-900">{timetable.subject}</h4>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{timetable.startTime} - {timetable.endTime}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{timetable.room}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{timetable.teacherName}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className="text-xs text-gray-500">Semester {timetable.semester}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default StudentTimetable