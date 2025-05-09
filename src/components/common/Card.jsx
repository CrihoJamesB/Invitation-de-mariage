import React from "react"
import PropTypes from "prop-types"

/**
 * Composant Card réutilisable pour afficher du contenu en forme de carte
 * @param {React.ReactNode} children - Contenu de la carte
 * @param {string} className - Classes CSS additionnelles
 * @param {string} variant - Variante de style de la carte (default, elegant, flat, outline)
 * @param {boolean} hover - Si la carte doit avoir un effet de survol
 * @param {function} onClick - Fonction à exécuter au clic (si la carte est cliquable)
 * @param {boolean} fullWidth - Si la carte prend toute la largeur disponible
 */
const Card = ({
  children,
  className = "",
  variant = "default",
  hover = false,
  onClick = null,
  fullWidth = false,
}) => {
  // Styles de base pour toutes les cartes
  const baseStyles = "overflow-hidden transition-all duration-300"

  // Styles selon la variante
  const variantStyles = {
    default: "bg-white shadow-card rounded-xl",
    elegant: "bg-white shadow-elegant rounded-2xl border border-primary/10",
    flat: "bg-secondary rounded-lg",
    outline: "border border-primary/20 rounded-xl",
  }

  // Style pour l'effet de survol
  const hoverStyles = hover
    ? "hover:shadow-medium cursor-pointer transform hover:-translate-y-1"
    : ""

  // Style pour la largeur
  const widthStyles = fullWidth ? "w-full" : ""

  // Vérifier si la carte est cliquable
  const isClickable = onClick !== null
  const clickableStyles = isClickable ? "cursor-pointer" : ""

  // Construction de la classe finale
  const cardClasses = `
    ${baseStyles}
    ${variantStyles[variant] || variantStyles.default}
    ${hoverStyles}
    ${widthStyles}
    ${clickableStyles}
    ${className}
  `.trim()

  // Render en tant que div ou button selon si onClick est fourni
  if (isClickable) {
    return (
      <div
        className={cardClasses}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onClick(e)
          }
        }}
      >
        {children}
      </div>
    )
  }

  return <div className={cardClasses}>{children}</div>
}

// Sous-composants pour une meilleure structure
Card.Header = ({ children, className = "" }) => (
  <div className={`p-4 border-b border-gray-100 ${className}`}>{children}</div>
)

Card.Body = ({ children, className = "" }) => (
  <div className={`p-4 ${className}`}>{children}</div>
)

Card.Footer = ({ children, className = "" }) => (
  <div className={`p-4 border-t border-gray-100 ${className}`}>{children}</div>
)

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(["default", "elegant", "flat", "outline"]),
  hover: PropTypes.bool,
  onClick: PropTypes.func,
  fullWidth: PropTypes.bool,
}

Card.Header.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}

Card.Body.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}

Card.Footer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}

export default Card
