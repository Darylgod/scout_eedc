import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../utils/api'
import { BRANCHES } from '../../utils/constants'
import '../../styles/membres.css'

export default function MonProfil() {
  const { user, updateUser } = useAuth()
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    branche: '',
    unite: '',
    region: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      setFormData({
        nom: user.nom || '',
        prenom: user.prenom || '',
        telephone: user.telephone || '',
        branche: user.branche || '',
        unite: user.unite || '',
        region: user.region || ''
      })
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await api.put('/profile', formData)
      updateUser(formData)
      setMessage('Profil mis à jour avec succès !')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setError('Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="membres-layout">
      <aside className="membres-sidebar">
        <div className="membres-user-info">
          <div className="membres-avatar">
            {user?.prenom?.charAt(0)}{user?.nom?.charAt(0)}
          </div>
          <div className="membres-user-name">{user?.prenom} {user?.nom}</div>
          <div className="membres-user-role">
            {user?.role === 'superadmin' && 'Super Administrateur'}
            {user?.role === 'admin' && 'Administrateur'}
            {user?.role === 'chef' && 'Chef d\'unité'}
          </div>
        </div>

        <nav className="membres-nav">
          <Link to="/membres" className="membres-nav-item">📊 Tableau de bord</Link>
          <Link to="/membres/ressources" className="membres-nav-item">📚 Ressources PNJ</Link>
          <Link to="/membres/calendrier" className="membres-nav-item">📅 Calendrier</Link>
          <Link to="/membres/annonces" className="membres-nav-item">📢 Annonces DEX</Link>
          <Link to="/membres/profil" className="membres-nav-item active">👤 Mon profil</Link>
        </nav>
      </aside>

      <main className="membres-main">
        <h1>Mon profil</h1>
        <p>Gérez vos informations personnelles</p>

        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nom</label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData({...formData, nom: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Prénom</label>
              <input
                type="text"
                value={formData.prenom}
                onChange={(e) => setFormData({...formData, prenom: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="disabled"
            />
            <small>L'email ne peut pas être modifié</small>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Téléphone</label>
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({...formData, telephone: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Branche</label>
              <select
                value={formData.branche}
                onChange={(e) => setFormData({...formData, branche: e.target.value})}
              >
                <option value="">Sélectionnez une branche</option>
                {Object.entries(BRANCHES).map(([key, value]) => (
                  <option key={key} value={key}>{value.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Unité</label>
              <input
                type="text"
                placeholder="Nom de votre unité"
                value={formData.unite}
                onChange={(e) => setFormData({...formData, unite: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Région</label>
              <input
                type="text"
                placeholder="Votre région"
                value={formData.region}
                onChange={(e) => setFormData({...formData, region: e.target.value})}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer les modifications →'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}