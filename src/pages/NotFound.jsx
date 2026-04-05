import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="container">
        <div className="not-found-content">
          <h1>404</h1>
          <h2>Page non trouvée</h2>
          <p>Désolé, la page que vous recherchez n'existe pas.</p>
          <Link to="/" className="btn btn-primary">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}