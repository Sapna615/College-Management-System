import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { userAPI, studentAPI } from '../../services/api'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen,
  Edit2,
  Save,
  X,
  Loader2
} from 'lucide-react'

const StudentProfile = () => {
  const { user, updateUser } = useAuth()
  const [profileData, setProfileData] = useState(null)
  const [studentData, setStudentData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    rollNumber: '',
    department: '',
    currentSemester: 1,
    dateOfBirth: ''
  })

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      console.log('Fetching profile data...')
      const [userProfile, studentProfile] = await Promise.all([
        userAPI.getCurrentUser(),
        studentAPI.getCurrentStudentProfile()
      ])
      
      console.log('User profile:', userProfile)
      console.log('Student profile:', studentProfile)
      
      setProfileData(userProfile)
      setStudentData(studentProfile)
      
      // Combine data for form
      setFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        phoneNumber: userProfile.phoneNumber || '',
        address: userProfile.address || '',
        rollNumber: studentProfile?.rollNumber || '',
        department: studentProfile?.department || '',
        currentSemester: studentProfile?.currentSemester || 1,
        dateOfBirth: studentProfile?.dateOfBirth ? studentProfile.dateOfBirth.split('T')[0] : ''
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
      
      // Check if it's an authentication error
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('Authentication error, redirecting to login...')
        // Clear token and redirect to login
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return
      }
      
      alert('Error loading profile data: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    console.log('=== PROFILE SAVE DEBUG ===')
    console.log('Save button clicked!')
    console.log('Current user ID:', user?.id)
    console.log('Current student ID:', studentData?.id)
    console.log('Form data:', formData)
    console.log('Editing mode:', isEditing)
    
    try {
      setSaving(true)
      
      // Get current user to ensure we have the latest ID
      const currentUser = await userAPI.getCurrentUser()
      console.log('Current user from API:', currentUser)
      console.log('User ID from API:', currentUser?.id)
      
      if (!currentUser?.id) {
        console.error('ERROR: User ID not found in API response')
        throw new Error('User ID not found')
      }
      
      console.log('Saving profile data:', formData)
      console.log('User ID:', user?.id)
      console.log('Student ID:', studentData?.id)
      console.log('Token:', localStorage.getItem('token'))
      
      if (!user?.id) {
        throw new Error('User ID not found')
      }
      
      // Update user basic info
      console.log('Updating user profile...')
      await userAPI.updateMyProfile({
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        address: formData.address
      })
      
      console.log('User profile updated successfully!')
      
      // Handle student data - create if doesn't exist, update if it does
      if (studentData?.id) {
        console.log('Updating existing student record...')
        await studentAPI.updateStudent(studentData.id, {
          rollNumber: formData.rollNumber,
          department: formData.department,
          currentSemester: formData.currentSemester,
          dateOfBirth: formData.dateOfBirth
        })
      } else {
        console.log('Creating new student record...')
        // Create student record if it doesn't exist
        await studentAPI.createStudentProfile({
          rollNumber: formData.rollNumber,
          department: formData.department,
          currentSemester: formData.currentSemester,
          dateOfBirth: formData.dateOfBirth
        })
      }
      
      console.log('Student profile updated successfully!')
      
      // Update user context with new profile data
      const updatedUser = await userAPI.getCurrentUser()
      console.log('Updated user from API:', updatedUser)
      console.log('Current user in context before update:', user)
      
      // Alternative: Update user context directly with form data
      const mergedUser = {
        ...user,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        address: formData.address
      }
      console.log('Merged user data:', mergedUser)
      console.log('About to call updateUser with:', mergedUser.name)
      updateUser(mergedUser)
      console.log('Update user called with merged data')
      
      // Also update localStorage directly as backup
      localStorage.setItem('user', JSON.stringify(mergedUser))
      console.log('localStorage updated directly')
      
      // Refresh data
      await fetchProfileData()
      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      console.error('Error response:', error.response?.data)
      
      // Check if it's an authentication error
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('Your session has expired. Please login again.')
        // Clear token and redirect to login
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return
      }
      
      alert('Error updating profile: ' + (error.response?.data?.message || error.message))
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    // Reset form data
    if (profileData && studentData) {
      setFormData({
        name: profileData.name || '',
        email: profileData.email || '',
        phoneNumber: profileData.phoneNumber || '',
        address: profileData.address || '',
        rollNumber: studentData.rollNumber || '',
        department: studentData.department || '',
        currentSemester: studentData.currentSemester || 1,
        dateOfBirth: studentData.dateOfBirth ? studentData.dateOfBirth.split('T')[0] : ''
      })
    }
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">View and update your profile information</p>
          {/* Debug info */}
          <div className="text-xs text-gray-500 mt-2">
            Debug: User ID: {user?.id}, Student ID: {studentData?.id}, Editing: {isEditing.toString()}, Saving: {saving.toString()}
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="card">
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{formData.name}</h2>
              <p className="text-gray-600">Student • {formData.department}</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Full Name"
                      />
                    ) : (
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-medium">{formData.name}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <div>
                      <p className="text-sm text-gray-600">Email Address</p>
                      <p className="font-medium">{formData.email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Phone Number"
                      />
                    ) : (
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-medium">{formData.phoneNumber || 'Not provided'}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    {isEditing ? (
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="input-field"
                        rows="2"
                        placeholder="Address"
                      />
                    ) : (
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium">{formData.address || 'Not provided'}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    ) : (
                      <div>
                        <p className="text-sm text-gray-600">Date of Birth</p>
                        <p className="font-medium">{formData.dateOfBirth || 'Not provided'}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Academic Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        name="rollNumber"
                        value={formData.rollNumber}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Roll Number"
                      />
                    ) : (
                      <div>
                        <p className="text-sm text-gray-600">Roll Number</p>
                        <p className="font-medium">{formData.rollNumber}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    {isEditing ? (
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        <option value="">Select Department</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Electrical Engineering">Electrical Engineering</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Civil Engineering">Civil Engineering</option>
                        <option value="Information Technology">Information Technology</option>
                      </select>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-600">Department</p>
                        <p className="font-medium">{formData.department}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    {isEditing ? (
                      <select
                        name="currentSemester"
                        value={formData.currentSemester}
                        onChange={handleInputChange}
                        className="input-field"
                      >
                        <option value={1}>Semester 1</option>
                        <option value={2}>Semester 2</option>
                        <option value={3}>Semester 3</option>
                        <option value={4}>Semester 4</option>
                        <option value={5}>Semester 5</option>
                        <option value={6}>Semester 6</option>
                        <option value={7}>Semester 7</option>
                        <option value={8}>Semester 8</option>
                      </select>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-600">Current Semester</p>
                        <p className="font-medium">Semester {formData.currentSemester}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={handleCancel}
                className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center gap-2"
                disabled={saving}
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudentProfile