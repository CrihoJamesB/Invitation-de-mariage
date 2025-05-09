import React from "react"
import PropTypes from "prop-types"
import useIntersectionObserver from "../../hooks/useIntersectionObserver"

/**
 * Composant wrapper qui anime ses enfants lorsqu'ils entrent dans la vue
 *
 * @param {Object} props - Les propriétés du composant
 * @param {React.ReactNode} props.children - Les éléments enfants à animer
 * @param {string} props.animation - Type d'animation (fade, slide-up, slide-right, etc.)
 * @param {number} props.threshold - Seuil de visibilité pour déclencher l'animation (0-1)
 * @param {string} props.rootMargin - Marge autour de l'élément observé
 * @param {boolean} props.once - Si l'animation ne doit se produire qu'une fois
 * @param {number} props.delay - Délai en ms avant l'animation
 * @param {string} props.className - Classes CSS supplémentaires
 */
const RevealOnScroll = ({
  children,
  animation = "fade-up",
  threshold = 0.1,
  rootMargin = "0px",
  once = true,
  delay = 0,
  className = "",
}) => {
  // Utiliser notre hook personnalisé pour détecter l'intersection
  const [ref, isInView] = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: once,
  })

  // Définir la classe d'animation appropriée
  const getAnimationClass = () => {
    switch (animation) {
      case "fade-up":
        return "opacity-0 translate-y-6"
      case "fade-down":
        return "opacity-0 -translate-y-6"
      case "fade-left":
        return "opacity-0 translate-x-6"
      case "fade-right":
        return "opacity-0 -translate-x-6"
      case "zoom-in":
        return "opacity-0 scale-95"
      case "zoom-out":
        return "opacity-0 scale-105"
      default:
        return "opacity-0"
    }
  }

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${getAnimationClass()}`}
      style={{
        transform: isInView ? "translate(0, 0) scale(1)" : undefined,
        opacity: isInView ? 1 : 0,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

RevealOnScroll.propTypes = {
  children: PropTypes.node.isRequired,
  animation: PropTypes.oneOf([
    "fade-up",
    "fade-down",
    "fade-left",
    "fade-right",
    "zoom-in",
    "zoom-out",
    "fade",
  ]),
  threshold: PropTypes.number,
  rootMargin: PropTypes.string,
  once: PropTypes.bool,
  delay: PropTypes.number,
  className: PropTypes.string,
}

export default RevealOnScroll
