import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function PrivateRoute() {
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

  return user ? <Outlet /> : <Navigate to="/connexion" replace />
}