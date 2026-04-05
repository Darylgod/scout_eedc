import { useScrollReveal } from '../hooks/useScrollReveal'
import '../styles/hero.css'
import '../styles/cards.css'

export default function QuiSommesNous() {
  useScrollReveal()

  const valeurs = [
    { titre: 'Fraternité', desc: 'Respect et entraide entre tous les membres, sans distinction.' },
    { titre: 'Service', desc: "S'engager pour les autres et pour la communauté." },
    { titre: 'Nature', desc: "Protéger et respecter l'environnement." },
    { titre: 'Progrès', desc: 'Développer ses talents et se dépasser.' },
  ]

  const equipe = [
    { nom: 'Commissaire Exécutif', role: 'Direction générale', initiales: 'CX', couleur: '#003087' },
    { nom: 'Secrétaire Général', role: 'Administration', initiales: 'SG', couleur: '#1A7A4A' },
    { nom: 'NACOM', role: 'Communication', initiales: 'NC', couleur: '#D4A017' },
    { nom: 'NAFOR', role: 'Formation', initiales: 'NF', couleur: '#6C3D91' },
  ]

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            Accueil <span>/</span> Qui sommes-nous
          </div>
          <h1>Qui sommes-nous ?</h1>
          <p>
            Découvrez l'histoire, les valeurs et la mission des Éclaireurs & Éclaireuses du Cameroun.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-content reveal" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div className="section-label centered">Notre histoire</div>
            <h2 className="centered">
              Depuis 2025, <span className="accent">une aventure humaine</span>
            </h2>
            <p style={{ marginBottom: '1rem' }}>
              Les Éclaireurs & Éclaireuses du Cameroun (EEDC) est une association scoute laïque,
              membre de l'Organisation Mondiale du Mouvement Scout (OMMS). Notre mission est de
              contribuer au développement des jeunes en les aidant à réaliser pleinement leurs
              potentiels physiques, intellectuels, sociaux et spirituels.
            </p>
            <p>
              Forts de nos valeurs et de notre engagement, nous accompagnons chaque année des
              centaines de jeunes camerounais dans leur parcours d'apprentissage et de citoyenneté.
            </p>
          </div>
        </div>
      </section>

      <section className="section-alt">
        <div className="container">
          <div className="grid-2">
            <div className="mission-card reveal">
              <div className="mission-icon">🎯</div>
              <h3>Notre Mission</h3>
              <p>
                Éduquer les jeunes par une méthode qui combine l'action, le jeu, la vie en équipe 
                et l'engagement citoyen, pour former des adultes responsables et acteurs du changement.
              </p>
            </div>
            <div className="vision-card reveal">
              <div className="vision-icon">👁️</div>
              <h3>Notre Vision</h3>
              <p>
                Être le mouvement de référence pour la jeunesse camerounaise, contribuant à une 
                société plus juste, solidaire et respectueuse de l'environnement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header centered">
            <div className="section-label">Nos fondamentaux</div>
            <h2>Nos valeurs</h2>
          </div>
          <div className="grid-4">
            {valeurs.map((valeur, index) => (
              <div key={index} className="valeur-card reveal" style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--gris-clair)', borderRadius: 'var(--rayon-lg)' }}>
                <h3 style={{ color: 'var(--bleu)', marginBottom: '0.5rem' }}>{valeur.titre}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--texte-light)' }}>{valeur.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-alt">
        <div className="container">
          <div className="section-header centered">
            <div className="section-label">Direction nationale</div>
            <h2>L'équipe dirigeante</h2>
          </div>
          <div className="grid-3">
            {equipe.map((membre, index) => (
              <div key={index} className="membre-card reveal" style={{ textAlign: 'center', background: 'var(--blanc)', padding: '2rem', borderRadius: 'var(--rayon-lg)', border: '1px solid var(--gris-moyen)' }}>
                <div className="membre-avatar" style={{ width: '80px', height: '80px', margin: '0 auto 1rem', background: membre.couleur, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                  {membre.initiales}
                </div>
                <h3 style={{ color: 'var(--bleu)' }}>{membre.nom}</h3>
                <p className="membre-role" style={{ color: 'var(--or)', fontSize: '0.85rem', fontWeight: '600' }}>{membre.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}