import PropTypes from "prop-types"
import { invitationInfo } from "../../data/invitationInfo"
import Button from "../common/Button"
import RevealOnScroll from "../common/RevealOnScroll"
import MapLoader from "../common/MapLoader"
import LocationOptions from "./LocationOptions"
import {
  GOOGLE_MAPS_IFRAME_URL,
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
        setOffset(relativePosition * 30) // Amplitude de l'effet augmentée
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
  }

  const shareLocation = () => {
    setActiveButton("share")
    window.open(whatsAppShareUrl, "_blank")
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

  return (
    <section
      id="lieu"
      ref={sectionRef}
      className={`py-12 px-4 ${className} relative overflow-hidden`}
      style={{
        background: `linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,1))`,
      }}
    >
      {/* Effets de parallaxe décoratifs optimisés */}
      <div
        className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-gradient-to-br from-primary/5 to-primary/10 blur-xl z-0"
        style={{
          transform: `translate3d(${offset * 0.7}px, ${offset * -0.4}px, 0)`,
          transition: "transform 0.2s ease-out",
          opacity: 0.7,
        }}
      />
      <div
        className="absolute -bottom-20 -left-10 w-80 h-80 rounded-full bg-gradient-to-tr from-accent/5 to-accent/10 blur-xl z-0"
        style={{
          transform: `translate3d(${offset * -0.5}px, ${offset * 0.3}px, 0)`,
          transition: "transform 0.2s ease-out",
          opacity: 0.6,
        }}
      />
      <div
        className="absolute top-1/3 left-1/4 w-16 h-16 rounded-full bg-primary/5 blur-lg z-0"
        style={{
          transform: `translate3d(${offset * 1.2}px, ${offset * 0.7}px, 0)`,
          transition: "transform 0.15s ease-out",
          opacity: 0.4,
        }}
      />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Titre de la section avec animation améliorée */}
        <RevealOnScroll animation="fade-up">
          <div className="text-center mb-10">
            <h2 className="font-elegant text-3xl text-primary mb-2 relative inline-block">
              Localisation
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent"></span>
            </h2>
            <p className="text-muted text-sm max-w-md mx-auto">
              Retrouvez-nous facilement grâce à la carte
            </p>
          </div>
        </RevealOnScroll>

        {/* Carte et infos avec layout amélioré */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Carte avec vue satellite et animation d'entrée */}
          <RevealOnScroll
            animation="fade-right"
            className="md:col-span-3"
          >
            <div
              className={`relative rounded-xl overflow-hidden shadow-xl h-[300px] sm:h-[350px] md:h-[400px] transition-all duration-1000 ${
                isMapLoaded ? "opacity-100" : "opacity-70"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none z-10"></div>

              {/* Loader pendant le chargement de la carte */}
              {!isMapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-20">
                  <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                </div>
              )}

              <MapLoader
                src={GOOGLE_MAPS_IFRAME_URL}
                title="Carte du lieu de mariage"
                className="w-full h-full"
                onLoad={() => setIsMapLoaded(true)}
                onError={() => {
                  console.log("Erreur de chargement de la carte")
                  window.open(navigationUrls.googleMaps, "_blank")
                }}
              />

              {/* Bouton pour agrandir la carte en surimpression */}
              <button
                className="absolute bottom-4 right-4 bg-white/90 hover:bg-white px-3 py-2 rounded-lg shadow-md text-primary-dark text-sm flex items-center transform transition-transform duration-300 hover:scale-105 backdrop-blur-sm z-20"
                onClick={openGoogleMapsNavigation}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                  />
                </svg>
                Agrandir
              </button>
            </div>

            {/* Options mobile améliorées */}
            <div className="mt-4 block md:hidden">
              <LocationOptions />
            </div>
          </RevealOnScroll>

          {/* Informations et boutons avec design amélioré */}
          <RevealOnScroll
            animation="fade-left"
            className="md:col-span-2"
          >
            <div className="flex flex-col justify-between h-full bg-white p-6 rounded-xl shadow-md">
              <div>
                <h3 className="font-elegant text-2xl text-gradient-to-r from-primary to-primary-dark mb-3">
                  {invitationInfo.event.venue}
                </h3>

                <p className="text-primary-dark font-medium mb-1">
                  {invitationInfo.event.address}
                </p>

                <p className="text-muted text-sm mb-4">
                  {invitationInfo.event.location}
                  <br />
                  {invitationInfo.event.city}, {invitationInfo.event.country}
                </p>

                {/* Informations pratiques avec icônes améliorées */}
                <div className="bg-primary/5 p-4 rounded-lg mb-6">
                  <h4 className="font-sans text-primary-dark font-medium mb-2 flex items-center">
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
                    <li className="flex items-start transform transition-all duration-300 hover:translate-x-1">
                      <svg
                        className="w-5 h-5 text-primary mr-2 flex-shrink-0"
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
                      <span>Parking disponible à proximité</span>
                    </li>
                    <li className="flex items-start transform transition-all duration-300 hover:translate-x-1">
                      <svg
                        className="w-5 h-5 text-primary mr-2 flex-shrink-0"
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
                      <span>Référence: {invitationInfo.event.reference}</span>
                    </li>
                    <li className="flex items-start transform transition-all duration-300 hover:translate-x-1">
                      <svg
                        className="w-5 h-5 text-primary mr-2 flex-shrink-0"
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
                      <span>Accessible aux personnes à mobilité réduite</span>
                    </li>
                  </ul>
                </div>

                {/* Options de navigation pour tablette/desktop */}
                <div className="hidden md:block">
                  <LocationOptions />
                </div>
              </div>

              {/* Boutons d'action améliorés */}
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
                  className={`transform transition-all duration-300 hover:-translate-y-1 ${
                    activeButton === "navigate" ? "pulse-once" : ""
                  }`}
                >
                  Obtenir l&apos;itinéraire
                </Button>

                <div className="grid grid-cols-2 gap-3">
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
                    className={`transform transition-all duration-300 hover:-translate-y-1 ${
                      activeButton === "share" ? "pulse-once" : ""
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
                    className={`transform transition-all duration-300 hover:-translate-y-1 ${
                      activeButton === "copy" ? "bg-green-50" : ""
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

      {/* Styles pour animations */}
      <style>{`
        .text-gradient-to-r {
          background: linear-gradient(to right, var(--color-primary), var(--color-primary-dark));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
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
