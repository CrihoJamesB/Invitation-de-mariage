import React from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

// Pages
import Invitation from "./pages/Invitation"
import GuestManagement from "./pages/GuestManagement"

/**
 * Composant principal de l'application
 * Configure les routes et la structure de base
 */
const App = () => {
  return (
    <Router>
      <Routes>
        {/* Page d'accueil - redirection vers la gestion des invités */}
        <Route
          path="/"
          element={
            <Navigate
              to="/admin"
              replace
            />
          }
        />

        {/* Interface d'administration */}
        <Route
          path="/admin"
          element={<GuestManagement />}
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
