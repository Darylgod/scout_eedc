import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { BRANCHES } from '../utils/constants'
import '../styles/hero.css'
import '../styles/cards.css'

export default function Pionniers() {
  useScrollReveal()
  const branch = BRANCHES.pionniers

  const activites = [
    'Projets ODD concrets',
    'Leadership et gestion d\'équipe',
    'Chantiers et travaux communautaires',
    'Formation Prewarrant',
    'Camps de haute montagne'
  ]

  return (
    <>
      <section className="page-hero" style={{ background: `linear-gradient(135deg, ${branch.color} 0%, ${branch.color}cc 100%)` }}>
        <div className="container">
          <div className="breadcrumb">
            Accueil <span>/</span> Branches <span>/</span> {branch.label}
          </div>
          <h1>{branch.label}</h1>
          <p>{branch.age} · Bâtir et Servir</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2">
            <div className="reveal">
              <div className="branch-header-icon">{branch.emoji}</div>
              <h2>La compagnie des Pionniers</h2>
              <p>
                Les Pionniers mènent des projets concrets, s'engagent dans la communauté et préparent 
                leur avenir citoyen et professionnel.
              </p>
              <p>
                Leur devise <strong>"Bâtir et Servir"</strong> reflète leur engagement à construire 
                un monde meilleur par l'action.
              </p>
              <Link to="/rejoindre" className="btn btn-primary" style={{ background: branch.color, borderColor: branch.color }}>
                Devenir Pionnier →
              </Link>
            </div>
            <div className="reveal activities-card" style={{ background: `${branch.color}10` }}>
              <h3>Activités phares</h3>
              <ul>
                {activites.map((activite, index) => (
                  <li key={index}>
                    <span>🏗️</span> {activite}
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