import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../utils/api'
import { BRANCHES } from '../../utils/constants'
import '../../styles/admin.css'

export default function AdminUtilisateurs() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [invitationData, setInvitationData] = useState({
    email: '',
    nom: '',
    prenom: '',
    role: 'chef',
    branche: '',
    unite: '',
    region: ''
  })
  const [invitationLink, setInvitationLink] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateInvitation = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      const response = await api.post('/admin/invitations', invitationData)
      setInvitationLink(response.data.invitationLink)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création')
    }
  }

  const handleBlockUser = async (id, currentStatus) => {
    const newStatus = currentStatus === 'actif' ? 'bloque' : 'actif'
    try {
      await api.put(`/admin/users/${id}/status`, { statut: newStatus })
      fetchUsers()
    } catch (error) {
      console.error('Erreur mise à jour:', error)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(invitationLink)
    alert('Lien copié dans le presse-papier !')
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
          <Link to="/admin/inscriptions" className="admin-nav-item">📋 Inscriptions</Link>
          <Link to="/admin/utilisateurs" className="admin-nav-item active">👥 Utilisateurs</Link>
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-title">Gestion des utilisateurs</div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            + Inviter un utilisateur
          </button>
        </div>

        <div className="admin-content">
          {loading ? (
            <div className="loading">Chargement...</div>
          ) : users.length === 0 ? (
            <div className="empty-state">Aucun utilisateur</div>
          ) : (
            <div className="admin-table">
              <table>
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Rôle</th>
                    <th>Branche</th>
                    <th>Statut</th>
                    <th>Dernière connexion</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>
                        <strong>{u.prenom} {u.nom}</strong>
                        <div className="user-email">{u.email}</div>
                      </td>
                      <td>
                        <span className={`role-badge role-${u.role}`}>
                          {u.role === 'superadmin' && 'Super Admin'}
                          {u.role === 'admin' && 'Admin'}
                          {u.role === 'chef' && 'Chef'}
                        </span>
                      </td>
                      <td>{u.branche || '-'}</td>
                      <td>
                        <span className={`status-badge status-${u.statut}`}>
                          {u.statut === 'actif' ? 'Actif' : u.statut === 'bloque' ? 'Bloqué' : 'Inactif'}
                        </span>
                      </td>
                      <td>{u.last_login ? new Date(u.last_login).toLocaleDateString() : 'Jamais'}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => handleBlockUser(u.id, u.statut)} 
                            className={`btn btn-small ${u.statut === 'actif' ? 'btn-warning' : 'btn-success'}`}
                          >
                            {u.statut === 'actif' ? '🔒 Bloquer' : '🔓 Débloquer'}
                          </button>
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

      {/* Modal d'invitation */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Inviter un utilisateur</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              {invitationLink ? (
                <div className="invitation-success">
                  <div className="success-icon">✅</div>
                  <p>Invitation créée avec succès !</p>
                  <div className="invitation-link">
                    <input type="text" value={invitationLink} readOnly />
                    <button onClick={copyToClipboard} className="btn btn-small">Copier</button>
                  </div>
                  <button onClick={() => setShowModal(false)} className="btn btn-primary">
                    Fermer
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreateInvitation}>
                  {error && <div className="alert error">{error}</div>}
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        required
                        value={invitationData.email}
                        onChange={(e) => setInvitationData({...invitationData, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Nom *</label>
                      <input
                        type="text"
                        required
                        value={invitationData.nom}
                        onChange={(e) => setInvitationData({...invitationData, nom: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Prénom *</label>
                      <input
                        type="text"
                        required
                        value={invitationData.prenom}
                        onChange={(e) => setInvitationData({...invitationData, prenom: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Rôle</label>
                      <select
                        value={invitationData.role}
                        onChange={(e) => setInvitationData({...invitationData, role: e.target.value})}
                      >
                        <option value="chef">Chef d'unité</option>
                        {user?.role === 'superadmin' && <option value="admin">Administrateur</option>}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Branche</label>
                      <select
                        value={invitationData.branche}
                        onChange={(e) => setInvitationData({...invitationData, branche: e.target.value})}
                      >
                        <option value="">Sélectionner</option>
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
                        value={invitationData.unite}
                        onChange={(e) => setInvitationData({...invitationData, unite: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Région</label>
                      <input
                        type="text"
                        value={invitationData.region}
                        onChange={(e) => setInvitationData({...invitationData, region: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn" onClick={() => setShowModal(false)}>Annuler</button>
                    <button type="submit" className="btn btn-primary">Créer l'invitation</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}