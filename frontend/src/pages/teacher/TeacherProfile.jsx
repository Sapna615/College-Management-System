import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { teacherAPI, userAPI } from '../../services/api'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit2,
  Save,
  X,
  Loader2
} from 'lucide-react'

const TeacherProfile = () => {
  const { user, updateUser } = useAuth()
  const [profileData, setProfileData] = useState(null)
  const [teacherData, setTeacherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    employeeId: '',
    department: '',
    specialization: '',
    qualification: '',
    experienceYears: ''
  })

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      console.log('Fetching teacher profile data...')
      
      // First check if user is available
      if (!user) {
        console.error('No user found in auth context')
        alert('Please log in again.')
        setLoading(false)
        return
      }
      
      console.log('Current user:', user)
      
      const [userProfile, teacherProfile] = await Promise.all([
        userAPI.getCurrentUser(),
        teacherAPI.getCurrentTeacherProfile()
      ])
      
      console.log('User profile response:', userProfile)
      console.log('Teacher profile response:', teacherProfile)
      console.log('User profile type:', typeof userProfile)
      console.log('Teacher profile type:', typeof teacherProfile)
      console.log('Teacher profile keys:', teacherProfile ? Object.keys(teacherProfile) : 'null')
      
      if (!userProfile) {
        console.error('User profile is null or undefined')
        alert('Failed to load user profile. Please try again.')
        setLoading(false)
        return
      }
      
      if (!teacherProfile) {
        console.error('Teacher profile is null or undefined')
        alert('Failed to load teacher profile. Please try again.')
        setLoading(false)
        return
      }
      
      setProfileData(userProfile)
      setTeacherData(teacherProfile)
      
      if (teacherProfile) {
        setFormData({
          name: userProfile?.name || '',
          email: userProfile?.email || '',
          phoneNumber: userProfile?.phoneNumber || '',
          address: userProfile?.address || '',
          employeeId: teacherProfile?.employeeId || '',
          department: teacherProfile?.department || '',
          specialization: teacherProfile?.specialization || '',
          qualification: teacherProfile?.qualification || '',
          experienceYears: teacherProfile?.experienceYears?.toString() || ''
        })
      }
    } catch (error) {
      console.error('Failed to fetch profile data:', error)
      console.error('Error details:', error.response?.data || error.message)
      alert('Failed to load profile data. Please try again.')
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

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (teacherData) {
      setFormData({
        name: profileData?.name || '',
        email: profileData?.email || '',
        phoneNumber: profileData?.phoneNumber || '',
        address: profileData?.address || '',
        employeeId: teacherData?.employeeId || '',
        department: teacherData?.department || '',
        specialization: teacherData?.specialization || '',
        qualification: teacherData?.qualification || '',
        experienceYears: teacherData?.experienceYears?.toString() || ''
      })
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      // Update user basic info
      await userAPI.updateMyProfile({
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        address: formData.address
      })
      
      // Update teacher specific info
      if (teacherData?.id) {
        await teacherAPI.updateTeacher(teacherData.id, {
          employeeId: formData.employeeId,
          department: formData.department,
          specialization: formData.specialization,
          qualification: formData.qualification,
          experienceYears: parseInt(formData.experienceYears) || 0
        })
      }
      
      // Update user context with new profile data
      const updatedUser = await userAPI.getCurrentUser()
      updateUser(updatedUser)
      
      // Refresh data
      await fetchProfileData()
      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!teacherData && !loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your profile information</p>
        </div>
        
        <div className="card">
          <div className="text-center py-12">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No profile data found</p>
            <p className="text-sm text-gray-400">
              Please contact the administrator to set up your teacher profile.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your profile information</p>
      </div>
      
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
          {!isEditing ? (
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="btn btn-primary flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange(e)}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange(e)}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange(e)}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => handleInputChange(e)}
              disabled={!isEditing}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Employee ID</label>
            <input
              type="text"
              value={formData.employeeId}
              onChange={(e) => handleInputChange(e)}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => handleInputChange(e)}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Specialization</label>
            <input
              type="text"
              value={formData.specialization}
              onChange={(e) => handleInputChange(e)}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Qualification</label>
            <input
              type="text"
              value={formData.qualification}
              onChange={(e) => handleInputChange(e)}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Experience (Years)</label>
            <input
              type="number"
              value={formData.experienceYears}
              onChange={(e) => handleInputChange(e)}
              disabled={!isEditing}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
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
  )
}

export default TeacherProfile
