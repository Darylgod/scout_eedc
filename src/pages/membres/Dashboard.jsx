import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../utils/api'
import '../../styles/membres.css'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    ressources: 0,
    evenements: 0,
    annonces: 0,
    formations: 0
  })
  const [recentRessources, setRecentRessources] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [unreadAnnonces, setUnreadAnnonces] = useState([])
  const [loading, setLoading] = useState(true)
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    // Définir le message de bienvenue selon l'heure
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Bonjour')
    else if (hour < 18) setGreeting('Bon après-midi')
    else setGreeting('Bonsoir')
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ressourcesRes, evenementsRes, annoncesRes] = await Promise.all([
          api.get('/ressources'),
          api.get('/evenements'),
          api.get('/annonces')
        ])
        
        // Filtrer les événements à venir
        const upcoming = evenementsRes.data.filter(e => new Date(e.date_debut) > new Date())
        
        setStats({
          ressources: ressourcesRes.data.length,
          evenements: upcoming.length,
          annonces: annoncesRes.data.length,
          formations: ressourcesRes.data.filter(r => r.type === 'formation').length
        })
        
        setRecentRessources(ressourcesRes.data.slice(0, 5))
        setUpcomingEvents(upcoming.slice(0, 3))
        setUnreadAnnonces(annoncesRes.data.slice(0, 3))
      } catch (error) {
        console.error('Erreur chargement dashboard:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const getRessourceIcon = (type) => {
    const icons = {
      document: '📄',
      video: '🎬',
      audio: '🎵',
      lien: '🔗',
      formation: '📚'
    }
    return icons[type] || '📄'
  }

  const getEventIcon = (type) => {
    const icons = {
      camp: '⛺',
      reunion: '🤝',
      formation: '📚',
      ceremonie: '🎖️',
      activite: '⚽'
    }
    return icons[type] || '📅'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
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
            {user?.role === 'superadmin' && '⭐ Super Administrateur'}
            {user?.role === 'admin' && '👑 Administrateur'}
            {user?.role === 'chef' && '🦁 Chef d\'unité'}
          </div>
        </div>

        <nav className="membres-nav">
          <Link to="/membres" className="membres-nav-item active">
            📊 Tableau de bord
          </Link>
          <Link to="/membres/ressources" className="membres-nav-item">
            📚 Ressources PNJ
          </Link>
          <Link to="/membres/calendrier" className="membres-nav-item">
            📅 Calendrier
          </Link>
          <Link to="/membres/annonces" className="membres-nav-item">
            📢 Annonces DEX
          </Link>
          <Link to="/membres/profil" className="membres-nav-item">
            👤 Mon profil
          </Link>
        </nav>

        <div className="membres-sidebar-footer">
          <Link to="/" className="btn-back-site">
            🏠 Retour au site
          </Link>
          <button onClick={handleLogout} className="btn-logout">
            🚪 Déconnexion
          </button>
        </div>
      </aside>

      <main className="membres-main">
        <div className="membres-header">
          <div>
            <h1>{greeting}, {user?.prenom} !</h1>
            <p className="welcome-text">Bienvenue sur votre espace personnel</p>
          </div>
          <Link to="/" className="btn-mobile-back">
            🏠 Site
          </Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-number">{stats.ressources}</div>
            <div className="stat-label">Ressources disponibles</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-number">{stats.evenements}</div>
            <div className="stat-label">Événements à venir</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📢</div>
            <div className="stat-number">{stats.annonces}</div>
            <div className="stat-label">Annonces non lues</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📖</div>
            <div className="stat-number">{stats.formations}</div>
            <div className="stat-label">Formations disponibles</div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="recent-section">
            <div className="section-header">
              <h2>📚 Ressources récentes</h2>
              <Link to="/membres/ressources" className="see-all">Voir tout →</Link>
            </div>
            
            {loading ? (
              <div className="loading">Chargement...</div>
            ) : recentRessources.length === 0 ? (
              <div className="empty-state">
                <p>Aucune ressource pour le moment.</p>
              </div>
            ) : (
              <div className="ressources-list">
                {recentRessources.map(res => (
                  <div key={res.id} className="ressource-item">
                    <div className="ressource-icon">{getRessourceIcon(res.type)}</div>
                    <div className="ressource-info">
                      <h3>{res.titre}</h3>
                      {res.description && <p>{res.description.substring(0, 60)}...</p>}
                      <div className="ressource-meta">
                        <span>{res.categorie}</span>
                        <span>📥 {res.downloads || 0} téléchargements</span>
                      </div>
                    </div>
                    <a href={`http://localhost:3001${res.fichier}`} className="btn-download" download target="_blank" rel="noopener noreferrer">
                      📥
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="events-section">
            <div className="section-header">
              <h2>📅 Événements à venir</h2>
              <Link to="/membres/calendrier" className="see-all">Voir tout →</Link>
            </div>
            
            {loading ? (
              <div className="loading">Chargement...</div>
            ) : upcomingEvents.length === 0 ? (
              <div className="empty-state">
                <p>Aucun événement à venir.</p>
              </div>
            ) : (
              <div className="events-list">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="event-item">
                    <div className="event-date">
                      <span className="event-day">{new Date(event.date_debut).getDate()}</span>
                      <span className="event-month">{new Date(event.date_debut).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                    </div>
                    <div className="event-info">
                      <h3>{getEventIcon(event.type)} {event.titre}</h3>
                      <p>{event.lieu || 'Lieu à définir'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="welcome-message">
          <h3>✨ {greeting}, scout !</h3>
          <p>Tu trouveras ici toutes les ressources nécessaires pour tes activités, le calendrier des événements à venir et les annonces importantes de la Direction Exécutive.</p>
          <div className="quick-actions">
            <Link to="/membres/ressources" className="quick-action">📚 Consulter les ressources</Link>
            <Link to="/membres/calendrier" className="quick-action">📅 Voir le calendrier</Link>
            <Link to="/membres/annonces" className="quick-action">📢 Lire les annonces</Link>
          </div>
        </div>
      </main>
    </div>
  )
}