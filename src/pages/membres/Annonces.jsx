import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../utils/api'
import { formatDate } from '../../utils/formatDate'
import { ANNOUNCE_TYPES } from '../../utils/constants'
import '../../styles/membres.css'

export default function Annonces() {
  const { user } = useAuth()
  const [annonces, setAnnonces] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnnonces = async () => {
      try {
        const response = await api.get('/annonces')
        setAnnonces(response.data)
      } catch (error) {
        console.error('Erreur chargement annonces:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAnnonces()
  }, [])

  const getAnnounceTypeStyle = (type) => {
    switch(type) {
      case 'urgence':
        return { background: '#FFE5E5', color: '#CC0000', borderLeft: '4px solid #CC0000' }
      case 'important':
        return { background: '#FFF3CD', color: '#D4A017', borderLeft: '4px solid #D4A017' }
      default:
        return { background: '#F5F5F5', color: '#003087', borderLeft: '4px solid #003087' }
    }
  }

  const getAnnounceIcon = (type) => {
    switch(type) {
      case 'urgence': return '🚨'
      case 'important': return '⚠️'
      default: return 'ℹ️'
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
          <Link to="/membres/annonces" className="membres-nav-item active">📢 Annonces DEX</Link>
          <Link to="/membres/profil" className="membres-nav-item">👤 Mon profil</Link>
        </nav>
      </aside>

      <main className="membres-main">
        <h1>Annonces DEX</h1>
        <p>Direction Exécutive - Informations officielles et communications importantes</p>

        {loading ? (
          <div className="loading">Chargement...</div>
        ) : annonces.length === 0 ? (
          <div className="empty-state">
            <p>Aucune annonce pour le moment.</p>
          </div>
        ) : (
          <div className="annonces-list">
            {annonces.map(annonce => (
              <div key={annonce.id} className="annonce-card" style={getAnnounceTypeStyle(annonce.type)}>
                <div className="annonce-header">
                  <span className="annonce-icon">{getAnnounceIcon(annonce.type)}</span>
                  <h3>{annonce.titre}</h3>
                </div>
                <p className="annonce-content">{annonce.contenu}</p>
                <div className="annonce-footer">
                  <span className="annonce-date">Publiée le {formatDate(annonce.created_at)}</span>
                  {annonce.date_expiration && (
                    <span className="annonce-expiration">
                      Expire le {formatDate(annonce.date_expiration)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}