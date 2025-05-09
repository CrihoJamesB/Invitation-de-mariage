import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"

/**
 * Composant pour chargement paresseux et optimisé des images
 * Améliore les performances en ne chargeant les images que lorsqu'elles entrent dans la vue
 *
 * @param {string} src - URL de l'image à charger
 * @param {string} alt - Texte alternatif pour l'image
 * @param {string} className - Classes CSS à appliquer
 * @param {string} placeholderColor - Couleur de l'espace réservé avant chargement
 * @param {function} onLoad - Fonction appelée lorsque l'image est chargée
 * @param {Object} imgProps - Propriétés supplémentaires pour l'image
 */
const LazyImage = ({
  src,
  alt,
  className = "",
  placeholderColor = "#f5efe6",
  onLoad,
  ...imgProps
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)

  // Utiliser Intersection Observer pour détecter quand l'image entre dans la vue
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: "200px" } // Préchargement avant 200px de distance
    )

    // Récupérer l'élément DOM et l'observer
    const element = document.getElementById(
      `lazy-img-${src.replace(/[^\w]/g, "-")}`
    )
    if (element) observer.observe(element)

    return () => {
      if (element) observer.disconnect()
    }
  }, [src])

  // Gestionnaire de chargement d'image
  const handleImageLoad = () => {
    setIsLoaded(true)
    if (onLoad) onLoad()
  }

  return (
    <div
      id={`lazy-img-${src.replace(/[^\w]/g, "-")}`}
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundColor: placeholderColor,
        transition: "opacity 0.3s ease",
      }}
    >
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          {...imgProps}
        />
      )}
    </div>
  )
}

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  placeholderColor: PropTypes.string,
  onLoad: PropTypes.func,
}

export default LazyImage
