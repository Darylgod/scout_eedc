import { createContext, useState, useEffect } from 'react'
import api from '../utils/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('eedc_token'))

  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem('eedc_user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [token])

  const login = (userData, newToken) => {
    localStorage.setItem('eedc_token', newToken)
    localStorage.setItem('eedc_user', JSON.stringify(userData))
    setToken(newToken)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('eedc_token')
    localStorage.removeItem('eedc_user')
    setToken(null)
    setUser(null)
  }

  const updateUser = (data) => {
    const updatedUser = { ...user, ...data }
    localStorage.setItem('eedc_user', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, token }}>
      {children}
    </AuthContext.Provider>
  )
}