import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import api from '../utils/api'
import { formatDate, getReadingTime } from '../utils/formatDate'
import '../styles/hero.css'
import '../styles/cards.css'
import '../styles/article.css'

export default function Article() {
  const { slug } = useParams()
  useScrollReveal()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showGallery, setShowGallery] = useState(false)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/articles/${slug}`)
        setArticle(response.data)
      } catch (err) {
        console.error('Erreur chargement article:', err)
        setError('Article non trouvé')
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [slug])

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    return `http://localhost:3001${imagePath}`
  }

  const openGallery = (index) => {
    setCurrentImageIndex(index)
    setShowGallery(true)
  }

  const nextImage = () => {
    if (article && article.images && article.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % article.images.length)
    }
  }

  const prevImage = () => {
    if (article && article.images && article.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + article.images.length) % article.images.length)
    }
  }

  if (loading) {
    return (
      <section className="section" style={{ paddingTop: '100px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="loading-spinner">Chargement de l'article...</div>
        </div>
      </section>
    )
  }

  if (error || !article) {
    return (
      <section className="section" style={{ paddingTop: '100px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ marginBottom: '1rem' }}>Article non trouvé</h1>
          <p style={{ marginBottom: '2rem', color: 'var(--texte-light)' }}>
            L'article que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Link to="/actualites" className="btn btn-primary">
            Retour aux actualités
          </Link>
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            Accueil <span>/</span> Actualités <span>/</span> {article.titre}
          </div>
          <h1>{article.titre}</h1>
          <div className="article-meta">
            <span>📅 {formatDate(article.published_at)}</span>
            <span>⏱️ {getReadingTime(article.contenu)} min de lecture</span>
            <span>🏷️ {article.categorie}</span>
            {article.vues && <span>👁️ {article.vues} vues</span>}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="article-layout">
            <div className="article-content reveal">
              {/* Galerie d'images */}
              {article.images && article.images.length > 0 && (
                <div className="article-gallery">
                  <div className="main-image">
                    <img 
                      src={getImageUrl(article.images[currentImageIndex]?.image_url || article.image)} 
                      alt={article.titre} 
                      onClick={() => openGallery(currentImageIndex)}
                    />
                    {article.images.length > 1 && (
                      <>
                        <button className="gallery-prev" onClick={prevImage}>❮</button>
                        <button className="gallery-next" onClick={nextImage}>❯</button>
                        <div className="image-counter">
                          {currentImageIndex + 1} / {article.images.length}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {article.images.length > 1 && (
                    <div className="thumbnail-list">
                      {article.images.map((img, index) => (
                        <div 
                          key={img.id}
                          className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <img src={getImageUrl(img.image_url)} alt={`Miniature ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Contenu de l'article */}
              <div className="article-body" dangerouslySetInnerHTML={{ __html: article.contenu }} />

              {/* Extrait si présent */}
              {article.extrait && (
                <div className="article-extrait">
                  <h4>En résumé</h4>
                  <p>{article.extrait}</p>
                </div>
              )}
            </div>

            <div className="article-sidebar reveal">
              <div className="author-card">
                <h3>✍️ À propos de l'auteur</h3>
                <p className="author-name">
                  {article.prenom} {article.nom}
                </p>
                <small>Publié le {formatDate(article.published_at)}</small>
              </div>

              <div className="info-card">
                <h3>📊 Informations</h3>
                <ul>
                  <li>📅 Date de publication: {formatDate(article.published_at)}</li>
                  <li>⏱️ Temps de lecture: {getReadingTime(article.contenu)} min</li>
                  <li>🏷️ Catégorie: {article.categorie}</li>
                  {article.vues && <li>👁️ Vues: {article.vues}</li>}
                </ul>
              </div>

              <Link to="/actualites" className="btn btn-outline" style={{ width: '100%', textAlign: 'center' }}>
                ← Toutes les actualités
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modal pour la galerie plein écran */}
      {showGallery && article.images && article.images.length > 0 && (
        <div className="modal-overlay" onClick={() => setShowGallery(false)}>
          <div className="modal-gallery" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowGallery(false)}>✕</button>
            <div className="modal-gallery-container">
              <img 
                src={getImageUrl(article.images[currentImageIndex]?.image_url)} 
                alt={article.titre}
              />
              {article.images.length > 1 && (
                <>
                  <button className="modal-prev" onClick={prevImage}>❮</button>
                  <button className="modal-next" onClick={nextImage}>❯</button>
                </>
              )}
            </div>
            <div className="modal-counter">
              {currentImageIndex + 1} / {article.images.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
}