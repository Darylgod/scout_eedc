import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../utils/api'
import '../../styles/admin.css'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    users: 0,
    articles: 0,
    inscriptions: 0,
    ressources: 0
  })
  const [recentInscriptions, setRecentInscriptions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, articlesRes, inscriptionsRes, ressourcesRes] = await Promise.all([
          api.get('/admin/users').catch(() => ({ data: [] })),
          api.get('/articles'),
          api.get('/admin/inscriptions'),
          api.get('/ressources')
        ])
        
        setStats({
          users: usersRes.data?.length || 0,
          articles: articlesRes.data.length,
          inscriptions: inscriptionsRes.data.filter(i => i.statut === 'en_attente').length,
          ressources: ressourcesRes.data.length
        })
        
        setRecentInscriptions(inscriptionsRes.data.slice(0, 5))
      } catch (error) {
        console.error('Erreur chargement dashboard:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statCards = [
    { label: 'Utilisateurs', value: stats.users, icon: '👥', color: '#003087' },
    { label: 'Articles', value: stats.articles, icon: '📝', color: '#1A7A4A' },
    { label: 'Inscriptions en attente', value: stats.inscriptions, icon: '📋', color: '#D4A017' },
    { label: 'Ressources', value: stats.ressources, icon: '📚', color: '#CC0000' },
  ]

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-title">EEDC Administration</div>
          <div className="admin-sidebar-sub">{user?.nom} {user?.prenom}</div>
        </div>
        <nav>
          <div className="admin-nav-section">Principal</div>
          <Link to="/admin" className="admin-nav-item active">📊 Tableau de bord</Link>
          <div className="admin-nav-section">Contenu</div>
          <Link to="/admin/articles" className="admin-nav-item">📝 Articles</Link>
          <Link to="/admin/galerie" className="admin-nav-item">🖼️ Galerie</Link>
          <Link to="/admin/agenda" className="admin-nav-item">📅 Agenda</Link>
          <Link to="/admin/ressources" className="admin-nav-item">📚 Ressources</Link>
          <div className="admin-nav-section">Gestion</div>
          <Link to="/admin/inscriptions" className="admin-nav-item">📋 Inscriptions</Link>
          {user?.role === 'superadmin' && (
            <Link to="/admin/utilisateurs" className="admin-nav-item">👥 Utilisateurs</Link>
          )}
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-title">Tableau de bord</div>
          <div className="admin-topbar-date">
            {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        <div className="admin-content">
          <div className="stats-grid">
            {statCards.map((stat, i) => (
              <div key={i} className="stat-card" style={{ borderTopColor: stat.color }}>
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-number">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="recent-section">
            <h2>Dernières inscriptions</h2>
            {loading ? (
              <div className="loading">Chargement...</div>
            ) : recentInscriptions.length === 0 ? (
              <div className="empty-state">Aucune inscription en attente</div>
            ) : (
              <div className="admin-table">
                <table>
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Email</th>
                      <th>Branche</th>
                      <th>Date</th>
                      <th>Statut</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInscriptions.map(ins => (
                      <tr key={ins.id}>
                        <td>{ins.nom} {ins.prenom}</td>
                        <td>{ins.email}</td>
                        <td>{ins.branche_souhaitee}</td>
                        <td>{new Date(ins.created_at).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-badge status-${ins.statut}`}>
                            {ins.statut === 'en_attente' && 'En attente'}
                            {ins.statut === 'invitee' && 'Invité'}
                            {ins.statut === 'rejetee' && 'Rejeté'}
                          </span>
                        </td>
                        <td>
                          <Link to="/admin/inscriptions" className="btn btn-small">
                            Traiter
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}