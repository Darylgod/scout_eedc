import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import api from '../../utils/api'
import { ARTICLE_CATEGORIES } from '../../utils/constants'
import '../../styles/admin.css'

export default function AdminArticleEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false) // Savoir si on est en mode édition ou création
  const [formData, setFormData] = useState({
    titre: '',
    contenu: '',
    extrait: '',
    categorie: 'camp',
    vedette: false,
    publie: false,
    images: []
  })
  const [imagePreviews, setImagePreviews] = useState([])
  const [existingImages, setExistingImages] = useState([])

  useEffect(() => {
    // Vérifier si c'est un nouvel article ou une modification
    if (id && id !== 'new') {
      setIsEditing(true)
      fetchArticle()
    } else {
      setIsEditing(false)
      // Réinitialiser le formulaire pour un nouvel article
      setFormData({
        titre: '',
        contenu: '',
        extrait: '',
        categorie: 'camp',
        vedette: false,
        publie: false,
        images: []
      })
      setExistingImages([])
      setImagePreviews([])
    }
  }, [id])

  const generateSlug = (titre) => {
    return titre
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Date.now()
  }

  const fetchArticle = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/admin/articles/${id}`)
      setFormData({
        titre: response.data.titre,
        contenu: response.data.contenu,
        extrait: response.data.extrait || '',
        categorie: response.data.categorie,
        vedette: response.data.vedette === 1 || response.data.vedette === true,
        publie: response.data.publie === 1 || response.data.publie === true,
        images: []
      })
      if (response.data.images && response.data.images.length > 0) {
        setExistingImages(response.data.images)
      }
    } catch (error) {
      console.error('Erreur chargement article:', error)
      setError("Impossible de charger l'article")
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + formData.images.length > 5) {
      alert('Maximum 5 images par article')
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

  const removeExistingImage = async (imageId) => {
    if (!confirm('Supprimer cette image ?')) return
    try {
      await api.delete(`/admin/articles/${id}/images/${imageId}`)
      setExistingImages(existingImages.filter(img => img.id !== imageId))
    } catch (error) {
      console.error('Erreur suppression image:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!formData.titre.trim()) {
      setError("Le titre est requis")
      setLoading(false)
      return
    }

    if (!formData.contenu.trim()) {
      setError("Le contenu est requis")
      setLoading(false)
      return
    }

    const formDataToSend = new FormData()
    
    formDataToSend.append('titre', formData.titre)
    formDataToSend.append('contenu', formData.contenu)
    formDataToSend.append('extrait', formData.extrait || '')
    formDataToSend.append('categorie', formData.categorie)
    formDataToSend.append('auteur_id', user.id)
    formDataToSend.append('vedette', formData.vedette ? '1' : '0')
    formDataToSend.append('publie', formData.publie ? '1' : '0')
    
    // Ajouter les images
    formData.images.forEach((image) => {
      formDataToSend.append('images', image)
    })

    try {
      if (!isEditing) {
        // Création d'un nouvel article
        const response = await api.post('/admin/articles', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        console.log('Article créé:', response.data)
      } else {
        // Modification d'un article existant
        const response = await api.put(`/admin/articles/${id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        console.log('Article mis à jour:', response.data)
      }
      
      navigate('/admin/articles')
    } catch (error) {
      console.error('Erreur détaillée:', error.response?.data || error.message)
      setError(error.response?.data?.message || "Erreur lors de la sauvegarde de l'article")
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    return `http://localhost:3001${imagePath}`
  }

  // Afficher le chargement seulement pour la modification
  if (isEditing && loading) {
    return (
      <div className="admin-layout">
        <main className="admin-main">
          <div className="admin-content">
            <div className="loading">Chargement...</div>
          </div>
        </main>
      </div>
    )
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
          <div className="admin-topbar-title">
            {!isEditing ? 'Nouvel article' : 'Modifier l\'article'}
          </div>
          <Link to="/admin/articles" className="btn">← Retour</Link>
        </div>

        <div className="admin-content">
          {error && (
            <div className="alert alert-error" style={{ 
              background: '#fee', 
              color: '#c00', 
              padding: '1rem', 
              borderRadius: '8px', 
              marginBottom: '1rem' 
            }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="admin-form">
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
              <label>Extrait *</label>
              <textarea
                rows="2"
                required
                value={formData.extrait}
                onChange={(e) => setFormData({...formData, extrait: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Contenu *</label>
              <textarea
                rows="10"
                required
                value={formData.contenu}
                onChange={(e) => setFormData({...formData, contenu: e.target.value})}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Catégorie</label>
                <select
                  value={formData.categorie}
                  onChange={(e) => setFormData({...formData, categorie: e.target.value})}
                >
                  {ARTICLE_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Images (max 5)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="file-input"
                />
                <small>Vous pouvez sélectionner plusieurs images (max 5)</small>
                
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
            </div>

            {existingImages.length > 0 && (
              <div className="form-group">
                <label>Images actuelles</label>
                <div className="existing-images">
                  {existingImages.map((img) => (
                    <div key={img.id} className="existing-image-item">
                      <img src={getImageUrl(img.image_url)} alt="" />
                      <button 
                        type="button"
                        onClick={() => removeExistingImage(img.id)}
                        className="delete-image"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.vedette}
                    onChange={(e) => setFormData({...formData, vedette: e.target.checked})}
                  />
                  Article à la une
                </label>
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.publie}
                    onChange={(e) => setFormData({...formData, publie: e.target.checked})}
                  />
                  Publier immédiatement
                </label>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Enregistrement...' : (isEditing ? 'Mettre à jour' : 'Créer l\'article')}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}