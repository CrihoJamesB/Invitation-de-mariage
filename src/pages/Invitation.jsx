import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import guestService from "../firebase/guestService"
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
  const [scrollProgress, setScrollProgress] = useState(0)

  // Récupérer les informations de l'invité au chargement
  useEffect(() => {
    const fetchGuestInfo = async () => {
      try {
        if (!guestId) {
          console.error("Aucun ID d'invité trouvé dans l'URL")
          setError(true)
          setLoading(false)
          return
        }

        console.log("Recherche de l'invité avec l'ID:", guestId)

        // Récupérer les infos de l'invité à partir de l'ID dans l'URL
        const guest = await guestService.getGuestById(guestId)

        console.log("Résultat de la recherche:", guest)

        if (!guest) {
          console.error("Invité non trouvé dans la base de données")
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

  // Observer le défilement pour mettre à jour la section active
  useEffect(() => {
    const handleScroll = () => {
      // Calcul de progression pour la barre d'avancement
      const scrollTop = window.scrollY
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollTop / scrollHeight
      setScrollProgress(progress)

      // Détection de la section visible actuelle
      const sections = ["accueil", "details", "programme", "lieu"]
      let currentSection = activeSection

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          // Si la section est visible dans le viewport (avec un ajustement)
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = section
            break
          }
        }
      }

      if (currentSection !== activeSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [activeSection])

  // Effet de défilement fluide lors du changement de section
  const handleNavigationClick = (sectionId) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 60, // Ajustement pour la navigation
        behavior: "smooth",
      })
    }
  }

  // Afficher un écran de chargement
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/10">
        <div className="relative w-24 h-24 flex items-center justify-center mb-6">
          <svg
            className="absolute w-24 h-24 text-primary/20"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
          >
            <circle
              cx="50"
              cy="50"
              r="44"
            />
          </svg>
          <svg
            className="absolute w-24 h-24 text-primary animate-spin"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray="69 200"
          >
            <circle
              cx="50"
              cy="50"
              r="44"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-primary/70"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
        </div>
        <p className="text-primary-dark font-elegant text-2xl animate-pulse mb-2">
          Un instant...
        </p>
        <p className="text-muted text-center max-w-md px-4">
          Nous préparons votre invitation personnalisée
        </p>
      </div>
    )
  }

  // Afficher un message d'erreur si l'invité n'est pas trouvé
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/10 px-4">
        <div className="w-20 h-20 flex items-center justify-center mb-6 text-danger bg-danger/10 rounded-full">
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
        <h1 className="text-primary-dark font-elegant text-3xl text-center mb-4">
          Invitation non trouvée
        </h1>
        <p className="text-muted text-center max-w-md mb-8">
          Désolé, nous n&apos;avons pas pu trouver votre invitation
          personnalisée. Veuillez vérifier l&apos;URL ou contacter les mariés.
        </p>
        <Button
          variant="primary"
          onClick={() => navigate("/")}
          className="shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          Retour à l&apos;accueil
        </Button>
      </div>
    )
  }

  const navigationIcons = {
    accueil: (
      <svg
        className="w-5 h-5 mb-1"
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
    ),
    details: (
      <svg
        className="w-5 h-5 mb-1"
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
    ),
    programme: (
      <svg
        className="w-5 h-5 mb-1"
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
    ),
    lieu: (
      <svg
        className="w-5 h-5 mb-1"
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
    ),
  }

  // Afficher l'invitation personnalisée avec UI améliorée
  return (
    <div className="bg-gradient-to-br from-secondary/5 to-secondary/20 min-h-screen relative">
      {/* Barre de progression */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Navigation fixe */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg pb-safe-area-inset-bottom z-40 sm:top-0 sm:bottom-auto transition-transform duration-300">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between px-2 py-3">
            {["accueil", "details", "programme", "lieu"].map((section) => (
              <button
                key={section}
                className={`flex flex-col items-center px-3 py-1.5 rounded-lg transition-all duration-300 ${
                  activeSection === section
                    ? "text-primary bg-primary/10 transform scale-105"
                    : "text-muted hover:text-primary/70 hover:bg-primary/5"
                }`}
                onClick={() => handleNavigationClick(section)}
                aria-label={`Aller à la section ${section}`}
                aria-current={activeSection === section ? "page" : undefined}
              >
                {navigationIcons[section]}
                <span className="text-xs font-medium capitalize">
                  {section}
                </span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Conteneur principal avec effet de parallaxe léger */}
      <div className="pt-0 pb-20 sm:pb-0 sm:pt-16 overflow-hidden">
        {/* Section d'accueil avec l'en-tête */}
        <div
          id="accueil"
          className="min-h-[90vh] flex items-center transition-opacity duration-700"
          style={{ opacity: activeSection === "accueil" ? 1 : 0.8 }}
        >
          <div className="w-full">
            <Header guestInfo={guestInfo} />
          </div>
        </div>

        {/* Sections du contenu avec effet de fade-in */}
        <div
          id="details"
          className="scroll-mt-16 transition-opacity duration-700"
          style={{ opacity: activeSection === "details" ? 1 : 0.8 }}
        >
          <DetailSection />
        </div>

        <div
          id="programme"
          className="scroll-mt-16 transition-opacity duration-700"
          style={{ opacity: activeSection === "programme" ? 1 : 0.8 }}
        >
          <ProgramSection />
        </div>

        <div
          id="lieu"
          className="scroll-mt-16 transition-opacity duration-700"
          style={{ opacity: activeSection === "lieu" ? 1 : 0.8 }}
        >
          <LocationSection />
        </div>
      </div>

      {/* Pied de page amélioré */}
      <footer className="bg-primary text-white py-10 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 L100,0 L100,100 L0,100 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M0,50 L100,50"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M50,0 L50,100"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </div>
        <div className="relative z-10">
          <p className="font-elegant text-2xl mb-3">
            {invitationInfo.couple.groom} & {invitationInfo.couple.bride}
          </p>
          <div className="w-16 h-1 bg-white/30 mx-auto mb-4"></div>
          <p className="text-sm text-white/80 max-w-md mx-auto leading-relaxed">
            Nous nous réjouissons de célébrer ce jour spécial avec vous
          </p>
          <div className="flex justify-center gap-4 mt-6 mb-6">
            <a
              href="https://wa.me/243899895733"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
              aria-label="Contacter les mariés via WhatsApp"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </a>
          </div>
          <div className="text-xs text-white/50">
            <p>© {new Date().getFullYear()} - Tous droits réservés</p>
            <p className="mt-1">
              Développé par Criho James,{" "}
              <a
                href="https://www.criho.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors duration-300"
              >
                @https://www.criho.tech
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* Bouton retour en haut pour les longs défilements */}
      {scrollProgress > 0.3 && (
        <button
          className="fixed bottom-20 right-4 sm:bottom-4 z-30 bg-primary/80 text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-all duration-300 backdrop-blur-sm"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Retour en haut"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

export default Invitation
