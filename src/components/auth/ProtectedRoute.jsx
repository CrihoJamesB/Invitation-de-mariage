import { Navigate } from "react-router-dom";

/**
 * Composant qui protège les routes administratives
 * Vérifie l'authentification et redirige vers la page de connexion si nécessaire
 */
const ProtectedRoute = ({ children }) => {
  // Récupération et vérification des informations d'authentification
  const checkAuth = () => {
    const authData = localStorage.getItem("adminAuth");
    
    if (!authData) return false;
    
    try {
      const { isAuthenticated, timestamp } = JSON.parse(authData);
      
      // Vérification de la validité de l'authentification (24h)
      const now = Date.now();
      const authExpiration = 24 * 60 * 60 * 1000; // 24 heures en millisecondes
      
      return isAuthenticated && (now - timestamp < authExpiration);
    } catch (error) {
      return false;
    }
  };

  // Redirection vers la page de connexion si non authentifié
  if (!checkAuth()) {
    return <Navigate to="/admin-login" replace />;
  }
  
  // Affichage du contenu protégé si authentifié
  return children;
};

export default ProtectedRoute; 