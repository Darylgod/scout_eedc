import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { BRANCHES } from '../utils/constants'
import '../styles/hero.css'
import '../styles/cards.css'

export default function Routiers() {
  useScrollReveal()
  const branch = BRANCHES.routiers

  const activites = [
    'Service national et international',
    'Formation de chefs',
    'Projets internationaux',
    'Webinaires et conférences',
    'Mentorat et accompagnement'
  ]

  return (
    <>
      <section className="page-hero" style={{ background: `linear-gradient(135deg, ${branch.color} 0%, ${branch.color}cc 100%)` }}>
        <div className="container">
          <div className="breadcrumb">
            Accueil <span>/</span> Branches <span>/</span> {branch.label}
          </div>
          <h1>{branch.label}</h1>
          <p>{branch.age} · Servir</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2">
            <div className="reveal">
              <div className="branch-header-icon">{branch.emoji}</div>
              <h2>Le clan des Routiers</h2>
              <p>
                Les Routiers s'engagent dans le service, accompagnent les plus jeunes et vivent 
                des expériences de solidarité internationale.
              </p>
              <p>
                Leur devise <strong>"Servir"</strong> est l'aboutissement du parcours scout, 
                un engagement de vie au service des autres.
              </p>
              <Link to="/rejoindre" className="btn btn-primary" style={{ background: branch.color, borderColor: branch.color }}>
                Rejoindre le clan →
              </Link>
            </div>
            <div className="reveal activities-card" style={{ background: `${branch.color}10` }}>
              <h3>Activités phares</h3>
              <ul>
                {activites.map((activite, index) => (
                  <li key={index}>
                    <span>🌍</span> {activite}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}