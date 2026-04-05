import { useState, useEffect } from 'react'
import { Link, useNavigate }from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../utils/api'
import { formatDate, formatDateTime } from '../../utils/formatDate'
import { EVENT_TYPES } from '../../utils/constants'
import '../../styles/membres.css'

export default function Calendrier() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [evenements, setEvenements] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState('tous')
  const [viewMode, setViewMode] = useState('grid') // 'grid' ou 'list'
  const [selectedEvent, setSelectedEvent] = useState(null)

  useEffect(() => {
    const fetchEvenements = async () => {
      try {
        const response = await api.get('/evenements')
        setEvenements(response.data)
      } catch (error) {
        console.error('Erreur chargement événements:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvenements()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
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

  const getEventColor = (type) => {
    const colors = {
      camp: '#1a7a4a',
      reunion: '#003087',
      formation: '#d4a017',
      ceremonie: '#9b59b6',
      activite: '#e67e22'
    }
    return colors[type] || '#666'
  }

  const isPastEvent = (date) => {
    return new Date(date) < new Date()
  }

  const isToday = (date) => {
    const today = new Date()
    const eventDate = new Date(date)
    return eventDate.toDateString() === today.toDateString()
  }

  const isThisWeek = (date) => {
    const today = new Date()
    const eventDate = new Date(date)
    const diffTime = eventDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 && diffDays <= 7
  }

  // Filtrer les événements
  let filteredEvents = evenements
  if (selectedType !== 'tous') {
    filteredEvents = filteredEvents.filter(e => e.type === selectedType)
  }

  // Séparer les événements passés et futurs
  const upcomingEvents = filteredEvents.filter(e => !isPastEvent(e.date_debut))
  const pastEvents = filteredEvents.filter(e => isPastEvent(e.date_debut))

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
          <Link to="/membres" className="membres-nav-item">📊 Tableau de bord</Link>
          <Link to="/membres/ressources" className="membres-nav-item">📚 Ressources PNJ</Link>
          <Link to="/membres/calendrier" className="membres-nav-item active">📅 Calendrier</Link>
          <Link to="/membres/annonces" className="membres-nav-item">📢 Annonces DEX</Link>
          <Link to="/membres/profil" className="membres-nav-item">👤 Mon profil</Link>
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
            <h1>📅 Calendrier des activités</h1>
            <p>Retrouvez tous les événements de l'EEDC Cameroun</p>
          </div>
          <Link to="/" className="btn-mobile-back">
            🏠 Site
          </Link>
        </div>

        {/* Filtres et vue */}
        <div className="calendar-controls">
          <div className="filters">
            <div className="filter-group">
              <label>Type d'événement</label>
              <div className="filter-buttons">
                <button className={selectedType === 'tous' ? 'active' : ''} onClick={() => setSelectedType('tous')}>
                  Tous
                </button>
                {EVENT_TYPES.map(type => (
                  <button key={type.value} className={selectedType === type.value ? 'active' : ''} onClick={() => setSelectedType(type.value)}>
                    {type.icon} {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="view-toggle">
            <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>
              📱 Grille
            </button>
            <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>
              📋 Liste
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Chargement...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="empty-state">
            <p>Aucun événement trouvé pour ces critères.</p>
          </div>
        ) : (
          <>
            {/* Événements à venir */}
            {upcomingEvents.length > 0 && (
              <div className="events-section">
                <div className="section-badge">
                  <span className="badge-upcoming">📅 À venir</span>
                  <span className="events-count">{upcomingEvents.length} événement(s)</span>
                </div>
                <div className={`events-container ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}>
                  {upcomingEvents.map(event => {
                    const eventColor = getEventColor(event.type)
                    const isEventToday = isToday(event.date_debut)
                    const isEventThisWeek = isThisWeek(event.date_debut)
                    
                    return (
                      <div 
                        key={event.id} 
                        className={`event-card ${viewMode === 'grid' ? 'grid-card' : 'list-card'}`}
                        style={{ borderLeftColor: eventColor }}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="event-date-badge" style={{ backgroundColor: eventColor }}>
                          <span className="event-day">{new Date(event.date_debut).getDate()}</span>
                          <span className="event-month">{new Date(event.date_debut).toLocaleString('fr-FR', { month: 'short' }).toUpperCase()}</span>
                        </div>
                        <div className="event-details">
                          <div className="event-header">
                            <h3>{event.titre}</h3>
                            {isEventToday && <span className="today-badge">AUJOURD'HUI</span>}
                            {isEventThisWeek && !isEventToday && <span className="week-badge">CETTE SEMAINE</span>}
                          </div>
                          <div className="event-type-badge">
                            <span style={{ backgroundColor: eventColor + '20', color: eventColor }}>
                              {getEventIcon(event.type)} {event.type}
                            </span>
                          </div>
                          {event.description && (
                            <p className="event-description">{event.description.substring(0, 100)}...</p>
                          )}
                          <div className="event-info">
                            <div className="info-item">
                              <span>📅</span>
                              <span>{formatDate(event.date_debut)}</span>
                            </div>
                            {event.lieu && (
                              <div className="info-item">
                                <span>📍</span>
                                <span>{event.lieu}</span>
                              </div>
                            )}
                            <div className="info-item">
                              <span>👥</span>
                              <span>{event.branche_concernee === 'toutes' ? 'Toutes branches' : event.branche_concernee}</span>
                            </div>
                          </div>
                        </div>
                        <div className="event-action">
                          <span className="arrow-icon">→</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Événements passés */}
            {pastEvents.length > 0 && (
              <div className="events-section past-events">
                <div className="section-badge">
                  <span className="badge-past">📆 Passés</span>
                  <span className="events-count">{pastEvents.length} événement(s)</span>
                </div>
                <div className={`events-container ${viewMode === 'grid' ? 'grid-view' : 'list-view'}`}>
                  {pastEvents.map(event => {
                    const eventColor = getEventColor(event.type)
                    return (
                      <div 
                        key={event.id} 
                        className={`event-card past ${viewMode === 'grid' ? 'grid-card' : 'list-card'}`}
                        style={{ borderLeftColor: eventColor, opacity: 0.7 }}
                      >
                        <div className="event-date-badge" style={{ backgroundColor: eventColor }}>
                          <span className="event-day">{new Date(event.date_debut).getDate()}</span>
                          <span className="event-month">{new Date(event.date_debut).toLocaleString('fr-FR', { month: 'short' }).toUpperCase()}</span>
                        </div>
                        <div className="event-details">
                          <h3>{event.titre}</h3>
                          <div className="event-type-badge">
                            <span style={{ backgroundColor: eventColor + '20', color: eventColor }}>
                              {getEventIcon(event.type)} {event.type}
                            </span>
                          </div>
                          <div className="event-info">
                            <div className="info-item">
                              <span>📅</span>
                              <span>{formatDate(event.date_debut)}</span>
                            </div>
                            {event.lieu && (
                              <div className="info-item">
                                <span>📍</span>
                                <span>{event.lieu}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal détails événement */}
      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content modal-event" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header" style={{ backgroundColor: getEventColor(selectedEvent.type), color: 'white' }}>
              <h3>{getEventIcon(selectedEvent.type)} {selectedEvent.titre}</h3>
              <button className="modal-close" onClick={() => setSelectedEvent(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="event-full-details">
                <div className="detail-row">
                  <div className="detail-icon">📅</div>
                  <div className="detail-content">
                    <strong>Date de début</strong>
                    <p>{formatDateTime(selectedEvent.date_debut)}</p>
                  </div>
                </div>
                {selectedEvent.date_fin && (
                  <div className="detail-row">
                    <div className="detail-icon">🏁</div>
                    <div className="detail-content">
                      <strong>Date de fin</strong>
                      <p>{formatDateTime(selectedEvent.date_fin)}</p>
                    </div>
                  </div>
                )}
                {selectedEvent.lieu && (
                  <div className="detail-row">
                    <div className="detail-icon">📍</div>
                    <div className="detail-content">
                      <strong>Lieu</strong>
                      <p>{selectedEvent.lieu}</p>
                    </div>
                  </div>
                )}
                <div className="detail-row">
                  <div className="detail-icon">👥</div>
                  <div className="detail-content">
                    <strong>Branche concernée</strong>
                    <p>{selectedEvent.branche_concernee === 'toutes' ? 'Toutes les branches' : selectedEvent.branche_concernee}</p>
                  </div>
                </div>
                {selectedEvent.description && (
                  <div className="detail-row">
                    <div className="detail-icon">📝</div>
                    <div className="detail-content">
                      <strong>Description</strong>
                      <p>{selectedEvent.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}