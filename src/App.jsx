import { useEffect } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

// Pages
import Invitation from "./pages/Invitation"
import GuestManagement from "./pages/GuestManagement"
import LandingPage from "./pages/LandingPage"
import AdminLogin from "./pages/AdminLogin"
import ScannerPage from "./pages/ScannerPage"

// Composants
import ProtectedRoute from "./components/auth/ProtectedRoute"

/**
 * Composant principal de l'application
 * Configure les routes et la structure de base
 */
const App = () => {
  // Optimisation des performances et expérience utilisateur
  useEffect(() => {
    // Préchargement des polices critiques
    const preloadFonts = () => {
      const fontUrls = [
        "https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap",
        "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap",
      ]

      fontUrls.forEach((url) => {
        const link = document.createElement("link")
        link.rel = "preload"
        link.as = "style"
        link.href = url
        document.head.appendChild(link)
      })
    }

    preloadFonts()
  }, [])

  return (
    <Router>
      <Routes>
        {/* Page d'accueil publique optimisée pour SEO */}
        <Route
          path="/"
          element={<LandingPage />}
        />

        {/* Route de connexion à l'administration */}
        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        {/* Interface d'administration pour la gestion des invités (protégée) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <GuestManagement />
            </ProtectedRoute>
          }
        />

        {/* Scanner d'entrée pour le jour J (protégé) */}
        <Route
          path="/scanner"
          element={
            <ProtectedRoute>
              <ScannerPage />
            </ProtectedRoute>
          }
        />

        {/* Invitation personnalisée par invité */}
        <Route
          path="/invitation/:guestId"
          element={<Invitation />}
        />

        {/* Redirection pour les routes non trouvées */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
    </Router>
  )
}

export default App
