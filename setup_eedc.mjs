import fs from 'fs'
import path from 'path'

console.log('\n========================================')
console.log('   EEDC - Setup du projet React')
console.log('========================================\n')

// ============================================================
// UTILITAIRES
// ============================================================
function creerDossier(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true })
    console.log(`  + dossier : ${p}`)
  }
}

function creerFichier(p, contenu = '') {
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, contenu, 'utf8')
    console.log(`  + fichier : ${p}`)
  }
}

// ============================================================
// DOSSIERS
// ============================================================
console.log('[1/5] Création des dossiers...')
const dossiers = [
  'src/components/layout',
  'src/components/ui',
  'src/components/sections',
  'src/pages/membres',
  'src/pages/admin',
  'src/styles',
  'src/assets',
  'src/hooks',
  'src/context',
  'src/utils',
  'src/data',
]
dossiers.forEach(creerDossier)
console.log('  OK\n')

// ============================================================
// FICHIERS DE CONFIG
// ============================================================
console.log('[2/5] Fichiers de config...')

creerFichier('vite.config.js', `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})
`)

creerFichier('src/main.jsx', `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/variables.css'
import './styles/global.css'
import './styles/animations.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
`)

creerFichier('src/App.jsx', `import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'
import PrivateRoute from './components/layout/PrivateRoute'
import AdminRoute from './components/layout/AdminRoute'
import ScrollToTop from './components/layout/ScrollToTop'

// Pages publiques
import Accueil from './pages/Accueil'
import QuiSommesNous from './pages/QuiSommesNous'
import Branches from './pages/Branches'
import Louveteaux from './pages/Louveteaux'
import Eclaireurs from './pages/Eclaireurs'
import Pionniers from './pages/Pionniers'
import Routiers from './pages/Routiers'
import Rejoindre from './pages/Rejoindre'
import Actualites from './pages/Actualites'
import Article from './pages/Article'
import Galerie from './pages/Galerie'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

// Pages membres
import Login from './pages/membres/Login'
import Dashboard from './pages/membres/Dashboard'
import Ressources from './pages/membres/Ressources'
import Calendrier from './pages/membres/Calendrier'
import Annonces from './pages/membres/Annonces'
import MonProfil from './pages/membres/MonProfil'

// Pages admin
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminArticles from './pages/admin/AdminArticles'
import AdminArticleEdit from './pages/admin/AdminArticleEdit'
import AdminGalerie from './pages/admin/AdminGalerie'
import AdminInscriptions from './pages/admin/AdminInscriptions'
import AdminAgenda from './pages/admin/AdminAgenda'
import AdminRessources from './pages/admin/AdminRessources'
import AdminUtilisateurs from './pages/admin/AdminUtilisateurs'
import AdminUtilisateurEdit from './pages/admin/AdminUtilisateurEdit'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>

          {/* ── PAGES PUBLIQUES ── */}
          <Route element={<Layout />}>
            <Route path="/" element={<Accueil />} />
            <Route path="/qui-sommes-nous" element={<QuiSommesNous />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/branches/louveteaux" element={<Louveteaux />} />
            <Route path="/branches/eclaireurs" element={<Eclaireurs />} />
            <Route path="/branches/pionniers" element={<Pionniers />} />
            <Route path="/branches/routiers" element={<Routiers />} />
            <Route path="/rejoindre" element={<Rejoindre />} />
            <Route path="/actualites" element={<Actualites />} />
            <Route path="/actualites/:slug" element={<Article />} />
            <Route path="/galerie" element={<Galerie />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* ── LOGIN ── */}
          <Route path="/connexion" element={<Login />} />

          {/* ── ESPACE MEMBRES (Chef + Admin + SuperAdmin) ── */}
          <Route element={<PrivateRoute />}>
            <Route path="/membres" element={<Dashboard />} />
            <Route path="/membres/ressources" element={<Ressources />} />
            <Route path="/membres/calendrier" element={<Calendrier />} />
            <Route path="/membres/annonces" element={<Annonces />} />
            <Route path="/membres/profil" element={<MonProfil />} />
          </Route>

          {/* ── ADMIN (Admin + SuperAdmin uniquement) ── */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/articles" element={<AdminArticles />} />
            <Route path="/admin/articles/:id" element={<AdminArticleEdit />} />
            <Route path="/admin/galerie" element={<AdminGalerie />} />
            <Route path="/admin/inscriptions" element={<AdminInscriptions />} />
            <Route path="/admin/agenda" element={<AdminAgenda />} />
            <Route path="/admin/ressources" element={<AdminRessources />} />
            <Route path="/admin/utilisateurs" element={<AdminUtilisateurs />} />
            <Route path="/admin/utilisateurs/:id" element={<AdminUtilisateurEdit />} />
          </Route>

          {/* ── 404 ── */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
`)
console.log('  OK\n')

// ============================================================
// STYLES
// ============================================================
console.log('[3/5] Fichiers de styles...')

creerFichier('src/styles/variables.css', `/* ============================================
   EEDC — Variables CSS globales
   Charte graphique officielle
============================================ */
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Open+Sans:wght@400;600&display=swap');

:root {
  /* ── Couleurs principales ── */
  --bleu:          #003087;
  --bleu-dark:     #001f5c;
  --bleu-deeper:   #001040;
  --bleu-light:    #EBF0FF;
  --or:            #D4A017;
  --or-dark:       #B8860B;
  --or-light:      #FFF3CD;
  --vert:          #1A7A4A;
  --vert-dark:     #0f4f2f;
  --vert-light:    #D4EDDA;
  --rouge:         #CC0000;

  /* ── Neutres ── */
  --blanc:         #ffffff;
  --gris-clair:    #F5F5F5;
  --gris-moyen:    #D0D0D0;
  --gris-fonce:    #888888;
  --texte:         #1A1A2E;
  --texte-light:   #444444;
  --footer-bg:     #001a50;

  /* ── Branches ── */
  --louveteaux:    #FFD93D;
  --eclaireurs:    #1A7A4A;
  --pionniers:     #003087;
  --routiers:      #CC0000;

  /* ── Typographie ── */
  --font-titre:    'Montserrat', sans-serif;
  --font-corps:    'Open Sans', sans-serif;

  /* ── Espacements ── */
  --rayon:         8px;
  --rayon-lg:      12px;
  --rayon-xl:      20px;
  --ombre:         0 4px 24px rgba(0,48,135,0.08);
  --ombre-lg:      0 8px 40px rgba(0,48,135,0.14);
  --ombre-card:    0 2px 12px rgba(0,0,0,0.06);

  /* ── Layout ── */
  --max-width:     1200px;
  --nav-height:    70px;
  --section-py:    80px;

  /* ── Transitions ── */
  --transition:    0.3s ease;
  --transition-lg: 0.5s ease;
}
`)

creerFichier('src/styles/global.css', `/* ============================================
   EEDC — Styles globaux
============================================ */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  font-size: 16px;
}

body {
  font-family: var(--font-corps);
  color: var(--texte);
  background: var(--blanc);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-titre);
  line-height: 1.2;
  color: var(--texte);
}

a {
  text-decoration: none;
  color: inherit;
}

img {
  max-width: 100%;
  display: block;
}

ul, ol {
  list-style: none;
}

button {
  cursor: pointer;
  font-family: var(--font-corps);
  border: none;
  background: none;
}

input, textarea, select {
  font-family: var(--font-corps);
  font-size: 1rem;
}

/* ── Conteneur centré ── */
.container {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 2rem;
}

/* ── Section ── */
.section {
  padding: var(--section-py) 0;
}

.section-alt {
  padding: var(--section-py) 0;
  background: var(--gris-clair);
}

/* ── Label de section ── */
.section-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 700;
  color: var(--vert);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.section-label::before {
  content: '';
  display: block;
  width: 24px;
  height: 2px;
  background: var(--or);
  border-radius: 2px;
}

/* ── Grilles ── */
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }

/* ── Boutons ── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: var(--rayon);
  font-family: var(--font-titre);
  font-weight: 700;
  font-size: 14px;
  transition: var(--transition);
  cursor: pointer;
  border: 2px solid transparent;
}

.btn-primary {
  background: var(--or);
  color: var(--bleu);
  border-color: var(--or);
}
.btn-primary:hover {
  background: var(--or-dark);
  border-color: var(--or-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(212,160,23,0.35);
}

.btn-outline {
  background: transparent;
  color: var(--blanc);
  border-color: rgba(255,255,255,0.5);
}
.btn-outline:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.8);
}

.btn-vert {
  background: var(--vert);
  color: var(--blanc);
  border-color: var(--vert);
}
.btn-vert:hover {
  background: var(--vert-dark);
  border-color: var(--vert-dark);
  transform: translateY(-2px);
}

.btn-bleu {
  background: var(--bleu);
  color: var(--blanc);
  border-color: var(--bleu);
}
.btn-bleu:hover {
  background: var(--bleu-dark);
  transform: translateY(-2px);
}

.btn-white {
  background: var(--blanc);
  color: var(--vert);
  border-color: var(--blanc);
}
.btn-white:hover {
  background: var(--gris-clair);
  transform: translateY(-2px);
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .grid-4 { grid-template-columns: 1fr; }
  .grid-3 { grid-template-columns: 1fr; }
  .grid-2 { grid-template-columns: 1fr; }
  .container { padding: 0 1rem; }
  :root { --section-py: 50px; }
}
`)

creerFichier('src/styles/animations.css', `/* ============================================
   EEDC — Animations & transitions
============================================ */

/* ── Fade in up ── */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── Fade in ── */
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* ── Slide in left ── */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ── Slide in right ── */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ── Float (logo hero) ── */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33%       { transform: translateY(-12px) rotate(1deg); }
  66%       { transform: translateY(-6px) rotate(-1deg); }
}

/* ── Pulse or ── */
@keyframes pulseOr {
  0%, 100% { box-shadow: 0 0 0 0 rgba(212,160,23,0.4); }
  50%      { box-shadow: 0 0 0 12px rgba(212,160,23,0); }
}

/* ── Shimmer (loading) ── */
@keyframes shimmer {
  0%   { background-position: -468px 0; }
  100% { background-position: 468px 0; }
}

/* ── Spin ── */
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Classes utilitaires ── */
.animate-fade-in-up  { animation: fadeInUp 0.6s ease both; }
.animate-fade-in     { animation: fadeIn 0.5s ease both; }
.animate-slide-left  { animation: slideInLeft 0.6s ease both; }
.animate-slide-right { animation: slideInRight 0.6s ease both; }
.animate-float       { animation: float 4s ease-in-out infinite; }
.animate-spin        { animation: spin 1s linear infinite; }

/* ── Délais ── */
.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
.delay-400 { animation-delay: 0.4s; }
.delay-500 { animation-delay: 0.5s; }
.delay-600 { animation-delay: 0.6s; }

/* ── Scroll reveal (classe ajoutée par JS) ── */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── Hover lift ── */
.hover-lift {
  transition: transform var(--transition), box-shadow var(--transition);
}
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--ombre-lg);
}
`)

creerFichier('src/styles/navbar.css', `/* ============================================
   EEDC — Navbar
============================================ */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: var(--nav-height);
  display: flex;
  align-items: center;
  transition: background var(--transition), box-shadow var(--transition);
  background: transparent;
}

.navbar.scrolled {
  background: var(--bleu);
  box-shadow: 0 2px 20px rgba(0,0,0,0.2);
}

.navbar.solid {
  background: var(--bleu);
}

.navbar .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.navbar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.navbar-logo img {
  width: 42px;
  height: 42px;
  object-fit: contain;
}

.navbar-logo-text {
  font-family: var(--font-titre);
  font-weight: 900;
  font-size: 16px;
  color: var(--or);
  letter-spacing: 0.5px;
  line-height: 1.1;
}

.navbar-logo-text span {
  display: block;
  font-size: 10px;
  font-weight: 400;
  color: rgba(255,255,255,0.6);
  letter-spacing: 1px;
}

.navbar-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.navbar-link {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
  text-decoration: none;
  transition: color var(--transition);
  position: relative;
  padding-bottom: 4px;
}

.navbar-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--or);
  transition: width var(--transition);
}

.navbar-link:hover,
.navbar-link.active {
  color: var(--blanc);
}

.navbar-link:hover::after,
.navbar-link.active::after {
  width: 100%;
}

.navbar-cta {
  background: var(--or);
  color: var(--bleu) !important;
  padding: 8px 20px;
  border-radius: var(--rayon);
  font-family: var(--font-titre);
  font-weight: 700;
  font-size: 13px;
  transition: var(--transition);
}

.navbar-cta:hover {
  background: var(--or-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(212,160,23,0.4);
}

.navbar-cta::after { display: none; }

/* ── Menu hamburger mobile ── */
.navbar-burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  padding: 4px;
}

.navbar-burger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--blanc);
  border-radius: 2px;
  transition: var(--transition);
}

.navbar-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.navbar-burger.open span:nth-child(2) { opacity: 0; }
.navbar-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

@media (max-width: 768px) {
  .navbar-links { display: none; }
  .navbar-burger { display: flex; }

  .navbar-links.open {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: var(--nav-height);
    left: 0;
    right: 0;
    background: var(--bleu);
    padding: 1.5rem 2rem;
    gap: 1.2rem;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  }
}
`)

creerFichier('src/styles/footer.css', `/* ============================================
   EEDC — Footer
============================================ */
.footer {
  background: var(--footer-bg);
  color: rgba(255,255,255,0.6);
  padding: 60px 0 0;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  padding-bottom: 40px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.footer-brand img {
  width: 56px;
  margin-bottom: 1rem;
}

.footer-brand-name {
  font-family: var(--font-titre);
  font-weight: 900;
  font-size: 18px;
  color: var(--or);
  margin-bottom: 0.5rem;
}

.footer-brand-desc {
  font-size: 13px;
  line-height: 1.7;
  margin-bottom: 1rem;
}

.footer-social {
  display: flex;
  gap: 10px;
}

.footer-social a {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: var(--transition);
}

.footer-social a:hover {
  background: var(--or);
  border-color: var(--or);
  color: var(--bleu);
}

.footer-col-title {
  font-family: var(--font-titre);
  font-size: 12px;
  font-weight: 800;
  color: var(--or);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 1.2rem;
}

.footer-link {
  display: block;
  font-size: 13px;
  color: rgba(255,255,255,0.55);
  margin-bottom: 8px;
  transition: color var(--transition);
}

.footer-link:hover {
  color: var(--blanc);
  padding-left: 4px;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  font-size: 12px;
  color: rgba(255,255,255,0.3);
}

@media (max-width: 768px) {
  .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
  .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
}
@media (max-width: 480px) {
  .footer-grid { grid-template-columns: 1fr; }
}
`)

creerFichier('src/styles/hero.css', `/* ============================================
   EEDC — Hero sections
============================================ */

/* ── Hero principal (Accueil) ── */
.hero {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bleu) 0%, var(--bleu-dark) 60%, var(--bleu-deeper) 100%);
  display: flex;
  align-items: center;
  padding-top: var(--nav-height);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 80% 20%, rgba(212,160,23,0.08) 0%, transparent 50%),
    radial-gradient(circle at 20% 80%, rgba(26,122,74,0.06) 0%, transparent 50%);
}

.hero-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.hero-particle {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(212,160,23,0.3);
  animation: float 6s ease-in-out infinite;
}

.hero-inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 4rem;
  padding: 4rem 0;
}

.hero-content {
  flex: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(212,160,23,0.15);
  color: var(--or);
  border: 1px solid rgba(212,160,23,0.3);
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
}

.hero h1 {
  font-family: var(--font-titre);
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 900;
  color: var(--blanc);
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.hero h1 .accent {
  color: var(--or);
  position: relative;
}

.hero-desc {
  font-size: 17px;
  color: rgba(255,255,255,0.75);
  line-height: 1.8;
  max-width: 500px;
  margin-bottom: 2.5rem;
}

.hero-btns {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-visual {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-logo-wrapper {
  position: relative;
  width: 280px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-logo-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(212,160,23,0.15);
  animation: spin 20s linear infinite;
}

.hero-logo-ring-2 {
  position: absolute;
  inset: 20px;
  border-radius: 50%;
  border: 1px dashed rgba(212,160,23,0.1);
  animation: spin 15s linear infinite reverse;
}

.hero-logo {
  width: 200px;
  height: 200px;
  object-fit: contain;
  animation: float 4s ease-in-out infinite;
  filter: drop-shadow(0 12px 40px rgba(0,0,0,0.4));
  position: relative;
  z-index: 1;
}

/* ── Hero petite (pages internes) ── */
.page-hero {
  background: var(--bleu);
  padding: calc(var(--nav-height) + 3rem) 0 3rem;
  position: relative;
  overflow: hidden;
}

.page-hero::before {
  content: '';
  position: absolute;
  right: 5%;
  top: 50%;
  transform: translateY(-50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 50px solid rgba(212,160,23,0.06);
}

.page-hero .breadcrumb {
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  margin-bottom: 12px;
}

.page-hero .breadcrumb span {
  color: var(--or);
}

.page-hero h1 {
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  font-weight: 900;
  color: var(--blanc);
  margin-bottom: 1rem;
}

.page-hero p {
  font-size: 15px;
  color: rgba(255,255,255,0.7);
  max-width: 560px;
  line-height: 1.7;
}

@media (max-width: 768px) {
  .hero-inner { flex-direction: column; text-align: center; gap: 2rem; }
  .hero-desc { margin: 0 auto 2rem; }
  .hero-btns { justify-content: center; }
  .hero-logo-wrapper { width: 200px; height: 200px; }
  .hero-logo { width: 150px; height: 150px; }
}
`)

creerFichier('src/styles/cards.css', `/* ============================================
   EEDC — Cards
============================================ */

/* ── Card branche ── */
.branch-card {
  background: var(--blanc);
  border: 1.5px solid var(--gris-moyen);
  border-radius: var(--rayon-lg);
  overflow: hidden;
  transition: transform var(--transition), box-shadow var(--transition);
  cursor: pointer;
}

.branch-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--ombre-lg);
  border-color: var(--or);
}

.branch-card-img {
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
}

.branch-card-body {
  padding: 1.2rem;
}

.branch-card-name {
  font-family: var(--font-titre);
  font-size: 15px;
  font-weight: 800;
  color: var(--bleu);
  margin-bottom: 4px;
}

.branch-card-age {
  font-size: 11px;
  color: var(--gris-fonce);
  font-weight: 600;
  margin-bottom: 8px;
}

.branch-card-desc {
  font-size: 13px;
  color: var(--texte-light);
  line-height: 1.6;
}

.branch-card-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 12px;
  font-size: 12px;
  font-weight: 700;
  color: var(--vert);
  border-bottom: 1px solid var(--vert);
  transition: gap var(--transition);
}

.branch-card:hover .branch-card-link { gap: 8px; }

/* ── Card actu ── */
.actu-card {
  background: var(--blanc);
  border: 1px solid var(--gris-moyen);
  border-radius: var(--rayon-lg);
  overflow: hidden;
  transition: transform var(--transition), box-shadow var(--transition);
}

.actu-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--ombre-lg);
}

.actu-card-img {
  height: 180px;
  object-fit: cover;
  width: 100%;
  background: var(--gris-clair);
}

.actu-card-body {
  padding: 1.2rem;
}

.actu-card-tag {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: var(--vert);
  text-transform: uppercase;
  margin-bottom: 8px;
}

.actu-card-title {
  font-family: var(--font-titre);
  font-size: 15px;
  font-weight: 700;
  color: var(--bleu);
  line-height: 1.4;
  margin-bottom: 8px;
}

.actu-card-date {
  font-size: 12px;
  color: var(--gris-fonce);
}

/* ── Card témoignage ── */
.temoignage-card {
  background: var(--blanc);
  border: 1px solid var(--gris-moyen);
  border-left: 4px solid var(--or);
  border-radius: var(--rayon-lg);
  padding: 1.5rem;
  transition: transform var(--transition), box-shadow var(--transition);
}

.temoignage-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--ombre-lg);
}

.temoignage-texte {
  font-size: 14px;
  font-style: italic;
  color: var(--texte-light);
  line-height: 1.8;
  margin-bottom: 1.2rem;
}

.temoignage-auteur {
  display: flex;
  align-items: center;
  gap: 12px;
}

.temoignage-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-titre);
  font-size: 13px;
  font-weight: 700;
  color: var(--blanc);
  flex-shrink: 0;
}

.temoignage-nom {
  font-size: 13px;
  font-weight: 700;
  color: var(--bleu);
}

.temoignage-role {
  font-size: 11px;
  color: var(--gris-fonce);
  margin-top: 2px;
}
`)

creerFichier('src/styles/forms.css', `/* ============================================
   EEDC — Formulaires
============================================ */
.form-section {
  background: var(--gris-clair);
  border-radius: var(--rayon-xl);
  padding: 2.5rem;
}

.form-title {
  font-family: var(--font-titre);
  font-size: 18px;
  font-weight: 800;
  color: var(--bleu);
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-row.full {
  grid-template-columns: 1fr;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--texte-light);
}

.form-input,
.form-select,
.form-textarea {
  background: var(--blanc);
  border: 1.5px solid var(--gris-moyen);
  border-radius: var(--rayon);
  padding: 10px 14px;
  font-size: 14px;
  color: var(--texte);
  font-family: var(--font-corps);
  transition: border-color var(--transition), box-shadow var(--transition);
  width: 100%;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--bleu);
  box-shadow: 0 0 0 3px rgba(0,48,135,0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 140px;
}

.form-submit {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

@media (max-width: 600px) {
  .form-row { grid-template-columns: 1fr; }
}
`)

creerFichier('src/styles/admin.css', `/* ============================================
   EEDC — Dashboard Admin
============================================ */
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--gris-clair);
}

.admin-sidebar {
  width: 260px;
  min-width: 260px;
  background: var(--bleu);
  color: var(--blanc);
  display: flex;
  flex-direction: column;
  padding: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
}

.admin-sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.admin-sidebar-title {
  font-family: var(--font-titre);
  font-size: 14px;
  font-weight: 900;
  color: var(--or);
  letter-spacing: 1px;
}

.admin-sidebar-sub {
  font-size: 11px;
  color: rgba(255,255,255,0.5);
  margin-top: 2px;
}

.admin-nav-section {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
  color: rgba(255,255,255,0.35);
  text-transform: uppercase;
  padding: 20px 20px 8px;
}

.admin-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: var(--transition);
  text-decoration: none;
}

.admin-nav-item:hover {
  background: rgba(255,255,255,0.07);
  color: var(--blanc);
}

.admin-nav-item.active {
  background: rgba(255,255,255,0.12);
  color: var(--blanc);
  border-left-color: var(--or);
}

.admin-main {
  flex: 1;
  overflow: auto;
}

.admin-topbar {
  background: var(--blanc);
  border-bottom: 1px solid var(--gris-moyen);
  padding: 14px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 10;
}

.admin-topbar-title {
  font-family: var(--font-titre);
  font-size: 16px;
  font-weight: 700;
  color: var(--bleu);
}

.admin-content {
  padding: 28px;
}

.admin-stat-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.admin-stat-card {
  background: var(--blanc);
  border-radius: var(--rayon-lg);
  padding: 1.5rem;
  border: 1px solid var(--gris-moyen);
}

.admin-stat-num {
  font-family: var(--font-titre);
  font-size: 2rem;
  font-weight: 900;
  color: var(--bleu);
}

.admin-stat-label {
  font-size: 12px;
  color: var(--gris-fonce);
  margin-top: 4px;
}

.admin-table {
  width: 100%;
  background: var(--blanc);
  border-radius: var(--rayon-lg);
  overflow: hidden;
  border: 1px solid var(--gris-moyen);
}

.admin-table table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th {
  background: var(--gris-clair);
  padding: 12px 16px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  color: var(--gris-fonce);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--gris-moyen);
}

.admin-table td {
  padding: 14px 16px;
  font-size: 13px;
  border-bottom: 1px solid var(--gris-clair);
  color: var(--texte);
}

.admin-table tr:last-child td { border-bottom: none; }
.admin-table tr:hover td { background: var(--gris-clair); }

/* ── Badges rôles ── */
.role-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
}

.role-superadmin { background: #1a1a2e; color: #7ec8e3; }
.role-admin      { background: #EBF0FF; color: var(--bleu); }
.role-chef       { background: var(--vert-light); color: var(--vert); }

.status-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 700;
}
.status-actif    { background: var(--vert-light); color: var(--vert); }
.status-attente  { background: var(--or-light); color: var(--or-dark); }
.status-bloque   { background: #FFE5E5; color: var(--rouge); }
`)

creerFichier('src/styles/membres.css', `/* ============================================
   EEDC — Espace membres
============================================ */
.membres-layout {
  display: flex;
  min-height: 100vh;
  background: var(--gris-clair);
  padding-top: var(--nav-height);
}

.membres-sidebar {
  width: 240px;
  min-width: 240px;
  background: var(--bleu);
  color: var(--blanc);
  padding: 24px 0;
  position: sticky;
  top: var(--nav-height);
  height: calc(100vh - var(--nav-height));
  overflow-y: auto;
}

.membres-user-info {
  padding: 0 20px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  margin-bottom: 12px;
}

.membres-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-titre);
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;
}

.membres-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: var(--transition);
  text-decoration: none;
}

.membres-nav-item:hover {
  background: rgba(255,255,255,0.07);
  color: var(--blanc);
}

.membres-nav-item.active {
  background: rgba(255,255,255,0.12);
  color: var(--blanc);
  border-left-color: var(--or);
}

.membres-main {
  flex: 1;
  padding: 2rem;
}

.resource-card {
  background: var(--blanc);
  border: 1px solid var(--gris-moyen);
  border-radius: var(--rayon);
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  transition: box-shadow var(--transition);
}

.resource-card:hover {
  box-shadow: var(--ombre-card);
}
`)
console.log('  OK\n')

// ============================================================
// COMPOSANTS LAYOUT
// ============================================================
console.log('[4/5] Composants layout, context, utils...')

creerFichier('src/components/layout/ScrollToTop.jsx', `import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}
`)

creerFichier('src/components/layout/Layout.jsx', `import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
`)

creerFichier('src/components/layout/PrivateRoute.jsx', `import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function PrivateRoute() {
  const { user, loading } = useAuth()
  if (loading) return <div className="loader">Chargement...</div>
  return user ? <Outlet /> : <Navigate to="/connexion" replace />
}
`)

creerFichier('src/components/layout/AdminRoute.jsx', `import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function AdminRoute() {
  const { user, loading } = useAuth()
  if (loading) return <div className="loader">Chargement...</div>
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin'
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />
}
`)

creerFichier('src/components/layout/Navbar.jsx', `import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import logo from '../../assets/logo.png'
import '../../styles/navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className={\`navbar \${scrolled ? 'scrolled' : ''}\`}>
      <div className="container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="EEDC" />
          <div className="navbar-logo-text">
            EEDC
            <span>Cameroun</span>
          </div>
        </Link>

        <div className={\`navbar-links \${menuOpen ? 'open' : ''}\`}>
          <NavLink to="/" className={({isActive}) => 'navbar-link' + (isActive ? ' active' : '')} end>
            Accueil
          </NavLink>
          <NavLink to="/qui-sommes-nous" className={({isActive}) => 'navbar-link' + (isActive ? ' active' : '')}>
            Qui sommes-nous
          </NavLink>
          <NavLink to="/branches" className={({isActive}) => 'navbar-link' + (isActive ? ' active' : '')}>
            Branches
          </NavLink>
          <NavLink to="/actualites" className={({isActive}) => 'navbar-link' + (isActive ? ' active' : '')}>
            Actualités
          </NavLink>
          <NavLink to="/contact" className={({isActive}) => 'navbar-link' + (isActive ? ' active' : '')}>
            Contact
          </NavLink>

          {user ? (
            <>
              <NavLink to="/membres" className={({isActive}) => 'navbar-link' + (isActive ? ' active' : '')}>
                Mon espace
              </NavLink>
              {(user.role === 'admin' || user.role === 'superadmin') && (
                <NavLink to="/admin" className={({isActive}) => 'navbar-link' + (isActive ? ' active' : '')}>
                  Admin
                </NavLink>
              )}
              <button onClick={handleLogout} className="navbar-link" style={{background:'none',border:'none',cursor:'pointer'}}>
                Déconnexion
              </button>
            </>
          ) : (
            <Link to="/rejoindre" className="navbar-cta">
              Rejoindre →
            </Link>
          )}
        </div>

        <div
          className={\`navbar-burger \${menuOpen ? 'open' : ''}\`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span /><span /><span />
        </div>
      </div>
    </nav>
  )
}
`)

creerFichier('src/components/layout/Footer.jsx', `import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import '../../styles/footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src={logo} alt="EEDC" />
            <div className="footer-brand-name">EEDC Cameroun</div>
            <p className="footer-brand-desc">
              Les Éclaireurs & Éclaireuses du Cameroun — membre de l'Organisation
              Mondiale du Mouvement Scout (OMMS).
            </p>
            <div className="footer-social">
              <a href="#" title="Facebook">f</a>
              <a href="#" title="Instagram">in</a>
              <a href="#" title="WhatsApp">w</a>
              <a href="#" title="YouTube">yt</a>
            </div>
          </div>

          <div>
            <div className="footer-col-title">Navigation</div>
            <Link to="/" className="footer-link">Accueil</Link>
            <Link to="/qui-sommes-nous" className="footer-link">Qui sommes-nous</Link>
            <Link to="/branches" className="footer-link">Branches</Link>
            <Link to="/actualites" className="footer-link">Actualités</Link>
          </div>

          <div>
            <div className="footer-col-title">Rejoindre</div>
            <Link to="/rejoindre" className="footer-link">S'inscrire</Link>
            <Link to="/rejoindre#tarifs" className="footer-link">Tarifs</Link>
            <Link to="/rejoindre#faq" className="footer-link">FAQ</Link>
            <Link to="/contact" className="footer-link">Contact</Link>
          </div>

          <div>
            <div className="footer-col-title">Contact</div>
            <a href="mailto:contact@eedc.cm" className="footer-link">contact@eedc.cm</a>
            <a href="https://wa.me/237600000000" className="footer-link">WhatsApp</a>
            <span className="footer-link">Yaoundé, Cameroun</span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 EEDC Cameroun · Tous droits réservés</span>
          <span>Politique de confidentialité</span>
        </div>
      </div>
    </footer>
  )
}
`)

// ============================================================
// CONTEXT & HOOKS
// ============================================================
creerFichier('src/context/AuthContext.jsx', `import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Récupérer l'utilisateur depuis le localStorage au démarrage
    const stored = localStorage.getItem('eedc_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
    setLoading(false)
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('eedc_user', JSON.stringify(userData))
    localStorage.setItem('eedc_token', token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('eedc_user')
    localStorage.removeItem('eedc_token')
    setUser(null)
  }

  const updateUser = (data) => {
    const updated = { ...user, ...data }
    localStorage.setItem('eedc_user', JSON.stringify(updated))
    setUser(updated)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
`)

creerFichier('src/hooks/useAuth.js', `import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return ctx
}
`)

creerFichier('src/hooks/useScrollReveal.js', `import { useEffect } from 'react'

export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}
`)

creerFichier('src/utils/constants.js', `export const API_URL = 'http://localhost:3001/api'

export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN:      'admin',
  CHEF:       'chef',
}

export const BRANCHES = {
  louveteaux: { label: 'Louveteaux',  age: '7–11 ans',  couleur: '#FFD93D', emoji: '🐺' },
  eclaireurs: { label: 'Éclaireurs',  age: '11–15 ans', couleur: '#1A7A4A', emoji: '⚡' },
  pionniers:  { label: 'Pionniers',   age: '15–18 ans', couleur: '#003087', emoji: '🏗️' },
  routiers:   { label: 'Routiers',    age: '18–22 ans', couleur: '#CC0000', emoji: '🌍' },
}
`)

creerFichier('src/utils/formatDate.js', `export function formatDate(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export function formatDateCourt(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

export function tempsLecture(contenu) {
  const mots = contenu.trim().split(/\s+/).length
  const minutes = Math.ceil(mots / 200)
  return \`\${minutes} min de lecture\`
}
`)

creerFichier('src/utils/api.js', `import { API_URL } from './constants'

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('eedc_token')

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: \`Bearer \${token}\` }),
      ...options.headers,
    },
    ...options,
  }

  const res = await fetch(\`\${API_URL}\${endpoint}\`, config)
  const data = await res.json()

  if (!res.ok) throw new Error(data.message || 'Erreur serveur')
  return data
}

export const api = {
  get:    (url)          => request(url),
  post:   (url, body)    => request(url, { method: 'POST',   body: JSON.stringify(body) }),
  put:    (url, body)    => request(url, { method: 'PUT',    body: JSON.stringify(body) }),
  delete: (url)          => request(url, { method: 'DELETE' }),
}
`)

// ============================================================
// DONNÉES STATIQUES
// ============================================================
creerFichier('src/data/branches.js', `export const branches = [
  {
    id: 'louveteaux',
    nom: 'Louveteaux',
    age: '7 – 11 ans',
    emoji: '🐺',
    couleur: '#FFD93D',
    couleurBg: '#FFF3CD',
    description: 'Découverte du monde à travers le jeu et l\'aventure.',
    devise: 'De notre mieux',
    activites: ['Jeux de piste','Nature','Bricolage','Chants scouts','Premières techniques'],
  },
  {
    id: 'eclaireurs',
    nom: 'Éclaireurs',
    age: '11 – 15 ans',
    emoji: '⚡',
    couleur: '#1A7A4A',
    couleurBg: '#D4EDDA',
    description: 'Camps, projets ODD et développement du caractère.',
    devise: 'Toujours Prêt',
    activites: ['Camps','Orientation','ODD Environnement','Service communautaire','Techniques scouts'],
  },
  {
    id: 'pionniers',
    nom: 'Pionniers',
    age: '15 – 18 ans',
    emoji: '🏗️',
    couleur: '#003087',
    couleurBg: '#CCE5FF',
    description: 'Leadership, projets communautaires et ODD concrets.',
    devise: 'Bâtir et Servir',
    activites: ['Projets ODD','Leadership','Chantiers','Formation Prewarrant','Camps de haute montagne'],
  },
  {
    id: 'routiers',
    nom: 'Routiers',
    age: '18 – 22 ans',
    emoji: '🌍',
    couleur: '#CC0000',
    couleurBg: '#F8D7DA',
    description: 'Service, engagement citoyen et formation de chefs.',
    devise: 'Servir',
    activites: ['Service national','Formation chefs','Projets internationaux','Webinaires','Mentorat'],
  },
]
`)

creerFichier('src/data/temoignages.js', `export const temoignages = [
  {
    id: 1,
    texte: "Le scoutisme m'a appris à être autonome, à travailler en équipe et à me dépasser. C'est bien plus qu'une activité — c'est une école de vie.",
    nom: 'Awa Mbolle',
    role: 'Éclaireuse · 14 ans',
    initiales: 'AM',
    couleur: '#003087',
  },
  {
    id: 2,
    texte: "En tant que parent, voir mon fils évoluer, prendre des responsabilités et s'engager pour sa communauté est une fierté immense.",
    nom: 'Paul Nkoudou',
    role: 'Parent · Douala',
    initiales: 'PN',
    couleur: '#1A7A4A',
  },
  {
    id: 3,
    texte: "Diriger une patrouille, c'est ma première vraie expérience de leadership. Les formations de l'EEDC m'ont donné des outils concrets.",
    nom: 'Jean Fotso',
    role: "Chef d'Unité · Yaoundé",
    initiales: 'JF',
    couleur: '#D4A017',
  },
]
`)

creerFichier('src/data/articles.js', `export const articles = [
  {
    id: 1,
    slug: 'premier-camp-regional-eedc',
    titre: '1er Camp Régional EEDC — Retour en images',
    extrait: 'Pendant 5 jours, 120 scouts venus de tout le Cameroun ont partagé activités, défis et fraternité.',
    categorie: 'Camp',
    date: '2026-06-20',
    image: null,
    vedette: true,
  },
  {
    id: 2,
    slug: 'investiture-45-scouts',
    titre: 'Cérémonie d\'investiture : 45 nouveaux scouts',
    extrait: 'Dans une atmosphère solennelle, 45 jeunes ont prêté la Promesse scoute.',
    categorie: 'Cérémonie',
    date: '2026-03-15',
    image: null,
    vedette: false,
  },
  {
    id: 3,
    slug: 'quinzaine-environnement',
    titre: 'Quinzaine de l\'environnement — 300 arbres plantés',
    extrait: 'Les scouts EEDC s\'engagent pour l\'ODD 13 avec une action de plantation massive.',
    categorie: 'ODD',
    date: '2026-05-10',
    image: null,
    vedette: false,
  },
]
`)

creerFichier('src/data/equipe.js', `export const equipe = [
  { initiales: 'CX', nom: 'Commissaire Exécutif', role: 'Direction générale', couleur: '#003087' },
  { initiales: 'SG', nom: 'Secrétaire Général',   role: 'Administration',     couleur: '#1A7A4A' },
  { initiales: 'NA', nom: 'NACOM',                role: 'Communication',      couleur: '#D4A017' },
  { initiales: 'NF', nom: 'NAFOR',                role: 'Formation',          couleur: '#6C3D91' },
]
`)
console.log('  OK\n')

// ============================================================
// PAGES (squelettes fonctionnels)
// ============================================================
console.log('[5/5] Pages...')

const pageTemplate = (nom, titre) => `export default function ${nom}() {
  return (
    <div style={{paddingTop:'70px',minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
      <h1 style={{fontFamily:'Montserrat,sans-serif',color:'#003087'}}>${titre}</h1>
    </div>
  )
}
`

const pages = {
  'src/pages/QuiSommesNous.jsx':              ['QuiSommesNous', 'Qui sommes-nous'],
  'src/pages/Branches.jsx':                   ['Branches', 'Les branches EEDC'],
  'src/pages/Louveteaux.jsx':                 ['Louveteaux', 'Louveteaux · 7–11 ans'],
  'src/pages/Eclaireurs.jsx':                 ['Eclaireurs', 'Éclaireurs · 11–15 ans'],
  'src/pages/Pionniers.jsx':                  ['Pionniers', 'Pionniers · 15–18 ans'],
  'src/pages/Routiers.jsx':                   ['Routiers', 'Routiers · 18–22 ans'],
  'src/pages/Rejoindre.jsx':                  ['Rejoindre', 'Rejoindre l\'EEDC'],
  'src/pages/Actualites.jsx':                 ['Actualites', 'Actualités & Blog'],
  'src/pages/Article.jsx':                    ['Article', 'Article'],
  'src/pages/Galerie.jsx':                    ['Galerie', 'Galerie photos'],
  'src/pages/Contact.jsx':                    ['Contact', 'Nous contacter'],
  'src/pages/NotFound.jsx':                   ['NotFound', '404 — Page introuvable'],
  'src/pages/membres/Login.jsx':              ['Login', 'Connexion'],
  'src/pages/membres/Dashboard.jsx':          ['Dashboard', 'Mon tableau de bord'],
  'src/pages/membres/Ressources.jsx':         ['Ressources', 'Ressources PNJ'],
  'src/pages/membres/Calendrier.jsx':         ['Calendrier', 'Calendrier interne'],
  'src/pages/membres/Annonces.jsx':           ['Annonces', 'Annonces DEX'],
  'src/pages/membres/MonProfil.jsx':          ['MonProfil', 'Mon profil'],
  'src/pages/admin/AdminDashboard.jsx':       ['AdminDashboard', 'Dashboard Admin'],
  'src/pages/admin/AdminArticles.jsx':        ['AdminArticles', 'Gestion des articles'],
  'src/pages/admin/AdminArticleEdit.jsx':     ['AdminArticleEdit', 'Éditer un article'],
  'src/pages/admin/AdminGalerie.jsx':         ['AdminGalerie', 'Gestion galerie'],
  'src/pages/admin/AdminInscriptions.jsx':    ['AdminInscriptions', 'Inscriptions reçues'],
  'src/pages/admin/AdminAgenda.jsx':          ['AdminAgenda', 'Gestion agenda'],
  'src/pages/admin/AdminRessources.jsx':      ['AdminRessources', 'Ressources membres'],
  'src/pages/admin/AdminUtilisateurs.jsx':    ['AdminUtilisateurs', 'Gestion utilisateurs'],
  'src/pages/admin/AdminUtilisateurEdit.jsx': ['AdminUtilisateurEdit', 'Éditer utilisateur'],
}

for (const [chemin, [nom, titre]] of Object.entries(pages)) {
  creerFichier(chemin, pageTemplate(nom, titre))
}

// Page Accueil — squelette complet
creerFichier('src/pages/Accueil.jsx', `import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { branches } from '../data/branches'
import { temoignages } from '../data/temoignages'
import { articles } from '../data/articles'
import { formatDateCourt } from '../utils/formatDate'
import logo from '../assets/logo.png'
import '../styles/hero.css'
import '../styles/cards.css'

export default function Accueil() {
  useScrollReveal()

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-inner">
            <div className="hero-content animate-fade-in-up">
              <div className="hero-badge">🇨🇲 OMMS · Scoutisme Camerounais</div>
              <h1>L'Unité Scoute<br/>en <span className="accent">Mouvement</span></h1>
              <p className="hero-desc">
                Rejoignez les Éclaireurs & Éclaireuses du Cameroun — un programme
                de développement pour les jeunes de 7 à 22 ans. Valeurs, aventure, engagement.
              </p>
              <div className="hero-btns">
                <Link to="/rejoindre" className="btn btn-primary">Rejoindre l'EEDC →</Link>
                <Link to="/qui-sommes-nous" className="btn btn-outline">En savoir plus</Link>
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

      {/* ── STATS ── */}
      <div style={{background:'var(--or)',padding:'20px 0'}}>
        <div className="container">
          <div className="grid-4" style={{textAlign:'center'}}>
            {[
              {num:'4',    label:'Branches scoutes'},
              {num:'7–22', label:'Ans · tous bienvenus'},
              {num:'OMMS', label:'Reconnu mondialement'},
              {num:'2026', label:'Relancement officiel'},
            ].map((s,i) => (
              <div key={i}>
                <div style={{fontFamily:'var(--font-titre)',fontSize:'clamp(1.4rem,3vw,2rem)',fontWeight:900,color:'var(--bleu)'}}>
                  {s.num}
                </div>
                <div style={{fontSize:'11px',color:'rgba(0,48,135,0.75)',fontWeight:600,marginTop:'4px'}}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BRANCHES ── */}
      <section className="section-alt">
        <div className="container">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'2rem'}}>
            <div>
              <div className="section-label reveal">Nos programmes</div>
              <h2 className="reveal" style={{fontFamily:'var(--font-titre)',fontSize:'clamp(1.5rem,3vw,2rem)',color:'var(--bleu)'}}>
                Les 4 branches EEDC
              </h2>
            </div>
            <Link to="/branches" style={{fontSize:'13px',fontWeight:700,color:'var(--bleu)'}}>
              Voir tout →
            </Link>
          </div>
          <div className="grid-4">
            {branches.map((b, i) => (
              <Link to={\`/branches/\${b.id}\`} key={b.id} className="branch-card hover-lift reveal" style={{animationDelay:\`\${i*0.1}s\`}}>
                <div className="branch-card-img" style={{background:b.couleurBg}}>
                  <span style={{fontSize:'36px'}}>{b.emoji}</span>
                </div>
                <div className="branch-card-body">
                  <div className="branch-card-name">{b.nom}</div>
                  <div className="branch-card-age">{b.age}</div>
                  <div className="branch-card-desc">{b.description}</div>
                  <div className="branch-card-link">Découvrir →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACTUALITES ── */}
      <section className="section">
        <div className="container">
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'2rem'}}>
            <div>
              <div className="section-label reveal">Blog</div>
              <h2 className="reveal" style={{fontFamily:'var(--font-titre)',fontSize:'clamp(1.5rem,3vw,2rem)',color:'var(--bleu)'}}>
                Dernières actualités
              </h2>
            </div>
            <Link to="/actualites" style={{fontSize:'13px',fontWeight:700,color:'var(--bleu)'}}>
              Toutes les actualités →
            </Link>
          </div>
          <div className="grid-3">
            {articles.map((a,i) => (
              <Link to={\`/actualites/\${a.slug}\`} key={a.id} className="actu-card hover-lift reveal" style={{animationDelay:\`\${i*0.1}s\`}}>
                <div className="actu-card-img" style={{background:'var(--gris-clair)',height:'180px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'40px'}}>
                  📸
                </div>
                <div className="actu-card-body">
                  <div className="actu-card-tag">{a.categorie}</div>
                  <div className="actu-card-title">{a.titre}</div>
                  <div className="actu-card-date">{formatDateCourt(a.date)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEMOIGNAGES ── */}
      <section className="section-alt">
        <div className="container">
          <div className="section-label reveal">Témoignages</div>
          <h2 className="reveal" style={{fontFamily:'var(--font-titre)',fontSize:'clamp(1.5rem,3vw,2rem)',color:'var(--bleu)',marginBottom:'2rem'}}>
            Ce qu'ils disent de nous
          </h2>
          <div className="grid-3">
            {temoignages.map((t,i) => (
              <div key={t.id} className="temoignage-card hover-lift reveal" style={{animationDelay:\`\${i*0.1}s\`}}>
                <p className="temoignage-texte">"{t.texte}"</p>
                <div className="temoignage-auteur">
                  <div className="temoignage-avatar" style={{background:t.couleur}}>{t.initiales}</div>
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

      {/* ── CTA BAND ── */}
      <section style={{background:'var(--vert)',padding:'60px 0'}}>
        <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'2rem',flexWrap:'wrap'}}>
          <div>
            <h2 style={{fontFamily:'var(--font-titre)',fontSize:'clamp(1.3rem,3vw,1.8rem)',fontWeight:900,color:'var(--blanc)',marginBottom:'8px'}}>
              Prêt à rejoindre l'aventure scoute ?
            </h2>
            <p style={{color:'rgba(255,255,255,0.8)',fontSize:'14px'}}>
              Inscription ouverte · Tous les niveaux · Tout le Cameroun
            </p>
          </div>
          <Link to="/rejoindre" className="btn btn-white">S'inscrire maintenant →</Link>
        </div>
      </section>
    </>
  )
}
`)

console.log('  OK\n')

console.log('========================================')
console.log('   Setup terminé avec succès !')
console.log('')
console.log('   Lance maintenant :')
console.log('   npm run dev')
console.log('   → http://localhost:5173')
console.log('========================================\n')
