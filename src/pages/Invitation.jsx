import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getGuestInfoById } from "../data/guests"
import { invitationInfo } from "../data/invitationInfo"

// Composants d'invitation
import Header from "../components/invitation/Header"
import DetailSection from "../components/invitation/DetailSection"
import ProgramSection from "../components/invitation/ProgramSection"
import LocationSection from "../components/invitation/LocationSection"
import Button from "../components/common/Button"

/**
 * Page d'invitation personnalisée affichée aux invités via URL unique
 */
const Invitation = () => {
  const { guestId } = useParams()
  const navigate = useNavigate()
  const [guestInfo, setGuestInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeSection, setActiveSection] = useState("accueil")

  // Récupérer les informations de l'invité au chargement
  useEffect(() => {
    const fetchGuestInfo = () => {
      try {
        if (!guestId) {
          setError(true)
          setLoading(false)
          return
        }

        // Récupérer les infos de l'invité à partir de l'ID dans l'URL
        const guest = getGuestInfoById(guestId)

        if (!guest) {
          setError(true)
          setLoading(false)
          return
        }

        setGuestInfo(guest)
        setLoading(false)
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des informations de l'invité:",
          error
        )
        setError(true)
        setLoading(false)
      }
    }

    // Simuler un délai de chargement pour l'animation
    const timer = setTimeout(() => {
      fetchGuestInfo()
    }, 1000)

    return () => clearTimeout(timer)
  }, [guestId])

  // Effet de défilement fluide lors du changement de section
  useEffect(() => {
    if (activeSection) {
      const element = document.getElementById(activeSection)
      if (element) {
        window.scrollTo({
          top: element.offsetTop - 60, // Ajustement pour la navigation
          behavior: "smooth",
        })
      }
    }
  }, [activeSection])

  // Gérer le clic sur un élément de navigation
  const handleNavigationClick = (sectionId) => {
    setActiveSection(sectionId)
  }

  // Afficher un écran de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-primary/5">
        <div className="w-16 h-16 flex items-center justify-center mb-4">
          <svg
            className="animate-spin w-10 h-10 text-primary"
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
        </div>
        <p className="text-primary-dark font-elegant text-xl animate-pulse">
          Chargement de votre invitation...
        </p>
      </div>
    )
  }

  // Afficher un message d'erreur si l'invité n'est pas trouvé
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-primary/5 px-4">
        <div className="w-16 h-16 flex items-center justify-center mb-4 text-danger">
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
        </div>
        <h1 className="text-primary-dark font-elegant text-2xl text-center mb-4">
          Invitation non trouvée
        </h1>
        <p className="text-muted text-center max-w-md mb-6">
          Désolé, nous n'avons pas pu trouver votre invitation personnalisée.
          Veuillez vérifier l'URL ou contacter les mariés.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate("/")}
        >
          Retour à l'accueil
        </Button>
      </div>
    )
  }

  // Afficher l'invitation personnalisée
  return (
    <div className="bg-secondary min-h-screen">
      {/* Navigation fixe */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-medium pb-safe-area-inset-bottom z-50 sm:top-0 sm:bottom-auto">
        <div className="flex items-center justify-between px-2 py-3 max-w-3xl mx-auto">
          {["accueil", "details", "programme", "lieu"].map((section) => (
            <button
              key={section}
              className={`flex flex-col items-center px-3 py-1 rounded-lg transition-colors ${
                activeSection === section ? "text-primary" : "text-muted"
              }`}
              onClick={() => handleNavigationClick(section)}
            >
              {section === "accueil" && (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  ></path>
                </svg>
              )}

              {section === "details" && (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              )}

              {section === "programme" && (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              )}

              {section === "lieu" && (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              )}

              <span className="text-xs mt-1 font-medium capitalize">
                {section}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* Section d'accueil avec l'en-tête */}
      <div
        id="accueil"
        className="pt-0 sm:pt-16"
      >
        <Header guestInfo={guestInfo} />
      </div>

      {/* Sections du contenu */}
      <DetailSection />
      <ProgramSection />
      <LocationSection />

      {/* Pied de page */}
      <footer className="bg-primary text-white py-8 px-4 text-center">
        <p className="font-elegant text-lg mb-2">
          {invitationInfo.couple.groom} & {invitationInfo.couple.bride}
        </p>
        <p className="text-sm text-white/70">
          Nous nous réjouissons de célébrer ce jour spécial avec vous
        </p>
        <div className="mt-6 text-xs text-white/50">
          <p>© {new Date().getFullYear()} - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  )
}

export default Invitation
