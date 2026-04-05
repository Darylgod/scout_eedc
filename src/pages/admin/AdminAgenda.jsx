import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../utils/api'
import { formatDate, formatDateTime } from '../../utils/formatDate'
import { EVENT_TYPES, BRANCHES } from '../../utils/constants'
import '../../styles/admin.css'

export default function AdminAgenda() {
  const { user } = useAuth()
  const [evenements, setEvenements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    date_debut: '',
    date_fin: '',
    lieu: '',
    type: 'activite',
    branche_concernee: 'toutes'
  })

  useEffect(() => {
    fetchEvenements()
  }, [])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await api.put(`/admin/evenements/${editingId}`, formData)
      } else {
        await api.post('/admin/evenements', formData)
      }
      setShowModal(false)
      setEditingId(null)
      setFormData({ titre: '', description: '', date_debut: '', date_fin: '', lieu: '', type: 'activite', branche_concernee: 'toutes' })
      fetchEvenements()
    } catch (error) {
      console.error('Erreur sauvegarde:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet événement ?')) return
    try {
      await api.delete(`/admin/evenements/${id}`)
      fetchEvenements()
    } catch (error) {
      console.error('Erreur suppression:', error)
    }
  }

  const handleEdit = (event) => {
    setFormData({
      titre: event.titre,
      description: event.description || '',
      date_debut: event.date_debut.split('T')[0],
      date_fin: event.date_fin ? event.date_fin.split('T')[0] : '',
      lieu: event.lieu || '',
      type: event.type,
      branche_concernee: event.branche_concernee || 'toutes'
    })
    setEditingId(event.id)
    setShowModal(true)
  }

  const getEventTypeLabel = (type) => {
    const event = EVENT_TYPES.find(t => t.value === type)
    return event?.label || type
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
          <Link to="/admin/agenda" className="admin-nav-item active">📅 Agenda</Link>
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
          <div className="admin-topbar-title">Gestion de l'agenda</div>
          <button onClick={() => { setEditingId(null); setFormData({ titre: '', description: '', date_debut: '', date_fin: '', lieu: '', type: 'activite', branche_concernee: 'toutes' }); setShowModal(true); }} className="btn btn-primary">
            + Ajouter un événement
          </button>
        </div>

        <div className="admin-content">
          {loading ? (
            <div className="loading">Chargement...</div>
          ) : evenements.length === 0 ? (
            <div className="empty-state">Aucun événement</div>
          ) : (
            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Titre</th>
                    <th>Type</th>
                    <th>Lieu</th>
                    <th>Branche</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {evenements.map(event => (
                    <tr key={event.id}>
                      <td>
                        {formatDate(event.date_debut)}
                        {event.date_fin && <div className="event-end">→ {formatDate(event.date_fin)}</div>}
                      </td>
                      <td>
                        <strong>{event.titre}</strong>
                        {event.description && <div className="event-desc">{event.description}</div>}
                      </td>
                      <td>{getEventTypeLabel(event.type)}</td>
                      <td>{event.lieu || '-'}</td>
                      <td>{getBrancheLabel(event.branche_concernee)}</td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => handleEdit(event)} className="btn btn-small">✏️</button>
                          <button onClick={() => handleDelete(event.id)} className="btn btn-small btn-danger">🗑️</button>
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

      {/* Modal d'ajout/modification */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Modifier l\'événement' : 'Ajouter un événement'}</h3>
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
                    <label>Date début *</label>
                    <input
                      type="date"
                      required
                      value={formData.date_debut}
                      onChange={(e) => setFormData({...formData, date_debut: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Date fin</label>
                    <input
                      type="date"
                      value={formData.date_fin}
                      onChange={(e) => setFormData({...formData, date_fin: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Lieu</label>
                    <input
                      type="text"
                      value={formData.lieu}
                      onChange={(e) => setFormData({...formData, lieu: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                    >
                      {EVENT_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.icon} {type.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

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

                <div className="modal-footer">
                  <button type="button" className="btn" onClick={() => setShowModal(false)}>Annuler</button>
                  <button type="submit" className="btn btn-primary">
                    {editingId ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}