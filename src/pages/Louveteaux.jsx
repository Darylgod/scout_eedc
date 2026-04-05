import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { BRANCHES } from '../utils/constants'
import '../styles/hero.css'
import '../styles/cards.css'

export default function Louveteaux() {
  useScrollReveal()
  const branch = BRANCHES.louveteaux

  const activites = [
    'Jeux de piste et découverte de la nature',
    'Bricolage et activités manuelles',
    'Chants scouts et veillées',
    'Premières techniques scoutes',
    'Vie en meute et esprit d\'équipe'
  ]

  return (
    <>
      <section className="page-hero" style={{ background: `linear-gradient(135deg, ${branch.color} 0%, ${branch.color}cc 100%)` }}>
        <div className="container">
          <div className="breadcrumb">
            Accueil <span>/</span> Branches <span>/</span> {branch.label}
          </div>
          <h1>{branch.label}</h1>
          <p>{branch.age} · De notre mieux</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2">
            <div className="reveal">
              <div className="branch-header-icon">{branch.emoji}</div>
              <h2>Bienvenue dans la meute</h2>
              <p>
                Les Louveteaux vivent des aventures passionnantes à travers le jeu, la nature 
                et la vie en équipe. La meute est leur famille, la jungle leur terrain de jeu.
              </p>
              <p>
                La devise des Louveteaux est <strong>"De notre mieux"</strong>. Ils apprennent 
                à se dépasser, à aider les autres et à découvrir le monde qui les entoure.
              </p>
              <Link to="/rejoindre" className="btn btn-primary" style={{ background: branch.color, borderColor: branch.color }}>
                Inscrire mon enfant →
              </Link>
            </div>
            <div className="reveal activities-card" style={{ background: `${branch.color}10` }}>
              <h3>Activités phares</h3>
              <ul>
                {activites.map((activite, index) => (
                  <li key={index}>
                    <span>🐾</span> {activite}
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