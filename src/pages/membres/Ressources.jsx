import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../utils/api'
import { RESOURCE_TYPES, RESOURCE_CATEGORIES } from '../../utils/constants'
import '../../styles/membres.css'

export default function Ressources() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [ressources, setRessources] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState('tous')
  const [selectedCategorie, setSelectedCategorie] = useState('tous')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchRessources = async () => {
      try {
        const response = await api.get('/ressources')
        setRessources(response.data)
      } catch (error) {
        console.error('Erreur chargement ressources:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchRessources()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleDownload = async (id, fichier) => {
    try {
      await api.post(`/ressources/${id}/download`)
      window.open(`http://localhost:3001${fichier}`, '_blank')
    } catch (error) {
      console.error('Erreur téléchargement:', error)
    }
  }

  const getRessourceIcon = (type) => {
    const icons = {
      document: '📄',
      video: '🎬',
      audio: '🎵',
      lien: '🔗'
    }
    return icons[type] || '📄'
  }

  const filteredRessources = ressources.filter(res => {
    if (selectedType !== 'tous' && res.type !== selectedType) return false
    if (selectedCategorie !== 'tous' && res.categorie !== selectedCategorie) return false
    if (searchTerm && !res.titre.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !(res.description && res.description.toLowerCase().includes(searchTerm.toLowerCase()))) return false
    return true
  })

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
          <Link to="/membres/ressources" className="membres-nav-item active">📚 Ressources PNJ</Link>
          <Link to="/membres/calendrier" className="membres-nav-item">📅 Calendrier</Link>
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
            <h1>📚 Ressources PNJ</h1>
            <p>Programme National des Jeunes - Documents techniques, pédagogiques et administratifs</p>
          </div>
          <Link to="/" className="btn-mobile-back">
            🏠 Site
          </Link>
        </div>

        {/* Barre de recherche */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Rechercher une ressource..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filtres */}
        <div className="filters">
          <div className="filter-group">
            <label>Type</label>
            <div className="filter-buttons">
              <button className={selectedType === 'tous' ? 'active' : ''} onClick={() => setSelectedType('tous')}>
                Tous
              </button>
              {RESOURCE_TYPES.map(type => (
                <button key={type.value} className={selectedType === type.value ? 'active' : ''} onClick={() => setSelectedType(type.value)}>
                  {type.icon} {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Catégorie</label>
            <div className="filter-buttons">
              <button className={selectedCategorie === 'tous' ? 'active' : ''} onClick={() => setSelectedCategorie('tous')}>
                Tous
              </button>
              {RESOURCE_CATEGORIES.map(cat => (
                <button key={cat.value} className={selectedCategorie === cat.value ? 'active' : ''} onClick={() => setSelectedCategorie(cat.value)}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading">Chargement...</div>
        ) : filteredRessources.length === 0 ? (
          <div className="empty-state">
            <p>Aucune ressource trouvée.</p>
          </div>
        ) : (
          <>
            <div className="ressources-count">
              {filteredRessources.length} ressource(s) trouvée(s)
            </div>
            <div className="ressources-grid">
              {filteredRessources.map(res => (
                <div key={res.id} className="ressource-card">
                  <div className="ressource-card-icon">
                    {getRessourceIcon(res.type)}
                  </div>
                  <div className="ressource-card-content">
                    <h3>{res.titre}</h3>
                    {res.description && <p>{res.description.substring(0, 80)}...</p>}
                    <div className="ressource-card-meta">
                      <span className="badge">{res.categorie}</span>
                      <span className="download-count">📥 {res.downloads || 0} téléchargements</span>
                    </div>
                  </div>
                  <button 
                    className="btn-download-resource"
                    onClick={() => handleDownload(res.id, res.fichier)}
                  >
                    📥 Télécharger
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}