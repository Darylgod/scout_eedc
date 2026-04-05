import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function AdminRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div>Chargement...</div>
      </div>
    )
  }

  const isAdmin = user?.role === 'superadmin' || user?.role === 'admin'
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />
}