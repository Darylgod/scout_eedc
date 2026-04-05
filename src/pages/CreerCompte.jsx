import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'
import '../styles/hero.css'
import '../styles/cards.css'

export default function CreerCompte() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [invitation, setInvitation] = useState(null)
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const checkInvitation = async () => {
      try {
        const response = await api.get(`/invitations/${token}`)
        setInvitation(response.data)
      } catch (err) {
        setError('Lien invalide ou expiré')
      } finally {
        setLoading(false)
      }
    }
    checkInvitation()
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }
    
    setLoading(true)
    
    try {
      await api.post(`/invitations/${token}/creer-compte`, {
        password: formData.password
      })
      setSuccess('Compte créé avec succès ! Redirection...')
      setTimeout(() => {
        navigate('/connexion')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création du compte')
    } finally {
      setLoading(false)
    }
  }

  if (loading && !invitation && !error) {
    return (
      <div className="loading-screen">
        <div className="spinner">Chargement...</div>
      </div>
    )
  }

  if (error && !invitation) {
    return (
      <div className="error-screen">
        <div className="container">
          <h1>Lien invalide</h1>
          <p>{error}</p>
          <Link to="/" className="btn btn-primary">Retour à l'accueil</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="create-account-page">
      <div className="create-account-container">
        <div className="create-account-card">
          <div className="create-account-header">
            <div className="create-account-icon">⚜️</div>
            <h1>Créer votre compte</h1>
            <p>
              Bienvenue {invitation?.prenom} {invitation?.nom}
            </p>
            <small>Rôle: {invitation?.role === 'admin' ? 'Administrateur' : 'Chef d\'unité'}</small>
          </div>

          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Mot de passe *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Minimum 6 caractères"
              />
            </div>

            <div className="form-group">
              <label>Confirmer le mot de passe *</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Création en cours...' : 'Créer mon compte'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}