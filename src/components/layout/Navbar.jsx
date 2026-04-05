import { useState, useEffect } from 'react'
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
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="EEDC" />
          <div className="navbar-logo-text">
            EEDC
            <span>Cameroun</span>
          </div>
        </Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'} end>
            Accueil
          </NavLink>
          <NavLink to="/qui-sommes-nous" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
            Qui sommes-nous
          </NavLink>
          <NavLink to="/branches" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
            Branches
          </NavLink>
          <NavLink to="/actualites" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
            Actualités
          </NavLink>
          <NavLink to="/galerie" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
            Galerie
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
            Contact
          </NavLink>

          {user ? (
            <>
              <NavLink to="/membres" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
                Mon espace
              </NavLink>
              {(user.role === 'superadmin' || user.role === 'admin') && (
                <NavLink to="/admin" className={({ isActive }) => isActive ? 'navbar-link active' : 'navbar-link'}>
                  Admin
                </NavLink>
              )}
              <button onClick={handleLogout} className="navbar-link logout-btn">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <NavLink to="/connexion" className="navbar-link">
                Connexion
              </NavLink>
              <Link to="/rejoindre" className="navbar-cta">
                Rejoindre →
              </Link>
            </>
          )}
        </div>

        <button
          className={`navbar-burger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  )
}