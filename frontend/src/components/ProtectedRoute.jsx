import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'

export const ProtectedRoute = ({ children, role }) => {
  const { user, token, loading } = useAuth()
  const location = useLocation()

  useEffect(() => {
    // Check if we're in a redirect loop
    const loginAttempts = parseInt(sessionStorage.getItem('loginAttempts') || '0')
    if (location.pathname === '/login' && loginAttempts > 2) {
      console.log('Too many login attempts, clearing storage')
      localStorage.clear()
      sessionStorage.clear()
      sessionStorage.setItem('loginAttempts', '0')
    }
  }, [location.pathname])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!token || !user) {
    // Increment login attempts
    const loginAttempts = parseInt(sessionStorage.getItem('loginAttempts') || '0') + 1
    sessionStorage.setItem('loginAttempts', loginAttempts.toString())
    
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  // Reset login attempts on successful access
  sessionStorage.setItem('loginAttempts', '0')

  return children
}
