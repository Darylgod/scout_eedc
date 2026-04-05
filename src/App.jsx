import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import CreerCompte from './pages/CreerCompte'

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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Pages publiques avec layout */}
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

          {/* Pages sans layout */}
          <Route path="/connexion" element={<Login />} />
          <Route path="/creer-compte/:token" element={<CreerCompte />} />

          {/* Espace membres */}
          <Route element={<PrivateRoute />}>
            <Route path="/membres" element={<Dashboard />} />
            <Route path="/membres/ressources" element={<Ressources />} />
            <Route path="/membres/calendrier" element={<Calendrier />} />
            <Route path="/membres/annonces" element={<Annonces />} />
            <Route path="/membres/profil" element={<MonProfil />} />
          </Route>

          {/* Espace admin */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/articles" element={<AdminArticles />} />
            <Route path="/admin/articles/new" element={<AdminArticleEdit />} />
            <Route path="/admin/articles/:id" element={<AdminArticleEdit />} />
            <Route path="/admin/galerie" element={<AdminGalerie />} />
            <Route path="/admin/inscriptions" element={<AdminInscriptions />} />
            <Route path="/admin/agenda" element={<AdminAgenda />} />
            <Route path="/admin/ressources" element={<AdminRessources />} />
            <Route path="/admin/utilisateurs" element={<AdminUtilisateurs />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}