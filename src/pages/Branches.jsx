import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { BRANCHES } from '../utils/constants'
import '../styles/hero.css'
import '../styles/cards.css'

export default function Branches() {
  useScrollReveal()

  const branchesList = Object.entries(BRANCHES).map(([key, value]) => ({
    id: key,
    ...value
  }))

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            Accueil <span>/</span> Branches
          </div>
          <h1>Les branches EEDC</h1>
          <p>Un parcours éducatif adapté à chaque âge, de 7 à 22 ans.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
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
                  <p className="branch-card-desc">
                    {branch.id === 'louveteaux' && 'Découverte du monde à travers le jeu et l\'aventure.'}
                    {branch.id === 'eclaireurs' && 'Camps, projets ODD et développement du caractère.'}
                    {branch.id === 'pionniers' && 'Leadership, projets communautaires et ODD concrets.'}
                    {branch.id === 'routiers' && 'Service, engagement citoyen et formation de chefs.'}
                  </p>
                  <div className="branch-card-link">Découvrir →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}