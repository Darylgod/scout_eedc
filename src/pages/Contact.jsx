import { useState } from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import api from '../utils/api'
import '../styles/hero.css'
import '../styles/forms.css'
import '../styles/cards.css'

export default function Contact() {
  useScrollReveal()
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
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
      await api.post('/contact', formData)
      setSuccess(true)
      setFormData({ nom: '', email: '', sujet: '', message: '' })
    } catch (err) {
      setError('Erreur lors de l\'envoi. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  const infos = [
    { icon: '📍', title: 'Adresse', content: 'Yaoundé, Cameroun' },
    { icon: '📧', title: 'Email', content: 'contact@eedc.cm', link: 'mailto:contact@eedc.cm' },
    { icon: '📞', title: 'Téléphone', content: '+237 699 887 766', link: 'tel:+237699887766' },
  ]

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            Accueil <span>/</span> Contact
          </div>
          <h1>Contactez-nous</h1>
          <p>Une question ? Un projet ? Écrivez-nous, nous vous répondrons rapidement.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-2">
            <div className="reveal">
              <div className="form-section">
                <h2 className="form-title">Envoyez-nous un message</h2>
                {success && (
                  <div className="alert success">
                    Votre message a été envoyé avec succès !
                  </div>
                )}
                {error && (
                  <div className="alert error">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Nom complet *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={formData.nom}
                      onChange={(e) => setFormData({...formData, nom: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className="form-input"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sujet *</label>
                    <input
                      type="text"
                      className="form-input"
                      required
                      value={formData.sujet}
                      onChange={(e) => setFormData({...formData, sujet: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea
                      rows="5"
                      className="form-textarea"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                  </div>
                  <div className="form-submit">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Envoi en cours...' : 'Envoyer le message →'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div>
              <div className="contact-info reveal" style={{ background: 'var(--gris-clair)', borderRadius: 'var(--rayon-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 style={{ color: 'var(--bleu)', marginBottom: '1rem' }}>Informations de contact</h3>
                {infos.map((info, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.5rem' }}>{info.icon}</div>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--gris-fonce)', marginBottom: '0.25rem' }}>{info.title}</h4>
                      {info.link ? (
                        <a href={info.link} style={{ color: 'var(--bleu)', textDecoration: 'none', fontWeight: '600' }}>
                          {info.content}
                        </a>
                      ) : (
                        <p style={{ fontWeight: '600' }}>{info.content}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="contact-map reveal" style={{ background: 'var(--gris-clair)', borderRadius: 'var(--rayon-lg)', padding: '1.5rem' }}>
                <h3 style={{ color: 'var(--bleu)', marginBottom: '1rem' }}>Notre localisation</h3>
                <div className="map-placeholder" style={{ background: 'var(--gris-moyen)', height: '180px', borderRadius: 'var(--rayon)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '2rem' }}>📍</span>
                  <p style={{ fontSize: '0.9rem', color: 'var(--gris-fonce)' }}>Yaoundé, Cameroun</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}