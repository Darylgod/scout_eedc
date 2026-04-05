import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../utils/api'
import { formatDateShort } from '../../utils/formatDate'
import '../../styles/admin.css'

export default function AdminArticles() {
  const { user } = useAuth()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await api.get('/admin/articles')
      setArticles(response.data)
    } catch (error) {
      console.error('Erreur chargement articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet article ?')) return
    try {
      await api.delete(`/admin/articles/${id}`)
      fetchArticles()
    } catch (error) {
      console.error('Erreur suppression:', error)
    }
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-title">EEDC Administration</div>
          <div className="admin-sidebar-sub">{user?.nom} {user?.prenom}</div>
        </div>
        <nav>
          <div className="admin-nav-section">Principal</div>
          <Link to="/admin" className="admin-nav-item">📊 Tableau de bord</Link>
          <div className="admin-nav-section">Contenu</div>
          <Link to="/admin/articles" className="admin-nav-item active">📝 Articles</Link>
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
          <div className="admin-topbar-title">Gestion des articles</div>
          <Link to="/admin/articles/new" className="btn btn-primary">
            + Nouvel article
          </Link>
        </div>

        <div className="admin-content">
          {loading ? (
            <div className="loading">Chargement...</div>
          ) : articles.length === 0 ? (
            <div className="empty-state">Aucun article</div>
          ) : (
            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Catégorie</th>
                    <th>Date</th>
                    <th>Statut</th>
                    <th>Vues</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map(article => (
                    <tr key={article.id}>
                      <td>
                        <strong>{article.titre}</strong>
                        <div className="article-extrait">{article.extrait?.substring(0, 60)}...</div>
                      </td>
                      <td>{article.categorie}</td>
                      <td>{formatDateShort(article.published_at)}</td>
                      <td>
                        <span className={`status-badge ${article.publie ? 'status-actif' : 'status-inactif'}`}>
                          {article.publie ? 'Publié' : 'Brouillon'}
                        </span>
                      </td>
                      <td>{article.vues || 0}</td>
                      <td>
                        <div className="action-buttons">
                          <Link to={`/admin/articles/${article.id}`} className="btn btn-small">✏️</Link>
                          <button onClick={() => handleDelete(article.id)} className="btn btn-small btn-danger">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}