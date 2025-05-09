import React from "react"
import PropTypes from "prop-types"

/**
 * Composant Button réutilisable avec différentes variantes et tailles
 * @param {string} children - Contenu du bouton
 * @param {string} variant - Style du bouton (primary, secondary, outline, text)
 * @param {string} size - Taille du bouton (sm, md, lg)
 * @param {string} className - Classes CSS additionnelles
 * @param {function} onClick - Fonction à exécuter au clic
 * @param {boolean} disabled - État désactivé du bouton
 * @param {boolean} fullWidth - Si le bouton prend toute la largeur
 * @param {string} type - Type du bouton (button, submit, reset)
 * @param {React.ReactNode} icon - Icône à afficher dans le bouton
 * @param {string} iconPosition - Position de l'icône (left, right)
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  fullWidth = false,
  type = "button",
  icon = null,
  iconPosition = "left",
}) => {
  // Styles de base pour tous les boutons
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2"

  // Styles spécifiques selon la variante
  const variantStyles = {
    primary:
      "bg-primary text-white hover:bg-primary-dark focus:ring-primary-light",
    secondary:
      "bg-secondary text-primary hover:bg-gray-100 focus:ring-secondary",
    outline:
      "border border-primary text-primary hover:bg-primary hover:bg-opacity-10 focus:ring-primary",
    text: "text-primary hover:bg-gray-100 hover:bg-opacity-20 focus:ring-primary",
    accent: "bg-accent text-white hover:bg-accent/90 focus:ring-accent/50",
    danger: "bg-danger text-white hover:bg-danger/90 focus:ring-danger/50",
    success: "bg-success text-white hover:bg-success/90 focus:ring-success/50",
  }

  // Styles spécifiques selon la taille
  const sizeStyles = {
    sm: "text-xs py-2 px-3",
    md: "text-sm py-2.5 px-4",
    lg: "text-base py-3 px-5",
  }

  // Styles pour l'état désactivé
  const disabledStyles = disabled
    ? "opacity-50 cursor-not-allowed"
    : "cursor-pointer"

  // Style pour la largeur
  const widthStyles = fullWidth ? "w-full" : ""

  // Construction de la classe finale
  const buttonClasses = `
    ${baseStyles}
    ${variantStyles[variant] || variantStyles.primary}
    ${sizeStyles[size] || sizeStyles.md}
    ${disabledStyles}
    ${widthStyles}
    ${className}
  `.trim()

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "outline",
    "text",
    "accent",
    "danger",
    "success",
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(["left", "right"]),
}

export default Button
