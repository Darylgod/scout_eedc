import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import api from '../utils/api'
import { formatDateShort } from '../utils/formatDate'
import { ARTICLE_CATEGORIES } from '../utils/constants'
import '../styles/hero.css'
import '../styles/cards.css'

export default function Actualites() {
  useScrollReveal()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategorie, setSelectedCategorie] = useState('tous')

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await api.get('/articles')
      setArticles(response.data)
    } catch (error) {
      console.error('Erreur chargement articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = selectedCategorie === 'tous'
    ? articles
    : articles.filter(a => a.categorie === selectedCategorie)

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            Accueil <span>/</span> Actualités
          </div>
          <h1>Actualités & Blog</h1>
          <p>Restez informés des dernières nouvelles de l'EEDC Cameroun.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="categories-filter reveal" style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button 
              className={`filter-btn ${selectedCategorie === 'tous' ? 'active' : ''}`}
              onClick={() => setSelectedCategorie('tous')}
              style={{ padding: '0.5rem 1rem', background: selectedCategorie === 'tous' ? 'var(--or)' : 'var(--gris-clair)', color: selectedCategorie === 'tous' ? 'var(--bleu)' : 'var(--texte)', border: '1px solid var(--gris-moyen)', borderRadius: 'var(--rayon)', cursor: 'pointer', transition: 'var(--transition)' }}
            >
              Tous
            </button>
            {ARTICLE_CATEGORIES.map(cat => (
              <button
                key={cat.value}
                className={`filter-btn ${selectedCategorie === cat.value ? 'active' : ''}`}
                onClick={() => setSelectedCategorie(cat.value)}
                style={{ padding: '0.5rem 1rem', background: selectedCategorie === cat.value ? 'var(--or)' : 'var(--gris-clair)', color: selectedCategorie === cat.value ? 'var(--bleu)' : 'var(--texte)', border: '1px solid var(--gris-moyen)', borderRadius: 'var(--rayon)', cursor: 'pointer', transition: 'var(--transition)' }}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-spinner">Chargement...</div>
          ) : filteredArticles.length === 0 ? (
            <div className="empty-state">
              <p>Aucun article dans cette catégorie.</p>
            </div>
          ) : (
            <div className="grid-3">
              {filteredArticles.map((article, index) => (
                <Link 
                  to={`/actualites/${article.slug}`} 
                  key={article.id} 
                  className="actu-card hover-lift reveal"
                  style={{ animationDelay: `${index * 0.1}s`, textDecoration: 'none', display: 'block' }}
                >
                  <div className="actu-card-img" style={{ height: '180px', background: 'var(--gris-clair)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                    {article.image ? (
                      <img src={article.image} alt={article.titre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div>
                        {article.categorie === 'camp' && '⛺'}
                        {article.categorie === 'ceremonie' && '🎖️'}
                        {article.categorie === 'odd' && '🌍'}
                        {article.categorie === 'formation' && '📚'}
                      </div>
                    )}
                  </div>
                  <div className="actu-card-body" style={{ padding: '1.2rem' }}>
                    <div className="actu-card-tag" style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '1.5px', color: 'var(--vert)', textTransform: 'uppercase', marginBottom: '8px' }}>
                      {article.categorie}
                    </div>
                    <h3 className="actu-card-title" style={{ fontFamily: 'var(--font-titre)', fontSize: '15px', fontWeight: '700', color: 'var(--bleu)', lineHeight: '1.4', marginBottom: '8px' }}>
                      {article.titre}
                    </h3>
                    <p className="actu-card-excerpt" style={{ fontSize: '13px', color: 'var(--texte-light)', marginBottom: '12px', lineHeight: '1.5' }}>
                      {article.extrait}
                    </p>
                    <div className="actu-card-footer" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--gris-fonce)' }}>
                      <span className="actu-card-date">{formatDateShort(article.published_at)}</span>
                      <span className="actu-card-views">👁️ {article.vues || 0}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}