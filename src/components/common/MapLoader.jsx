import React, { useState, useEffect, useRef } from "react"
import PropTypes from "prop-types"

/**
 * Composant pour charger les cartes Google Maps de manière optimisée
 * Inclut un état de chargement, une gestion des erreurs et une optimisation des performances
 *
 * @param {string} src - URL de l'iframe Google Maps
 * @param {string} title - Attribut title pour l'iframe
 * @param {string} className - Classes CSS additionnelles pour le conteneur
 * @param {string} iframeClassName - Classes CSS pour l'iframe
 * @param {boolean} lazyLoad - Si la carte doit être chargée paresseusement
 * @param {function} onLoad - Fonction appelée quand la carte est chargée
 * @param {function} onError - Fonction appelée en cas d'erreur
 */
const MapLoader = ({
  src,
  title = "Google Maps",
  className = "",
  iframeClassName = "",
  lazyLoad = true,
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(!lazyLoad)
  const [loadAttempts, setLoadAttempts] = useState(0)
  const mapRef = useRef(null)
  const containerId = `map-container-${title.replace(/\s+/g, "-").toLowerCase()}`

  // Observer pour le chargement paresseux avec IntersectionObserver
  useEffect(() => {
    if (!lazyLoad) return

    // Initialiser l'observer avec une marge plus grande pour précharger avant que l'élément soit visible
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: "300px" // Préchargement quand on approche à 300px
      }
    )

    const mapContainer = document.getElementById(containerId)
    if (mapContainer) observer.observe(mapContainer)

    return () => {
      if (mapContainer) observer.disconnect()
    }
  }, [lazyLoad, containerId])

  // Gestionnaire de chargement
  const handleMapLoad = () => {
    setIsLoading(false)
    if (onLoad) onLoad()
  }

  // Gestionnaire d'erreur avec tentatives de rechargement
  const handleMapError = () => {
    // Maximum 3 tentatives de rechargement
    if (loadAttempts < 2) {
      setLoadAttempts(prev => prev + 1)
      
      // Réessayer après un délai
      setTimeout(() => {
        if (mapRef.current) {
          // Rafraîchir l'iframe en modifiant son src
          const iframe = mapRef.current
          const currentSrc = iframe.src
          iframe.src = ""
          setTimeout(() => {
            iframe.src = currentSrc
          }, 100)
        }
      }, 1000 * (loadAttempts + 1)) // Augmenter le délai à chaque tentative
    } else {
      // Après 3 tentatives, afficher l'erreur
      setIsLoading(false)
      setHasError(true)
      if (onError) onError()
    }
  }

  // Effet d'animation pour le chargement
  const loadingAnimationClass = isLoading 
    ? "opacity-100 transition-opacity duration-300" 
    : "opacity-0 transition-opacity duration-500 pointer-events-none"

  return (
    <div
      id={containerId}
      ref={mapRef}
      className={`relative overflow-hidden ${className}`}
      style={{ minHeight: "100px" }} // Hauteur minimale pour éviter le CLS
    >
      {/* État de chargement */}
      <div className={`absolute inset-0 bg-primary/5 flex items-center justify-center z-10 ${loadingAnimationClass}`}>
        <div className="text-center">
          <svg
            className="w-8 h-8 text-primary animate-spin mx-auto"
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
          <p className="text-primary-dark text-xs mt-2 font-sans">
            Chargement de la carte...
          </p>
        </div>
      </div>

      {/* État d'erreur */}
      {hasError && (
        <div className="absolute inset-0 bg-danger/5 flex items-center justify-center z-10 animate-fade-in">
          <div className="text-center p-4">
            <svg
              className="w-8 h-8 text-danger mx-auto"
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
            <p className="text-danger text-sm mt-2 font-medium">
              Impossible de charger la carte
            </p>
            <button
              className="mt-2 text-xs text-primary-dark underline"
              onClick={() => window.open(src, "_blank")}
            >
              Ouvrir dans Google Maps
            </button>
          </div>
        </div>
      )}

      {/* Iframe de la carte avec chargement paresseux natif */}
      {shouldLoad && (
        <iframe
          ref={mapRef}
          title={title}
          className={`border-0 w-full h-full transition-opacity duration-300 ${
            isLoading ? "opacity-0" : "opacity-100"
          } ${iframeClassName}`}
          src={src}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={handleMapLoad}
          onError={handleMapError}
        ></iframe>
      )}
    </div>
  )
}

MapLoader.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  iframeClassName: PropTypes.string,
  lazyLoad: PropTypes.bool,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
}

export default MapLoader
 