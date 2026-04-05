import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { BRANCHES } from '../utils/constants'
import '../styles/hero.css'
import '../styles/cards.css'

export default function Eclaireurs() {
  useScrollReveal()
  const branch = BRANCHES.eclaireurs

  const activites = [
    'Camps et expéditions',
    'Orientation et vie en plein air',
    'Projets ODD et engagement citoyen',
    'Service communautaire',
    'Techniques scouts avancées'
  ]

  return (
    <>
      <section className="page-hero" style={{ background: `linear-gradient(135deg, ${branch.color} 0%, ${branch.color}cc 100%)` }}>
        <div className="container">
          <div className="breadcrumb">
            Accueil <span>/</span> Branches <span>/</span> {branch.label}
          </div>
          <h1>{branch.label}</h1>
          <p>{branch.age} · Toujours Prêt</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2">
            <div className="reveal">
              <div className="branch-header-icon">{branch.emoji}</div>
              <h2>La troupe des Éclaireurs</h2>
              <p>
                Les Éclaireurs vivent en patrouilles, apprennent l'autonomie et développent leur 
                leadership à travers des camps, des projets et des défis passionnants.
              </p>
              <p>
                Leur devise <strong>"Toujours Prêt"</strong> les guide dans leur engagement 
                quotidien pour servir les autres et protéger la nature.
              </p>
              <Link to="/rejoindre" className="btn btn-primary" style={{ background: branch.color, borderColor: branch.color }}>
                Rejoindre la troupe →
              </Link>
            </div>
            <div className="reveal activities-card" style={{ background: `${branch.color}10` }}>
              <h3>Activités phares</h3>
              <ul>
                {activites.map((activite, index) => (
                  <li key={index}>
                    <span>⚡</span> {activite}
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