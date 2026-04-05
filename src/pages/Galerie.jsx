import { useState, useEffect } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import api from '../utils/api'
import { formatDateShort } from '../utils/formatDate'

export default function Galerie() {
  useScrollReveal()
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategorie, setSelectedCategorie] = useState('tous')
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

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

  const GALERIE_CATEGORIES = [
    { value: 'camp', label: 'Camps', icon: '⛺' },
    { value: 'ceremonie', label: 'Cérémonies', icon: '🎖️' },
    { value: 'activite', label: 'Activités', icon: '⚽' },
    { value: 'formation', label: 'Formations', icon: '📚' },
    { value: 'autre', label: 'Autres', icon: '📸' }
  ]

  const filteredPhotos = selectedCategorie === 'tous'
    ? photos
    : photos.filter(p => p.categorie === selectedCategorie)

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath
    }
    const baseURL = 'http://localhost:3001'
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
    return `${baseURL}${cleanPath}`
  }

  const openModal = (photo) => {
    setSelectedPhoto(photo)
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    if (selectedPhoto && selectedPhoto.images && selectedPhoto.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % selectedPhoto.images.length)
    }
  }

  const prevImage = () => {
    if (selectedPhoto && selectedPhoto.images && selectedPhoto.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + selectedPhoto.images.length) % selectedPhoto.images.length)
    }
  }

  const getCurrentImageUrl = () => {
    if (!selectedPhoto) return null
    if (selectedPhoto.images && selectedPhoto.images.length > 0) {
      return getImageUrl(selectedPhoto.images[currentImageIndex].image_url)
    }
    return getImageUrl(selectedPhoto.image)
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            Accueil <span>/</span> Galerie
          </div>
          <h1>Galerie photos</h1>
          <p>Découvrez les moments forts de la vie scoute à l'EEDC Cameroun.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="categories-filter reveal" style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button 
              className={`filter-btn ${selectedCategorie === 'tous' ? 'active' : ''}`}
              onClick={() => setSelectedCategorie('tous')}
              style={{ 
                padding: '0.5rem 1rem', 
                background: selectedCategorie === 'tous' ? 'var(--or)' : 'var(--gris-clair)', 
                color: selectedCategorie === 'tous' ? 'var(--bleu)' : 'var(--texte)', 
                border: '1px solid var(--gris-moyen)', 
                borderRadius: 'var(--rayon)', 
                cursor: 'pointer', 
                transition: 'var(--transition)' 
              }}
            >
              Tous
            </button>
            {GALERIE_CATEGORIES.map(cat => (
              <button
                key={cat.value}
                className={`filter-btn ${selectedCategorie === cat.value ? 'active' : ''}`}
                onClick={() => setSelectedCategorie(cat.value)}
                style={{ 
                  padding: '0.5rem 1rem', 
                  background: selectedCategorie === cat.value ? 'var(--or)' : 'var(--gris-clair)', 
                  color: selectedCategorie === cat.value ? 'var(--bleu)' : 'var(--texte)', 
                  border: '1px solid var(--gris-moyen)', 
                  borderRadius: 'var(--rayon)', 
                  cursor: 'pointer', 
                  transition: 'var(--transition)' 
                }}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-spinner">Chargement...</div>
          ) : filteredPhotos.length === 0 ? (
            <div className="empty-state">
              <p>Aucune photo dans cette catégorie.</p>
            </div>
          ) : (
            <div className="grid-3">
              {filteredPhotos.map((photo, index) => (
                <div 
                  key={photo.id} 
                  className="actu-card hover-lift reveal"
                  style={{ 
                    animationDelay: `${index * 0.1}s`, 
                    textDecoration: 'none', 
                    display: 'block',
                    cursor: 'pointer'
                  }}
                  onClick={() => openModal(photo)}
                >
                  <div className="actu-card-img" style={{ 
                    height: '200px', 
                    background: 'var(--gris-clair)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '2.5rem',
                    overflow: 'hidden',
                    position: 'relative'
                  }}>
                    {photo.images && photo.images.length > 0 ? (
                      <>
                        <img 
                          src={getImageUrl(photo.images[0].image_url)} 
                          alt={photo.titre} 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.parentElement.innerHTML = `<div style="font-size: 2.5rem">
                              ${photo.categorie === 'camp' ? '⛺' : 
                                photo.categorie === 'ceremonie' ? '🎖️' : 
                                photo.categorie === 'activite' ? '⚽' : 
                                photo.categorie === 'formation' ? '📚' : '📸'}
                            </div>`
                          }}
                        />
                        {photo.images.length > 1 && (
                          <div style={{
                            position: 'absolute',
                            bottom: '10px',
                            right: '10px',
                            background: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            📸 {photo.images.length}
                          </div>
                        )}
                      </>
                    ) : photo.image ? (
                      <img 
                        src={getImageUrl(photo.image)} 
                        alt={photo.titre} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.parentElement.innerHTML = `<div style="font-size: 2.5rem">
                            ${photo.categorie === 'camp' ? '⛺' : 
                              photo.categorie === 'ceremonie' ? '🎖️' : 
                              photo.categorie === 'activite' ? '⚽' : 
                              photo.categorie === 'formation' ? '📚' : '📸'}
                          </div>`
                        }}
                      />
                    ) : (
                      <div>
                        {photo.categorie === 'camp' && '⛺'}
                        {photo.categorie === 'ceremonie' && '🎖️'}
                        {photo.categorie === 'activite' && '⚽'}
                        {photo.categorie === 'formation' && '📚'}
                        {photo.categorie === 'autre' && '📸'}
                      </div>
                    )}
                  </div>
                  <div className="actu-card-body" style={{ padding: '1.2rem' }}>
                    <div className="actu-card-tag" style={{ 
                      fontSize: '10px', 
                      fontWeight: '700', 
                      letterSpacing: '1.5px', 
                      color: 'var(--vert)', 
                      textTransform: 'uppercase', 
                      marginBottom: '8px' 
                    }}>
                      {photo.categorie}
                    </div>
                    <h3 className="actu-card-title" style={{ 
                      fontFamily: 'var(--font-titre)', 
                      fontSize: '15px', 
                      fontWeight: '700', 
                      color: 'var(--bleu)', 
                      lineHeight: '1.4', 
                      marginBottom: '8px' 
                    }}>
                      {photo.titre}
                    </h3>
                    {photo.description && (
                      <p className="actu-card-excerpt" style={{ 
                        fontSize: '13px', 
                        color: 'var(--texte-light)', 
                        marginBottom: '12px', 
                        lineHeight: '1.5' 
                      }}>
                        {photo.description.length > 100 
                          ? photo.description.substring(0, 100) + '...' 
                          : photo.description}
                      </p>
                    )}
                    <div className="actu-card-footer" style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      fontSize: '12px', 
                      color: 'var(--gris-fonce)' 
                    }}>
                      <span className="actu-card-date">{formatDateShort(photo.created_at)}</span>
                      <span className="actu-card-views">
                        📸 {photo.images ? photo.images.length : 1} photo(s)
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal avec carrousel */}
      {selectedPhoto && (
        <div className="modal-overlay" onClick={() => setSelectedPhoto(null)}>
          <div className="modal-content modal-carousel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedPhoto.titre}</h3>
              <button className="modal-close" onClick={() => setSelectedPhoto(null)}>✕</button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', position: 'relative' }}>
              {/* Images en carrousel */}
              <div className="carousel-container">
                <img 
                  src={getCurrentImageUrl()} 
                  alt={selectedPhoto.titre} 
                  className="carousel-image"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.parentElement.innerHTML = '<div style="font-size: 5rem; padding: 3rem;">📸</div>'
                  }}
                />
                
                {/* Boutons précédent/suivant si plusieurs images */}
                {selectedPhoto.images && selectedPhoto.images.length > 1 && (
                  <>
                    <button className="carousel-prev" onClick={prevImage}>
                      ❮
                    </button>
                    <button className="carousel-next" onClick={nextImage}>
                      ❯
                    </button>
                    <div className="carousel-counter">
                      {currentImageIndex + 1} / {selectedPhoto.images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Miniatures pour les images multiples */}
              {selectedPhoto.images && selectedPhoto.images.length > 1 && (
                <div className="carousel-thumbnails">
                  {selectedPhoto.images.map((img, idx) => (
                    <div
                      key={img.id}
                      className={`thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(idx)}
                    >
                      <img src={getImageUrl(img.image_url)} alt={`Miniature ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              )}

              {selectedPhoto.description && (
                <p className="modal-description">{selectedPhoto.description}</p>
              )}
              
              <div className="galerie-meta" style={{ 
                marginTop: '1rem', 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '1rem', 
                fontSize: '0.75rem', 
                color: 'var(--gris-fonce)' 
              }}>
                <span>{selectedPhoto.categorie}</span>
                <span>{formatDateShort(selectedPhoto.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}