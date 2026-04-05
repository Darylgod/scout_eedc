import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../utils/api'
import { formatDateShort } from '../../utils/formatDate'
import '../../styles/admin.css'

export default function AdminGalerie() {
  const { user } = useAuth()
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    categorie: 'camp',
    images: []
  })
  const [imagePreviews, setImagePreviews] = useState([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    try {
      const response = await api.get('/galerie')
      setPhotos(response.data)
    } catch (error) {
      console.error('Erreur chargement galerie:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.images.length === 0) {
      alert('Veuillez sélectionner au moins une image')
      return
    }

    setUploading(true)
    const formDataToSend = new FormData()
    formDataToSend.append('titre', formData.titre)
    formDataToSend.append('description', formData.description)
    formDataToSend.append('categorie', formData.categorie)
    
    formData.images.forEach((image, index) => {
      formDataToSend.append('images', image)
    })

    try {
      await api.post('/admin/galerie', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setShowModal(false)
      resetForm()
      fetchPhotos()
    } catch (error) {
      console.error('Erreur ajout photo:', error)
      alert('Erreur lors de l\'ajout')
    } finally {
      setUploading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setUploading(true)
    
    try {
      await api.put(`/admin/galerie/${selectedPhoto.id}`, {
        titre: formData.titre,
        description: formData.description,
        categorie: formData.categorie
      })
      setShowEditModal(false)
      resetForm()
      fetchPhotos()
    } catch (error) {
      console.error('Erreur modification:', error)
      alert('Erreur lors de la modification')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette galerie ? Toutes les images seront supprimées.')) return
    try {
      await api.delete(`/admin/galerie/${id}`)
      fetchPhotos()
    } catch (error) {
      console.error('Erreur suppression:', error)
    }
  }

  const handleDeleteImage = async (galerieId, imageId) => {
    if (!confirm('Supprimer cette image ?')) return
    try {
      await api.delete(`/admin/galerie/${galerieId}/images/${imageId}`)
      fetchPhotos()
    } catch (error) {
      console.error('Erreur suppression image:', error)
    }
  }

  const handleEdit = async (photo) => {
    setSelectedPhoto(photo)
    setFormData({
      titre: photo.titre,
      description: photo.description || '',
      categorie: photo.categorie,
      images: []
    })
    setShowEditModal(true)
  }

  const resetForm = () => {
    setFormData({
      titre: '',
      description: '',
      categorie: 'camp',
      images: []
    })
    setImagePreviews([])
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + formData.images.length > 10) {
      alert('Maximum 10 images par galerie')
      return
    }
    
    setFormData({ ...formData, images: [...formData.images, ...files] })
    
    const newPreviews = files.map(file => URL.createObjectURL(file))
    setImagePreviews([...imagePreviews, ...newPreviews])
  }

  const removeImage = (index) => {
    const newImages = [...formData.images]
    newImages.splice(index, 1)
    setFormData({ ...formData, images: newImages })
    
    const newPreviews = [...imagePreviews]
    URL.revokeObjectURL(newPreviews[index])
    newPreviews.splice(index, 1)
    setImagePreviews(newPreviews)
  }

  const getCategorieIcon = (categorie) => {
    const icons = {
      camp: '⛺',
      ceremonie: '🎖️',
      activite: '🎯',
      formation: '📚',
      autre: '📸'
    }
    return icons[categorie] || '📸'
  }

  const getCategorieLabel = (categorie) => {
    const labels = {
      camp: 'Camp',
      ceremonie: 'Cérémonie',
      activite: 'Activité',
      formation: 'Formation',
      autre: 'Autre'
    }
    return labels[categorie] || categorie
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
          <Link to="/admin/galerie" className="admin-nav-item active">🖼️ Galerie</Link>
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
          <div className="admin-topbar-title">Gestion de la galerie</div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            + Ajouter une galerie
          </button>
        </div>

        <div className="admin-content">
          {loading ? (
            <div className="loading">Chargement...</div>
          ) : photos.length === 0 ? (
            <div className="empty-state">Aucune galerie</div>
          ) : (
            <div className="galerie-grid admin-grid">
              {photos.map(photo => (
                <div key={photo.id} className="galerie-item admin-item">
                  <div className="galerie-image">
                    {photo.images && photo.images.length > 0 ? (
                      <div className="image-count-badge">
                        📸 {photo.images.length} photo(s)
                      </div>
                    ) : null}
                    {photo.image ? (
                      <img 
                        src={`http://localhost:3001${photo.image}`} 
                        alt={photo.titre} 
                        style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="galerie-placeholder">{getCategorieIcon(photo.categorie)}</div>
                    )}
                  </div>
                  <div className="galerie-info">
                    <h3>{photo.titre}</h3>
                    {photo.description && <p>{photo.description.substring(0, 80)}...</p>}
                    <div className="galerie-meta">
                      <span className="badge">{getCategorieLabel(photo.categorie)}</span>
                      <span>{formatDateShort(photo.created_at)}</span>
                    </div>
                    {photo.images && photo.images.length > 0 && (
                      <div className="images-preview">
                        {photo.images.slice(0, 3).map((img, idx) => (
                          <img 
                            key={idx}
                            src={`http://localhost:3001${img.image_url}`}
                            alt=""
                            className="thumbnail"
                          />
                        ))}
                        {photo.images.length > 3 && (
                          <span className="more-images">+{photo.images.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="galerie-actions">
                    <button onClick={() => handleEdit(photo)} className="btn btn-small btn-edit">
                      ✏️ Modifier
                    </button>
                    <button onClick={() => handleDelete(photo.id)} className="btn btn-small btn-danger">
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal d'ajout */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Ajouter une galerie</h3>
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
                    placeholder="Ex: Camp d'été 2024"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Décrivez cette galerie..."
                  />
                </div>

                <div className="form-group">
                  <label>Catégorie</label>
                  <select
                    value={formData.categorie}
                    onChange={(e) => setFormData({...formData, categorie: e.target.value})}
                  >
                    <option value="camp">⛺ Camp</option>
                    <option value="ceremonie">🎖️ Cérémonie</option>
                    <option value="activite">🎯 Activité</option>
                    <option value="formation">📚 Formation</option>
                    <option value="autre">📸 Autre</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Images (max 10) *</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="file-input"
                  />
                  <small>Vous pouvez sélectionner plusieurs images (max 10)</small>
                  
                  {imagePreviews.length > 0 && (
                    <div className="image-previews">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="preview-item">
                          <img src={preview} alt={`Preview ${index + 1}`} />
                          <button type="button" onClick={() => removeImage(index)} className="remove-image">✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn" onClick={() => setShowModal(false)}>Annuler</button>
                  <button type="submit" className="btn btn-primary" disabled={uploading}>
                    {uploading ? 'Ajout en cours...' : 'Ajouter la galerie'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {showEditModal && selectedPhoto && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Modifier la galerie</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdate}>
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
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Catégorie</label>
                  <select
                    value={formData.categorie}
                    onChange={(e) => setFormData({...formData, categorie: e.target.value})}
                  >
                    <option value="camp">⛺ Camp</option>
                    <option value="ceremonie">🎖️ Cérémonie</option>
                    <option value="activite">🎯 Activité</option>
                    <option value="formation">📚 Formation</option>
                    <option value="autre">📸 Autre</option>
                  </select>
                </div>

                {selectedPhoto.images && selectedPhoto.images.length > 0 && (
                  <div className="form-group">
                    <label>Images existantes</label>
                    <div className="existing-images">
                      {selectedPhoto.images.map((img, index) => (
                        <div key={img.id} className="existing-image-item">
                          <img src={`http://localhost:3001${img.image_url}`} alt="" />
                          <button 
                            type="button"
                            onClick={() => handleDeleteImage(selectedPhoto.id, img.id)}
                            className="delete-image"
                          >
                            🗑️
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="modal-footer">
                  <button type="button" className="btn" onClick={() => setShowEditModal(false)}>Annuler</button>
                  <button type="submit" className="btn btn-primary" disabled={uploading}>
                    {uploading ? 'Enregistrement...' : 'Enregistrer les modifications'}
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