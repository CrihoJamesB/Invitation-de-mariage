import PropTypes from "prop-types"
import { invitationInfo } from "../../data/invitationInfo"
import Button from "../common/Button"
import RevealOnScroll from "../common/RevealOnScroll"
import MapLoader from "../common/MapLoader"
import LocationOptions from "./LocationOptions"
import {
  MAPS_CONFIG,
  getNavigationUrls,
  getWhatsAppShareUrl,
} from "../../config/maps"
import { useEffect, useState, useRef } from "react"

/**
 * Section affichant la localisation de l'événement avec une carte intégrée
 * Inclut des effets de parallaxe avancés et des animations fluides
 *
 * @param {string} className - Classes CSS additionnelles
 */
const LocationSection = ({ className = "" }) => {
  // Générer les URLs avec les données du couple et du lieu
  const navigationUrls = getNavigationUrls(invitationInfo.event)
  const whatsAppShareUrl = getWhatsAppShareUrl(
    invitationInfo.event,
    invitationInfo.couple
  )

  // États pour les animations et interactions
  const sectionRef = useRef(null)
  const [offset, setOffset] = useState(0)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [activeButton, setActiveButton] = useState(null)
  const [isMapExpanded, setIsMapExpanded] = useState(false)

  // Effet de parallaxe au défilement avec mouvement fluide
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const { top } = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Calculer la position relative par rapport à la fenêtre
      const relativePosition = (windowHeight - top) / windowHeight

      // Limiter l'effet pour qu'il soit actif seulement quand la section est visible
      if (relativePosition > 0 && relativePosition < 1.5) {
        setOffset(relativePosition * 40)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initialiser la position

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Actions pour les boutons de navigation
  const openGoogleMapsNavigation = () => {
    setActiveButton("navigate")
    window.open(navigationUrls.googleMaps, "_blank")
    setTimeout(() => setActiveButton(null), 2000)
  }

  const shareLocation = () => {
    setActiveButton("share")
    window.open(whatsAppShareUrl, "_blank")
    setTimeout(() => setActiveButton(null), 2000)
  }

  const copyAddress = () => {
    setActiveButton("copy")
    const address = `${invitationInfo.event.venue}, ${invitationInfo.event.address}, ${invitationInfo.event.city}`
    navigator.clipboard
      .writeText(address)
      .then(() => {
        setTimeout(() => setActiveButton(null), 2000)
      })
      .catch((err) => {
        console.error("Erreur lors de la copie :", err)
        setTimeout(() => setActiveButton(null), 2000)
      })
  }

  const toggleMapExpansion = () => {
    setIsMapExpanded(!isMapExpanded)
  }

  return (
    <section
      id="lieu"
      ref={sectionRef}
      className={`py-16 px-4 ${className} relative overflow-hidden`}
    >
      {/* Arrière-plan avec dégradé et effets de parallaxe */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white/95 z-0"></div>

      {/* Effets de parallaxe décoratifs */}
      <div
        className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-gradient-radial from-primary/10 to-transparent blur-3xl z-0"
        style={{
          transform: `translate3d(${offset * 0.8}px, ${offset * -0.5}px, 0)`,
          transition: "transform 0.2s ease-out",
          opacity: 0.7,
        }}
      />
      <div
        className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-gradient-radial from-accent/10 to-transparent blur-3xl z-0"
        style={{
          transform: `translate3d(${offset * -0.6}px, ${offset * 0.4}px, 0)`,
          transition: "transform 0.2s ease-out",
          opacity: 0.6,
        }}
      />
      <div
        className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-gradient-radial from-secondary/10 to-transparent blur-2xl z-0"
        style={{
          transform: `translate3d(${offset * 1.2}px, ${offset * 0.7}px, 0)`,
          transition: "transform 0.15s ease-out",
          opacity: 0.4,
        }}
      />

      {/* Motif décoratif */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] z-0"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Titre de la section avec animation améliorée */}
        <RevealOnScroll animation="fade-up">
          <div className="text-center mb-14">
            <h2 className="font-elegant text-3xl sm:text-4xl text-primary mb-4 relative inline-block">
              Localisation
              <div className="absolute bottom-0 left-1/2 w-3/4 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent"></div>
            </h2>
            <p className="text-muted text-sm max-w-md mx-auto">
              Retrouvez-nous facilement grâce à la carte interactive
            </p>
          </div>
        </RevealOnScroll>

        {/* Carte et infos avec layout amélioré */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Carte avec vue satellite et animation d'entrée */}
          <RevealOnScroll
            animation="fade-right"
            className={`md:col-span-3 ${isMapExpanded ? "md:col-span-5" : ""}`}
          >
            <div
              className={`relative rounded-2xl overflow-hidden shadow-elegant transition-all duration-700 ${
                isMapExpanded
                  ? "h-[500px] z-50"
                  : "h-[300px] sm:h-[350px] md:h-[400px]"
              } ${isMapLoaded ? "opacity-100" : "opacity-80"}`}
            >
              {/* Overlay décoratif */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none z-10"></div>
              <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white/20 to-transparent pointer-events-none z-10"></div>

              {/* Loader avec animation améliorée */}
              {!isMapLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm z-20">
                  <div className="w-16 h-16 mb-4 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
                  </div>
                  <p className="text-sm text-primary-dark animate-pulse">
                    Chargement de la carte...
                  </p>
                </div>
              )}

              <MapLoader
                src={MAPS_CONFIG.iframeUrl}
                title="Carte du lieu de mariage"
                className="w-full h-full"
                onLoad={() => setIsMapLoaded(true)}
                onError={() => {
                  console.log("Erreur de chargement de la carte")
                  setIsMapLoaded(true)
                }}
                iframeClassName="w-full h-full"
                lazyLoad={true}
              />

              {/* Bouton pour agrandir/réduire la carte */}
              <button
                className="absolute bottom-4 right-4 bg-white/90 hover:bg-white px-3 py-2 rounded-lg shadow-md text-primary-dark text-sm flex items-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm z-20 group"
                onClick={toggleMapExpansion}
              >
                <svg
                  className="w-4 h-4 mr-2 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{
                    transform: isMapExpanded
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                  />
                </svg>
                {isMapExpanded ? "Réduire" : "Agrandir"}
                <span className="absolute inset-0 rounded-lg bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </div>

            {/* Options mobile améliorées */}
            <div
              className={`mt-5 block md:hidden ${
                isMapExpanded ? "hidden" : ""
              }`}
            >
              <LocationOptions className="rounded-xl bg-white/80 backdrop-blur-sm shadow-elegant p-4 border border-white/30" />
            </div>
          </RevealOnScroll>

          {/* Informations et boutons avec design amélioré */}
          <RevealOnScroll
            animation="fade-left"
            className={`md:col-span-2 ${isMapExpanded ? "hidden" : ""}`}
          >
            <div className="flex flex-col justify-between h-full bg-gradient-to-b from-white/95 to-white/80 p-6 rounded-2xl shadow-elegant backdrop-blur-sm border border-white/30">
              <div>
                <h3 className="font-elegant text-2xl text-primary-dark mb-4 relative inline-block">
                  {invitationInfo.event.venue}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></span>
                </h3>

                <p className="text-primary-dark font-medium mb-2">
                  {invitationInfo.event.address}
                </p>

                <p className="text-muted text-sm mb-6">
                  {invitationInfo.event.location}, {invitationInfo.event.city}
                </p>

                {/* Informations pratiques avec icônes améliorées et effets au survol */}
                <div className="bg-primary/5 p-5 rounded-xl mb-6 border-l-2 border-primary/30">
                  <h4 className="font-medium text-primary-dark mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-primary/70"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Informations pratiques
                  </h4>
                  <ul className="text-muted text-sm space-y-3">
                    <li className="flex items-start group cursor-default">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                        <svg
                          className="w-4 h-4 text-primary transform transition-all duration-300 group-hover:rotate-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <span className="transform transition-all duration-300 group-hover:translate-x-1">
                        Parking disponible à proximité
                      </span>
                    </li>
                    <li className="flex items-start group cursor-default">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                        <svg
                          className="w-4 h-4 text-primary transform transition-all duration-300 group-hover:rotate-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <span className="transform transition-all duration-300 group-hover:translate-x-1">
                        Référence: {invitationInfo.event.reference}
                      </span>
                    </li>
                    <li className="flex items-start group cursor-default">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mr-3 flex-shrink-0 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                        <svg
                          className="w-4 h-4 text-primary transform transition-all duration-300 group-hover:rotate-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <span className="transform transition-all duration-300 group-hover:translate-x-1">
                        Accessible aux personnes à mobilité réduite
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Options de navigation pour tablette/desktop */}
                <div className="hidden md:block">
                  <LocationOptions className="rounded-xl bg-gradient-to-r from-white/40 to-white/60 backdrop-blur-sm shadow-sm p-4" />
                </div>
              </div>

              {/* Boutons d'action améliorés avec effets */}
              <div className="space-y-3 mt-6">
                <Button
                  variant="primary"
                  fullWidth
                  icon={
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
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      ></path>
                    </svg>
                  }
                  onClick={openGoogleMapsNavigation}
                  className={`transform transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${
                    activeButton === "navigate"
                      ? "pulse-once bg-primary-dark"
                      : ""
                  }`}
                >
                  Obtenir l&apos;itinéraire
                </Button>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    icon={
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.151-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345M12 21.594c-1.349 0-2.68-.213-3.934-.638l-.285-.135-2.91.776.791-2.891-.149-.294a10.856 10.856 0 01-.69-3.996c0-6.01 4.935-10.897 10.989-10.897 2.94 0 5.7 1.15 7.769 3.223a10.816 10.816 0 013.234 7.75c0 6.011-4.935 10.904-10.989 10.904M20.415 3.549a12.987 12.987 0 00-9.245-3.829C4.91-.27-.085 8.816-.085 19.201c0 2.146.42 4.246 1.235 6.204l-1.485 5.406 5.55-1.441c1.875.713 3.906 1.095 5.97 1.095 6.259 0 11.255-9.086 11.255-19.472 0-3.465-1.35-6.769-3.786-9.241" />
                      </svg>
                    }
                    onClick={shareLocation}
                    className={`transform transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${
                      activeButton === "share"
                        ? "pulse-once text-green-600 border-green-300 bg-green-50"
                        : ""
                    }`}
                  >
                    Partager
                  </Button>

                  <Button
                    variant="outline"
                    icon={
                      activeButton === "copy" ? (
                        <svg
                          className="w-5 h-5 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      ) : (
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
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          ></path>
                        </svg>
                      )
                    }
                    onClick={copyAddress}
                    className={`transform transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${
                      activeButton === "copy"
                        ? "text-green-600 border-green-300 bg-green-50"
                        : ""
                    }`}
                  >
                    {activeButton === "copy" ? "Copié !" : "Copier"}
                  </Button>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      {/* Styles pour animations et motifs */}
      <style>{`
        .shadow-elegant {
          box-shadow: 0 10px 40px -5px rgba(0, 0, 0, 0.08);
        }
        
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        @keyframes pulse-animation {
          0% {
            box-shadow: 0 0 0 0 rgba(var(--color-primary-rgb), 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(var(--color-primary-rgb), 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(var(--color-primary-rgb), 0);
          }
        }
        
        .pulse-once {
          animation: pulse-animation 1s;
        }
      `}</style>
    </section>
  )
}

LocationSection.propTypes = {
  className: PropTypes.string,
}

export default LocationSection
