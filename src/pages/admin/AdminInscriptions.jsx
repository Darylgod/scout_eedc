import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../utils/api'
import { BRANCHES } from '../../utils/constants'
import '../../styles/admin.css'

export default function AdminInscriptions() {
  const { user } = useAuth()
  const [inscriptions, setInscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedInscription, setSelectedInscription] = useState(null)
  const [validationData, setValidationData] = useState({
    role: 'chef',
    branche: '',
    unite: '',
    region: ''
  })
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchInscriptions()
  }, [])

  const fetchInscriptions = async () => {
    try {
      const response = await api.get('/admin/inscriptions')
      setInscriptions(response.data)
    } catch (error) {
      console.error('Erreur chargement inscriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleValidate = async () => {
    try {
      await api.post(`/admin/inscriptions/${selectedInscription.id}/valider`, validationData)
      setShowModal(false)
      fetchInscriptions()
    } catch (error) {
      console.error('Erreur validation:', error)
    }
  }

  const handleReject = async (id) => {
    if (!confirm('Rejeter cette inscription ?')) return
    try {
      await api.post(`/admin/inscriptions/${id}/rejeter`)
      fetchInscriptions()
    } catch (error) {
      console.error('Erreur rejet:', error)
    }
  }

  const filteredInscriptions = filter === 'all' 
    ? inscriptions 
    : inscriptions.filter(i => i.statut === filter)

  const stats = {
    total: inscriptions.length,
    en_attente: inscriptions.filter(i => i.statut === 'en_attente').length,
    invitee: inscriptions.filter(i => i.statut === 'invitee').length,
    rejetee: inscriptions.filter(i => i.statut === 'rejetee').length
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
          <Link to="/admin/ressources" className="admin-nav-item">📚 Ressources</Link>
          <div className="admin-nav-section">Gestion</div>
          <Link to="/admin/inscriptions" className="admin-nav-item active">📋 Inscriptions</Link>
          {user?.role === 'superadmin' && (
            <Link to="/admin/utilisateurs" className="admin-nav-item">👥 Utilisateurs</Link>
          )}
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-title">Gestion des inscriptions</div>
        </div>

        <div className="admin-content">
          <div className="stats-filter">
            <div className="stats-buttons">
              <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
                Total ({stats.total})
              </button>
              <button className={filter === 'en_attente' ? 'active' : ''} onClick={() => setFilter('en_attente')}>
                En attente ({stats.en_attente})
              </button>
              <button className={filter === 'invitee' ? 'active' : ''} onClick={() => setFilter('invitee')}>
                Invités ({stats.invitee})
              </button>
              <button className={filter === 'rejetee' ? 'active' : ''} onClick={() => setFilter('rejetee')}>
                Rejetés ({stats.rejetee})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading">Chargement...</div>
          ) : filteredInscriptions.length === 0 ? (
            <div className="empty-state">Aucune inscription</div>
          ) : (
            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>Candidat</th>
                    <th>Contact</th>
                    <th>Branche</th>
                    <th>Région</th>
                    <th>Date</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInscriptions.map(ins => (
                    <tr key={ins.id}>
                      <td>
                        <strong>{ins.nom} {ins.prenom}</strong>
                        <div className="birth-date">Né(e) le {new Date(ins.date_naissance).toLocaleDateString()}</div>
                      </td>
                      <td>
                        {ins.email}<br />
                        {ins.telephone}
                      </td>
                      <td>{ins.branche_souhaitee}</td>
                      <td>{ins.region}</td>
                      <td>{new Date(ins.created_at).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge status-${ins.statut}`}>
                          {ins.statut === 'en_attente' && 'En attente'}
                          {ins.statut === 'invitee' && 'Invité'}
                          {ins.statut === 'rejetee' && 'Rejeté'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {ins.statut === 'en_attente' && (
                            <>
                              <button 
                                onClick={() => {
                                  setSelectedInscription(ins)
                                  setValidationData({
                                    role: 'chef',
                                    branche: ins.branche_souhaitee,
                                    unite: ins.unite_souhaitee || '',
                                    region: ins.region
                                  })
                                  setShowModal(true)
                                }} 
                                className="btn btn-small btn-success"
                              >
                                ✓ Valider
                              </button>
                              <button onClick={() => handleReject(ins.id)} className="btn btn-small btn-danger">
                                ✗ Rejeter
                              </button>
                            </>
                          )}
                          {ins.message && (
                            <button onClick={() => alert(ins.message)} className="btn btn-small">
                              💬
                            </button>
                          )}
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

      {/* Modal de validation */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Valider l'inscription</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <p>Candidat: <strong>{selectedInscription?.nom} {selectedInscription?.prenom}</strong></p>
              
              <div className="form-group">
                <label>Rôle</label>
                <select
                  value={validationData.role}
                  onChange={(e) => setValidationData({...validationData, role: e.target.value})}
                >
                  <option value="chef">Chef d'unité</option>
                  {user?.role === 'superadmin' && <option value="admin">Administrateur</option>}
                </select>
              </div>

              <div className="form-group">
                <label>Branche</label>
                <select
                  value={validationData.branche}
                  onChange={(e) => setValidationData({...validationData, branche: e.target.value})}
                >
                  {Object.entries(BRANCHES).map(([key, value]) => (
                    <option key={key} value={key}>{value.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Unité</label>
                <input
                  type="text"
                  value={validationData.unite}
                  onChange={(e) => setValidationData({...validationData, unite: e.target.value})}
                  placeholder="Nom de l'unité"
                />
              </div>

              <div className="form-group">
                <label>Région</label>
                <input
                  type="text"
                  value={validationData.region}
                  onChange={(e) => setValidationData({...validationData, region: e.target.value})}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={() => setShowModal(false)}>Annuler</button>
              <button className="btn btn-primary" onClick={handleValidate}>Envoyer l'invitation</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}