import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import api from '../utils/api'
import { BRANCHES } from '../utils/constants'
import '../styles/hero.css'
import '../styles/forms.css'
import '../styles/cards.css'

export default function Rejoindre() {
  useScrollReveal()
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    date_naissance: '',
    branche_souhaitee: '',
    region: '',
    unite_souhaitee: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      await api.post('/inscriptions', formData)
      setSuccess(true)
      setFormData({
        nom: '', prenom: '', email: '', telephone: '', date_naissance: '',
        branche_souhaitee: '', region: '', unite_souhaitee: '', message: ''
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi')
    } finally {
      setLoading(false)
    }
  }

  const faqs = [
    { q: 'Quel est le coût de l\'inscription ?', a: 'Les frais d\'inscription varient selon la branche et la région. Contactez-nous pour plus de détails.' },
    { q: 'Faut-il être Camerounais pour rejoindre ?', a: 'Non, l\'EEDC est ouvert à tous les jeunes résidant au Cameroun.' },
    { q: 'Quand commencent les activités ?', a: 'Les activités reprennent en septembre et se déroulent tout au long de l\'année scolaire.' },
    { q: 'Que dois-je apporter ?', a: 'Un certificat de naissance, des photos d\'identité et un certificat médical récent.' }
  ]

  if (success) {
    return (
      <>
        <section className="page-hero">
          <div className="container">
            <div className="breadcrumb">Accueil <span>/</span> Rejoindre</div>
            <h1>Merci pour votre inscription !</h1>
          </div>
        </section>
        <section className="section">
          <div className="container" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
            <h2>Votre demande a bien été envoyée</h2>
            <p style={{ marginTop: '1rem' }}>Nous vous contacterons dans les plus brefs délais pour finaliser votre inscription.</p>
            <button onClick={() => setSuccess(false)} className="btn btn-primary" style={{ marginTop: '2rem' }}>
              Envoyer une autre demande
            </button>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            Accueil <span>/</span> Rejoindre
          </div>
          <h1>Rejoignez l'aventure</h1>
          <p>Inscrivez-vous dès maintenant et devenez Éclaireur ou Éclaireuse du Cameroun.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2">
            <div className="reveal">
              <div className="form-section">
                <h2 className="form-title">Formulaire d'inscription</h2>
                {error && <div className="alert error">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Nom *</label>
                      <input type="text" className="form-input" required value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Prénom *</label>
                      <input type="text" className="form-input" required value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input type="email" className="form-input" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Téléphone *</label>
                      <input type="tel" className="form-input" required value={formData.telephone} onChange={(e) => setFormData({...formData, telephone: e.target.value})} />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Date de naissance *</label>
                      <input type="date" className="form-input" required value={formData.date_naissance} onChange={(e) => setFormData({...formData, date_naissance: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Branche souhaitée *</label>
                      <select className="form-select" required value={formData.branche_souhaitee} onChange={(e) => setFormData({...formData, branche_souhaitee: e.target.value})}>
                        <option value="">Sélectionnez une branche</option>
                        {Object.entries(BRANCHES).map(([key, value]) => (
                          <option key={key} value={key}>{value.label} ({value.age})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Région *</label>
                      <input type="text" className="form-input" required value={formData.region} onChange={(e) => setFormData({...formData, region: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Unité (optionnel)</label>
                      <input type="text" className="form-input" value={formData.unite_souhaitee} onChange={(e) => setFormData({...formData, unite_souhaitee: e.target.value})} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message (optionnel)</label>
                    <textarea className="form-textarea" rows="3" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
                  </div>

                  <div className="form-submit">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Envoi en cours...' : 'Envoyer ma candidature →'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div>
              <div className="info-box reveal" style={{ background: 'var(--gris-clair)', borderRadius: 'var(--rayon-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ color: 'var(--bleu)', marginBottom: '1rem' }}>Pourquoi rejoindre l'EEDC ?</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '0.5rem' }}>✓ Développement personnel et leadership</li>
                  <li style={{ marginBottom: '0.5rem' }}>✓ Activités de plein air et camps</li>
                  <li style={{ marginBottom: '0.5rem' }}>✓ Engagement communautaire</li>
                  <li style={{ marginBottom: '0.5rem' }}>✓ Amitiés durables</li>
                  <li style={{ marginBottom: '0.5rem' }}>✓ Reconnaissance internationale (OMMS)</li>
                </ul>
              </div>

              <div className="faq-box reveal" style={{ background: 'var(--blanc)', borderRadius: 'var(--rayon-lg)', padding: '1.5rem', border: '1px solid var(--gris-moyen)' }}>
                <h3 style={{ color: 'var(--bleu)', marginBottom: '1rem' }}>Questions fréquentes</h3>
                {faqs.map((faq, i) => (
                  <details key={i} style={{ marginBottom: '0.5rem', borderBottom: '1px solid var(--gris-moyen)', paddingBottom: '0.5rem' }}>
                    <summary style={{ fontWeight: '600', cursor: 'pointer', color: 'var(--vert)' }}>{faq.q}</summary>
                    <p style={{ marginTop: '0.5rem', color: 'var(--texte-light)', fontSize: '0.85rem' }}>{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}