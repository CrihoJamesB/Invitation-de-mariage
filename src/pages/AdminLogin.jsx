import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AUTH_CONFIG } from "../config/auth"

/**
 * Page de connexion à l'espace d'administration
 * Requiert un mot de passe pour accéder à la gestion des invités
 */
const AdminLogin = () => {
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Vérification si déjà authentifié
  useEffect(() => {
    const authData = localStorage.getItem("adminAuth")
    if (authData) {
      try {
        // Utiliser la fonction de décryptage si disponible
        const authInfo = AUTH_CONFIG.decryptSessionData
          ? AUTH_CONFIG.decryptSessionData(authData)
          : JSON.parse(authData)

        if (authInfo) {
          const { isAuthenticated, timestamp } = authInfo
          const now = Date.now()
          const authExpiration = 24 * 60 * 60 * 1000 // 24 heures

          if (isAuthenticated && now - timestamp < authExpiration) {
            navigate("/admin")
          }
        }
      } catch (error) {
        // Ignorer les erreurs de parsing
        console.warn(
          "Erreur lors de la vérification de l'authentification:",
          error
        )
        localStorage.removeItem("adminAuth")
      }
    }

    // Vérifier si l'accès est bloqué
    const blockedTime = localStorage.getItem("authBlocked")
    if (blockedTime) {
      const now = Date.now()
      const blockDuration = 5 * 60 * 1000 // 5 minutes
      const timePassed = now - parseInt(blockedTime, 10)

      if (timePassed < blockDuration) {
        // Encore bloqué, afficher le temps restant
        const remainingMinutes = Math.ceil((blockDuration - timePassed) / 60000)
        setError(
          `Trop de tentatives incorrectes. Veuillez réessayer dans ${remainingMinutes} minute(s).`
        )
        // Désactiver le formulaire
        setLoading(true)
      } else {
        // Le blocage est terminé, supprimer l'indicateur
        localStorage.removeItem("authBlocked")
      }
    }
  }, [navigate])

  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulation d'un délai pour éviter les attaques par force brute
    setTimeout(() => {
      // Vérification du mot de passe avec la fonction de validation
      if (AUTH_CONFIG.validatePassword(password)) {
        // Stockage sécurisé de l'authentification
        const authData = {
          isAuthenticated: true,
          timestamp: Date.now(),
          // Pas de stockage du mot de passe lui-même
        }

        // Utiliser la fonction de cryptage si disponible
        const encryptedData = AUTH_CONFIG.encryptSessionData
          ? AUTH_CONFIG.encryptSessionData(authData)
          : JSON.stringify(authData)

        localStorage.setItem("adminAuth", encryptedData)
        navigate("/admin")
      } else {
        // Incrémenter le compteur de tentatives
        const newAttempts = attempts + 1
        setAttempts(newAttempts)

        // Bloquer temporairement après 5 tentatives
        if (newAttempts >= 5) {
          setError(
            "Trop de tentatives incorrectes. Veuillez réessayer dans 5 minutes."
          )

          // Bloquer pendant 5 minutes
          localStorage.setItem("authBlocked", Date.now().toString())

          // Rediriger vers la page d'accueil après 2 secondes
          setTimeout(() => {
            navigate("/")
          }, 2000)
        } else {
          setError(`Mot de passe incorrect. Tentative ${newAttempts}/5.`)
        }

        setPassword("")
        setLoading(false)
      }
    }, 1000) // Délai de 1 seconde pour renforcer la sécurité
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
      <div className="glass-card p-8 rounded-xl max-w-md w-full">
        <h1 className="font-elegant text-3xl text-primary-dark mb-6 text-center">
          Espace Administrateur
        </h1>

        {error && (
          <div className="mb-6 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            {error}
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
              autoComplete="off"
              disabled={loading}
              required
            />
            <p className="mt-1 text-xs text-muted">
              Ce mot de passe n'est pas stocké dans votre navigateur
            </p>
          </div>

          <button
            type="submit"
            className={`w-full px-6 py-3 bg-primary text-white rounded-lg shadow-elegant hover:bg-primary-dark transition-all transform hover:-translate-y-1 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Vérification...
              </span>
            ) : (
              "Se connecter"
            )}
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
