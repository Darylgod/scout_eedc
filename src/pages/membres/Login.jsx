import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../utils/api'
import logo from '../../assets/logo.png'
import '../../styles/membres.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/auth/login', { email, password })
      login(response.data.user, response.data.token)
      
      if (response.data.user.role === 'superadmin' || response.data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/membres')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <img src={logo} alt="EEDC" className="login-logo" />
            <h1>Connexion</h1>
            <p>Accédez à votre espace membre</p>
          </div>

          {error && <div className="alert error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="votre@email.com"
              />
            </div>

            <div className="form-group">
              <label>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter →'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Pas encore de compte ?{' '}
              <Link to="/rejoindre">Créer un compte</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}