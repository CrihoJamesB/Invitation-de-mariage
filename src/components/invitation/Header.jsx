import React, { useEffect } from "react"
import PropTypes from "prop-types"
import { invitationInfo } from "../../data/invitationInfo"

/**
 * En-tête de l'invitation avec design élégant et animations
 * @param {Object} guestInfo - Informations sur l'invité (si personnalisé)
 * @param {string} className - Classes CSS additionnelles
 * @param {boolean} animated - Si les animations doivent être activées
 */
const Header = ({ guestInfo = null, className = "", animated = true }) => {
  // Ajouter des animations lorsque le composant est monté
  useEffect(() => {
    if (animated) {
      // Animation séquentielle des éléments
      const elements = document.querySelectorAll(".animate-item")
      elements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.add("opacity-100", "translate-y-0")
          element.classList.remove("opacity-0", "translate-y-4")
        }, 300 + index * 150)
      })
    }
  }, [animated])

  return (
    <header className={`relative overflow-hidden ${className}`}>
      {/* Arrière-plan décoratif */}
      <div className="absolute inset-0 bg-primary/5 bg-floral-pattern opacity-10 z-0"></div>

      {/* En-tête principal */}
      <div className="relative z-10 px-6 py-10 text-center">
        {/* Message d'invitation */}
        <div className="mb-6">
          <p
            className={`text-muted font-elegant text-sm sm:text-base tracking-wide 
            ${
              animated
                ? "animate-item opacity-0 translate-y-4 transition-all duration-700"
                : ""
            }`}
          >
            {invitationInfo.families.groomFamily} &{" "}
            {invitationInfo.families.brideFamily}
          </p>
          <p
            className={`text-primary font-sans text-sm sm:text-base tracking-widest uppercase mt-1
            ${
              animated
                ? "animate-item opacity-0 translate-y-4 transition-all duration-700"
                : ""
            }`}
          >
            VOUS INVITENT AU MARIAGE DE
          </p>
        </div>

        {/* Noms des mariés */}
        <div className="mb-8">
          <h1
            className={`font-cursive text-4xl sm:text-5xl md:text-6xl text-primary mb-1
            ${
              animated
                ? "animate-item opacity-0 translate-y-4 transition-all duration-700"
                : ""
            }`}
          >
            {invitationInfo.couple.groom}
          </h1>
          <div
            className={`flex items-center justify-center my-3
            ${
              animated
                ? "animate-item opacity-0 translate-y-4 transition-all duration-700"
                : ""
            }`}
          >
            <div className="h-px w-10 bg-accent"></div>
            <span className="mx-3 text-accent font-sans">&</span>
            <div className="h-px w-10 bg-accent"></div>
          </div>
          <h1
            className={`font-cursive text-4xl sm:text-5xl md:text-6xl text-primary 
            ${
              animated
                ? "animate-item opacity-0 translate-y-4 transition-all duration-700"
                : ""
            }`}
          >
            {invitationInfo.couple.bride}
          </h1>
        </div>

        {/* Date et lieu */}
        <div
          className={`mb-6 
          ${
            animated
              ? "animate-item opacity-0 translate-y-4 transition-all duration-700"
              : ""
          }`}
        >
          <p className="font-elegant text-lg sm:text-xl text-primary-dark">
            Le {invitationInfo.event.date}
          </p>
          <p className="font-sans text-sm text-muted mt-1">
            à {invitationInfo.event.venue}
          </p>
        </div>

        {/* Message personnalisé pour l'invité (si disponible) */}
        {guestInfo && (
          <div
            className={`mt-8 bg-white bg-opacity-70 backdrop-blur-sm p-4 rounded-xl shadow-soft mx-auto max-w-md
            ${
              animated
                ? "animate-item opacity-0 translate-y-4 transition-all duration-700"
                : ""
            }`}
          >
            <p className="font-elegant text-sm sm:text-base text-primary-dark italic">
              {guestInfo.message}
            </p>
          </div>
        )}

        {/* Séparateur décoratif */}
        <div
          className={`mt-10 flex justify-center
          ${
            animated
              ? "animate-item opacity-0 translate-y-4 transition-all duration-700"
              : ""
          }`}
        >
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="h-px w-32 sm:w-48 bg-primary opacity-20"></div>
            </div>
            <div className="relative flex justify-center text-accent">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

Header.propTypes = {
  guestInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    group: PropTypes.string,
  }),
  className: PropTypes.string,
  animated: PropTypes.bool,
}

export default Header
