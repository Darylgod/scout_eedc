import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { BRANCHES } from '../utils/constants'
import api from '../utils/api'
import { useState, useEffect } from 'react'
import { formatDateShort } from '../utils/formatDate'
import logo from '../assets/logo.png'
import '../styles/hero.css'
import '../styles/cards.css'

export default function Accueil() {
  useScrollReveal()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get('/articles?limit=3')
        setArticles(response.data)
      } catch (error) {
        console.error('Erreur chargement articles:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  const branchesList = Object.entries(BRANCHES).map(([key, value]) => ({
    id: key,
    ...value
  }))

  const temoignages = [
    {
      id: 1,
      texte: "Le scoutisme m'a appris à être autonome, à travailler en équipe et à me dépasser. C'est bien plus qu'une activité — c'est une école de vie.",
      nom: 'Awa Mbolle',
      role: 'Éclaireuse · 14 ans',
      initiales: 'AM',
      couleur: '#003087'
    },
    {
      id: 2,
      texte: "En tant que parent, voir mon fils évoluer, prendre des responsabilités et s'engager pour sa communauté est une fierté immense.",
      nom: 'Paul Nkoudou',
      role: 'Parent · Douala',
      initiales: 'PN',
      couleur: '#1A7A4A'
    },
    {
      id: 3,
      texte: "Diriger une patrouille, c'est ma première vraie expérience de leadership. Les formations de l'EEDC m'ont donné des outils concrets.",
      nom: 'Jean Fotso',
      role: "Chef d'Unité · Yaoundé",
      initiales: 'JF',
      couleur: '#D4A017'
    }
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-inner">
            <div className="hero-content animate-fade-in-up">
              <div className="hero-badge">🇨🇲 OMMS · Scoutisme Camerounais</div>
              <h1>
                L'Unité Scoute<br />
                en <span className="accent">Mouvement</span>
              </h1>
              <p className="hero-desc">
                Rejoignez les Éclaireurs & Éclaireuses du Cameroun — un programme
                de développement pour les jeunes de 7 à 22 ans. Valeurs, aventure, engagement.
              </p>
              <div className="hero-btns">
                <Link to="/rejoindre" className="btn btn-primary">
                  Rejoindre l'EEDC →
                </Link>
                <Link to="/qui-sommes-nous" className="btn btn-outline">
                  En savoir plus
                </Link>
              </div>
            </div>
            <div className="hero-visual animate-fade-in delay-300">
              <div className="hero-logo-wrapper">
                <div className="hero-logo-ring" />
                <div className="hero-logo-ring-2" />
                <img src={logo} alt="EEDC" className="hero-logo" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">4</div>
              <div className="stat-label">Branches scoutes</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">7–22</div>
              <div className="stat-label">Ans · tous bienvenus</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">OMMS</div>
              <div className="stat-label">Reconnu mondialement</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2026</div>
              <div className="stat-label">Relancement officiel</div>
            </div>
          </div>
        </div>
      </div>

      {/* Branches Section */}
      <section className="section-alt">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label reveal">Nos programmes</div>
              <h2 className="reveal">Les 4 branches EEDC</h2>
            </div>
            <Link to="/branches" className="see-all-link">
              Voir tout →
            </Link>
          </div>
          <div className="grid-4">
            {branchesList.map((branch, index) => (
              <Link 
                to={`/branches/${branch.id}`} 
                key={branch.id} 
                className="branch-card hover-lift reveal"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="branch-card-img" style={{ background: `${branch.color}20` }}>
                  <span className="branch-emoji">{branch.emoji}</span>
                </div>
                <div className="branch-card-body">
                  <h3 className="branch-card-name" style={{ color: branch.color }}>
                    {branch.label}
                  </h3>
                  <div className="branch-card-age">{branch.age}</div>
                  <div className="branch-card-link">Découvrir →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Actualités Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-label reveal">Blog</div>
              <h2 className="reveal">Dernières actualités</h2>
            </div>
            <Link to="/actualites" className="see-all-link">
              Toutes les actualités →
            </Link>
          </div>
          <div className="grid-3">
            {loading ? (
              <div className="loading-spinner">Chargement...</div>
            ) : articles.length === 0 ? (
              <div className="empty-state">Aucun article pour le moment.</div>
            ) : (
              articles.map((article, index) => (
                <Link 
                  to={`/actualites/${article.slug}`} 
                  key={article.id} 
                  className="actu-card hover-lift reveal"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="actu-card-img">
                    {article.image ? (
                      <img src={article.image} alt={article.titre} />
                    ) : (
                      <div className="actu-card-placeholder">
                        {article.categorie === 'camp' && '⛺'}
                        {article.categorie === 'ceremonie' && '🎖️'}
                        {article.categorie === 'odd' && '🌍'}
                        {article.categorie === 'formation' && '📚'}
                        {!article.categorie && '📰'}
                      </div>
                    )}
                  </div>
                  <div className="actu-card-body">
                    <div className="actu-card-tag">{article.categorie}</div>
                    <h3 className="actu-card-title">{article.titre}</h3>
                    <p className="actu-card-excerpt">{article.extrait}</p>
                    <div className="actu-card-date">
                      {formatDateShort(article.published_at)}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Témoignages Section */}
      <section className="section-alt">
        <div className="container">
          <div className="section-header centered">
            <div className="section-label">Témoignages</div>
            <h2>Ce qu'ils disent de nous</h2>
          </div>
          <div className="grid-3">
            {temoignages.map((t, index) => (
              <div key={t.id} className="temoignage-card hover-lift reveal" style={{ animationDelay: `${index * 0.1}s` }}>
                <p className="temoignage-texte">"{t.texte}"</p>
                <div className="temoignage-auteur">
                  <div className="temoignage-avatar" style={{ background: t.couleur }}>{t.initiales}</div>
                  <div>
                    <div className="temoignage-nom">{t.nom}</div>
                    <div className="temoignage-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <div>
              <h2>Prêt à rejoindre l'aventure scoute ?</h2>
              <p>Inscription ouverte · Tous les niveaux · Tout le Cameroun</p>
            </div>
            <Link to="/rejoindre" className="btn btn-white">
              S'inscrire maintenant →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}