import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../utils/api'
import { RESOURCE_TYPES, RESOURCE_CATEGORIES, BRANCHES } from '../../utils/constants'
import '../../styles/admin.css'

export default function AdminRessources() {
  const { user } = useAuth()
  const [ressources, setRessources] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    type: 'document',
    categorie: 'technique',
    branche_concernee: 'toutes',
    niveau_acces: 'membre',
    fichier: null
  })

  useEffect(() => {
    fetchRessources()
  }, [])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formDataToSend = new FormData()
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && key !== 'fichier') {
        formDataToSend.append(key, formData[key])
      }
    })
    if (formData.fichier) {
      formDataToSend.append('fichier', formData.fichier)
    }

    try {
      await api.post('/admin/ressources', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setShowModal(false)
      setFormData({ titre: '', description: '', type: 'document', categorie: 'technique', branche_concernee: 'toutes', niveau_acces: 'membre', fichier: null })
      fetchRessources()
    } catch (error) {
      console.error('Erreur ajout ressource:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette ressource ?')) return
    try {
      await api.delete(`/admin/ressources/${id}`)
      fetchRessources()
    } catch (error) {
      console.error('Erreur suppression:', error)
    }
  }

  const getTypeIcon = (type) => {
    const resource = RESOURCE_TYPES.find(t => t.value === type)
    return resource?.icon || '📄'
  }

  const getBrancheLabel = (branche) => {
    if (branche === 'toutes') return 'Toutes branches'
    const branch = BRANCHES[branche]
    return branch?.label || branche
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
          <Link to="/admin/articles" className="admin-nav-item">📝 Articles</Link>
          <Link to="/admin/galerie" className="admin-nav-item">🖼️ Galerie</Link>
          <Link to="/admin/agenda" className="admin-nav-item">📅 Agenda</Link>
          <Link to="/admin/ressources" className="admin-nav-item active">📚 Ressources</Link>
          <div className="admin-nav-section">Gestion</div>
          <Link to="/admin/inscriptions" className="admin-nav-item">📋 Inscriptions</Link>
          {user?.role === 'superadmin' && (
            <Link to="/admin/utilisateurs" className="admin-nav-item">👥 Utilisateurs</Link>
          )}
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-title">Gestion des ressources (PNJ)</div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            + Ajouter une ressource
          </button>
        </div>

        <div className="admin-content">
          {loading ? (
            <div className="loading">Chargement...</div>
          ) : ressources.length === 0 ? (
            <div className="empty-state">Aucune ressource</div>
          ) : (
            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Type</th>
                    <th>Catégorie</th>
                    <th>Branche</th>
                    <th>Accès</th>
                    <th>Téléchargements</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ressources.map(res => (
                    <tr key={res.id}>
                      <td>
                        <strong>{res.titre}</strong>
                        {res.description && <div className="ressource-desc">{res.description}</div>}
                      </td>
                      <td>{getTypeIcon(res.type)} {res.type}</td>
                      <td>{res.categorie}</td>
                      <td>{getBrancheLabel(res.branche_concernee)}</td>
                      <td>
                        <span className={`badge ${res.niveau_acces === 'public' ? 'badge-public' : 'badge-membre'}`}>
                          {res.niveau_acces === 'public' ? 'Public' : 'Membre'}
                        </span>
                      </td>
                      <td>{res.downloads || 0}</td>
                      <td>
                        <div className="action-buttons">
                          <a href={res.fichier} className="btn btn-small" target="_blank" rel="noopener noreferrer">📥</a>
                          <button onClick={() => handleDelete(res.id)} className="btn btn-small btn-danger">🗑️</button>
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

      {/* Modal d'ajout */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Ajouter une ressource</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Titre *</label>
                  <input
                    type="text"
                    required
                    value={formData.titre}
                    onChange={(e) => setFormData({...formData, titre: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="2"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      {RESOURCE_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Catégorie</label>
                    <select
                      value={formData.categorie}
                      onChange={(e) => setFormData({...formData, categorie: e.target.value})}
                    >
                      {RESOURCE_CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Branche concernée</label>
                    <select
                      value={formData.branche_concernee}
                      onChange={(e) => setFormData({...formData, branche_concernee: e.target.value})}
                    >
                      <option value="toutes">Toutes les branches</option>
                      {Object.entries(BRANCHES).map(([key, value]) => (
                        <option key={key} value={key}>{value.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Niveau d'accès</label>
                    <select
                      value={formData.niveau_acces}
                      onChange={(e) => setFormData({...formData, niveau_acces: e.target.value})}
                    >
                      <option value="membre">Membres uniquement</option>
                      <option value="public">Public</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Fichier *</label>
                  <input
                    type="file"
                    required
                    onChange={(e) => setFormData({...formData, fichier: e.target.files[0]})}
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn" onClick={() => setShowModal(false)}>Annuler</button>
                  <button type="submit" className="btn btn-primary">Ajouter</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}