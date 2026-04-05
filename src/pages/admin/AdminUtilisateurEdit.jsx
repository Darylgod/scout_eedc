// src/pages/admin/AdminUtilisateurEdit.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../utils/api'
import '../../styles/forms.css'
import '../../styles/admin.css'
import '../../styles/admin.css'

export default function AdminUtilisateurEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    role: 'chef',
    branche: '',
    unite: '',
    region: '',
    statut: 'actif'
  })

  useEffect(() => {
    fetchUser()
  }, [id])

  const fetchUser = async () => {
    try {
      const response = await api.get(`/admin/users/${id}`)
      setFormData({
        nom: response.data.nom,
        prenom: response.data.prenom,
        email: response.data.email,
        telephone: response.data.telephone || '',
        role: response.data.role,
        branche: response.data.branche || '',
        unite: response.data.unite || '',
        region: response.data.region || '',
        statut: response.data.statut
      })
    } catch (error) {
      console.error('Erreur chargement utilisateur', error)
      navigate('/admin/utilisateurs')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.put(`/admin/users/${id}`, formData)
      navigate('/admin/utilisateurs')
    } catch (error) {
      console.error('Erreur mise à jour', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    const newPassword = prompt('Nouveau mot de passe :')
    if (!newPassword) return
    
    try {
      await api.post(`/admin/users/${id}/reset-password`, { password: newPassword })
      alert('Mot de passe modifié avec succès')
    } catch (error) {
      console.error('Erreur modification mot de passe', error)
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
          <div className="admin-topbar-title">Modifier l'utilisateur</div>
          <Link to="/admin/utilisateurs" className="btn" style={{ padding: '0.5rem 1rem' }}>
            ← Retour
          </Link>
        </div>

        <div className="admin-content">
          <div className="form-section">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nom *</label>
                  <input type="text" className="form-input" required value={formData.nom}
                    onChange={e => setFormData({...formData, nom: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Prénom *</label>
                  <input type="text" className="form-input" required value={formData.prenom}
                    onChange={e => setFormData({...formData, prenom: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" className="form-input" value={formData.email} disabled
                  style={{ background: 'var(--gris-clair)' }} />
              </div>

              <div className="form-group">
                <label className="form-label">Téléphone</label>
                <input type="tel" className="form-input" value={formData.telephone}
                  onChange={e => setFormData({...formData, telephone: e.target.value})} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Rôle</label>
                  <select className="form-select" value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    disabled={user?.role !== 'superadmin'}>
                    <option value="chef">Chef d'unité</option>
                    {user?.role === 'superadmin' && <option value="admin">Administrateur</option>}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Statut</label>
                  <select className="form-select" value={formData.statut}
                    onChange={e => setFormData({...formData, statut: e.target.value})}>
                    <option value="actif">Actif</option>
                    <option value="bloque">Bloqué</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Branche</label>
                  <select className="form-select" value={formData.branche}
                    onChange={e => setFormData({...formData, branche: e.target.value})}>
                    <option value="">Non assigné</option>
                    <option value="louveteaux">Louveteaux</option>
                    <option value="eclaireurs">Éclaireurs</option>
                    <option value="pionniers">Pionniers</option>
                    <option value="routiers">Routiers</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Unité</label>
                  <input type="text" className="form-input" value={formData.unite}
                    onChange={e => setFormData({...formData, unite: e.target.value})} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Région</label>
                <input type="text" className="form-input" value={formData.region}
                  onChange={e => setFormData({...formData, region: e.target.value})} />
              </div>

              <div className="form-submit" style={{ gap: '1rem', justifyContent: 'space-between' }}>
                <button type="button" onClick={handleResetPassword} className="btn" style={{ background: 'var(--or)', color: 'var(--bleu)' }}>
                  🔑 Réinitialiser mot de passe
                </button>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Link to="/admin/utilisateurs" className="btn">Annuler</Link>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Enregistrement...' : 'Enregistrer les modifications →'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}