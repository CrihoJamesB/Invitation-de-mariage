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
  const containerId = `map-container-${title
    .replace(/\s+/g, "-")
    .toLowerCase()}`

  // Observer pour le chargement paresseux avec IntersectionObserver
  useEffect(() => {
    if (!lazyLoad) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: "300px", // Préchargement quand on approche à 300px
      }
    )

    const mapContainer = document.getElementById(containerId)
    if (mapContainer) observer.observe(mapContainer)

    return () => {
      if (mapContainer) observer.disconnect()
    }
  }, [lazyLoad, containerId])

  // Gestion du chargement de l'iframe
  const handleIframeLoad = () => {
    setIsLoading(false)
    if (onLoad) onLoad()
  }

  const handleIframeError = () => {
    setHasError(true)
    setIsLoading(false)
    if (onError) onError()

    // Tentative de rechargement en cas d'erreur (max 3 tentatives)
    if (loadAttempts < 3) {
      setLoadAttempts((prev) => prev + 1)
      setTimeout(() => {
        setShouldLoad(true)
        setIsLoading(true)
        setHasError(false)
      }, 2000 * (loadAttempts + 1)) // Délai croissant entre les tentatives
    }
  }

  return (
    <div
      id={containerId}
      className={`relative ${className}`}
      ref={mapRef}
    >
      {shouldLoad && (
        <iframe
          src={src}
          title={title}
          className={`border-0 ${iframeClassName}`}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-primary-dark animate-pulse">
              Chargement de la carte...
            </p>
          </div>
        </div>
      )}

      {hasError && loadAttempts >= 3 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="text-center p-4">
            <p className="text-red-500 mb-2">Impossible de charger la carte</p>
            <button
              onClick={() => {
                setLoadAttempts(0)
                setShouldLoad(true)
                setIsLoading(true)
                setHasError(false)
              }}
              className="text-primary hover:text-primary-dark underline"
            >
              Réessayer
            </button>
          </div>
        </div>
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
 