import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AUTH_CONFIG } from "../config/auth"

/**
 * Page de connexion à l'espace d'administration
 * Requiert un mot de passe pour accéder à la gestion des invités
 */
const AdminLogin = () => {
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault()

    // Vérification du mot de passe
    if (password === AUTH_CONFIG.adminPassword) {
      // Stockage de l'authentification dans localStorage
      localStorage.setItem(
        "adminAuth",
        JSON.stringify({
          isAuthenticated: true,
          timestamp: Date.now(),
        })
      )

      // Redirection vers la page d'administration
      navigate("/admin")
    } else {
      setError(true)
      setPassword("")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <div className="glass-card p-8 rounded-xl max-w-md w-full">
        <h1 className="font-elegant text-3xl text-primary-dark mb-6 text-center">
          Espace Administrateur
        </h1>

        {error && (
          <div className="mb-6 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            Mot de passe incorrect. Veuillez réessayer.
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-primary-dark"
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-primary/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="Entrez le mot de passe administrateur"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-primary text-white rounded-lg shadow-elegant hover:bg-primary-dark transition-all transform hover:-translate-y-1"
          >
            Se connecter
          </button>
        </form>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-primary hover:text-primary-dark transition-colors"
          >
            Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
