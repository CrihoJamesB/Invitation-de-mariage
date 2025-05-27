import { useEffect } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import React, { createContext, useState, useContext } from "react"

// Pages
import Invitation from "./pages/Invitation"
import GuestManagement from "./pages/GuestManagement"
import LandingPage from "./pages/LandingPage"
import AdminLogin from "./pages/AdminLogin"
import ScannerPage from "./pages/ScannerPage"

// Composants
import ProtectedRoute from "./components/auth/ProtectedRoute"

// Contexte d'erreur pour la gestion globale des erreurs
export const ErrorContext = createContext({
  error: null,
  setError: () => {},
  clearError: () => {},
})

// Composant pour fournir le contexte d'erreur
export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null)

  const clearError = () => setError(null)

  return (
    <ErrorContext.Provider value={{ error, setError, clearError }}>
      {error ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full m-4">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Une erreur est survenue
            </h2>
            <p className="text-gray-700 mb-4">
              {error.message || "Erreur inconnue"}
            </p>
            {error.details && (
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto mb-4">
                {error.details}
              </pre>
            )}
            <div className="flex justify-end">
              <button
                onClick={clearError}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {children}
    </ErrorContext.Provider>
  )
}

// Hook personnalisé pour utiliser le contexte d'erreur
export const useError = () => useContext(ErrorContext)

// Composant d'intercepteur d'erreurs
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Erreur interceptée:", error, errorInfo)

    // Si nous sommes dans le contexte de l'application, utiliser le contexte d'erreur
    if (this.props.setError) {
      this.props.setError({
        message: error.message,
        details: errorInfo.componentStack,
      })
    }
  }

  render() {
    if (this.state.hasError && !this.props.setError) {
      // Fallback UI quand nous ne sommes pas dans le contexte
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h2 className="text-red-700 font-bold text-lg mb-2">
            Une erreur est survenue
          </h2>
          <p className="text-red-600">
            {this.state.error?.message || "Erreur inconnue"}
          </p>
          <button
            className="mt-3 px-3 py-1 bg-red-700 text-white rounded"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Réessayer
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

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
    <ErrorProvider>
      <ErrorContext.Consumer>
        {({ setError, clearError }) => (
          <ErrorBoundary setError={setError}>
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
          </ErrorBoundary>
        )}
      </ErrorContext.Consumer>
    </ErrorProvider>
  )
}

export default App
