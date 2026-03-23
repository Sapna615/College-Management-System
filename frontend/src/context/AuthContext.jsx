import { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null }
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        user: action.payload.user, 
        token: action.payload.token, 
        isAuthenticated: true,
        error: null 
      }
    case 'LOGIN_FAILURE':
      return { 
        ...state, 
        loading: false, 
        error: action.payload, 
        isAuthenticated: false 
      }
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        token: null, 
        isAuthenticated: false,
        error: null 
      }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    case 'UPDATE_USER':
      return { ...state, user: action.payload }
    default:
      return state
  }
}

const initialState = {
  user: JSON.parse(localStorage.getItem('user')),
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null
}

// Validate token on initialization
const validateToken = (token) => {
  if (!token) return false
  
  try {
    // Simple JWT validation - check if token has 3 parts and basic structure
    const parts = token.split('.')
    if (parts.length !== 3) return false
    
    // Check if token is expired (basic check)
    const payload = JSON.parse(atob(parts[1]))
    const now = Date.now() / 1000
    if (payload.exp && payload.exp < now) {
      console.log('Token expired, removing from localStorage')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return false
    }
    
    return true
  } catch (error) {
    console.error('Token validation failed:', error)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return false
  }
}

const getValidInitialState = () => {
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))
  
  if (!validateToken(token)) {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null
    }
  }
  
  return {
    user,
    token,
    isAuthenticated: !!user,
    loading: false,
    error: null
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, getValidInitialState())

  useEffect(() => {
    if (state.token) {
      localStorage.setItem('token', state.token)
    } else {
      localStorage.removeItem('token')
    }
  }, [state.token])

  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user))
    } else {
      localStorage.removeItem('user')
    }
  }, [state.user])

  const login = async (credentials) => {
    try {
      dispatch({ type: 'LOGIN_START' })
      const response = await authAPI.login(credentials)
      
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { 
          user: response.user, 
          token: response.accessToken 
        } 
      })
      
      toast.success('Login successful!')
      return response
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      dispatch({ type: 'LOGIN_FAILURE', payload: message })
      toast.error(message)
      throw error
    }
  }

  const register = async (userData) => {
    try {
      dispatch({ type: 'LOGIN_START' })
      const response = await authAPI.register(userData)
      
      toast.success('Registration successful! Please login.')
      return response
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      dispatch({ type: 'LOGIN_FAILURE', payload: message })
      toast.error(message)
      throw error
    }
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
    toast.success('Logged out successfully')
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData })
  }

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
