import { Navigate } from "react-router-dom";
import { AUTH_CONFIG } from "../../config/auth"

/**
 * Composant qui protège les routes administratives
 * Vérifie l'authentification et redirige vers la page de connexion si nécessaire
 */
const ProtectedRoute = ({ children }) => {
  // Vérification si l'accès est temporairement bloqué
  const checkIfBlocked = () => {
    const blockedTime = localStorage.getItem("authBlocked")

    if (blockedTime) {
      const now = Date.now()
      const blockDuration = 5 * 60 * 1000 // 5 minutes
      const timePassed = now - parseInt(blockedTime, 10)

      if (timePassed < blockDuration) {
        // Encore bloqué, renvoyer le temps restant en minutes
        return Math.ceil((blockDuration - timePassed) / 60000)
      } else {
        // Le blocage est terminé, supprimer l'indicateur
        localStorage.removeItem("authBlocked")
        return 0
      }
    }

    return 0 // Pas bloqué
  }

  // Récupération et vérification des informations d'authentification
  const checkAuth = () => {
    const authData = localStorage.getItem("adminAuth")

    if (!authData) return false

    try {
      // Utiliser la fonction de décryptage si disponible
      const authInfo = AUTH_CONFIG.decryptSessionData
        ? AUTH_CONFIG.decryptSessionData(authData)
        : JSON.parse(authData)

      if (!authInfo) return false

      const { isAuthenticated, timestamp } = authInfo

      // Vérification de la validité de l'authentification (24h)
      const now = Date.now()
      const authExpiration = 24 * 60 * 60 * 1000 // 24 heures en millisecondes

      return isAuthenticated && now - timestamp < authExpiration
    } catch (error) {
      console.warn(
        "Erreur lors de la vérification de l'authentification:",
        error
      )
      return false
    }
  }

  // Vérifier si l'accès est bloqué
  const blockedMinutes = checkIfBlocked()
  if (blockedMinutes > 0) {
    // Rediriger vers la page d'accueil avec un message d'erreur
    localStorage.setItem(
      "authMessage",
      `Accès temporairement bloqué. Réessayez dans ${blockedMinutes} minute(s).`
    )
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  // Redirection vers la page de connexion si non authentifié
  if (!checkAuth()) {
    return (
      <Navigate
        to="/admin-login"
        replace
      />
    )
  }

  // Affichage du contenu protégé si authentifié
  return children
}

export default ProtectedRoute; 