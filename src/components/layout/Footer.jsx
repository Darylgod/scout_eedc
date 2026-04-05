import { Link } from 'react-router-dom'
import '../../styles/footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-name">EEDC Cameroun</div>
            <p className="footer-brand-desc">
              Les Éclaireurs & Éclaireuses du Cameroun — Membre de l'Organisation
              Mondiale du Mouvement Scout (OMMS).
            </p>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">in</a>
              <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">w</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">yt</a>
            </div>
          </div>

          <div>
            <div className="footer-col-title">Navigation</div>
            <Link to="/" className="footer-link">Accueil</Link>
            <Link to="/qui-sommes-nous" className="footer-link">Qui sommes-nous</Link>
            <Link to="/branches" className="footer-link">Branches</Link>
            <Link to="/actualites" className="footer-link">Actualités</Link>
            <Link to="/galerie" className="footer-link">Galerie</Link>
          </div>

          <div>
            <div className="footer-col-title">Rejoindre</div>
            <Link to="/rejoindre" className="footer-link">S'inscrire</Link>
            <Link to="/contact" className="footer-link">Nous contacter</Link>
            <Link to="/rejoindre#faq" className="footer-link">FAQ</Link>
          </div>

          <div>
            <div className="footer-col-title">Contact</div>
            <a href="mailto:contact@eedc.cm" className="footer-link">contact@eedc.cm</a>
            <a href="tel:+237699887766" className="footer-link">+237 699 887 766</a>
            <span className="footer-link">Yaoundé, Cameroun</span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {currentYear} EEDC Cameroun · Tous droits réservés</span>
          <Link to="/mentions-legales" className="footer-link">Mentions légales</Link>
        </div>
      </div>
    </footer>
  )
}