import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { invitationInfo } from "../../data/invitationInfo"
import useIntersectionObserver from "../../hooks/useIntersectionObserver"

/**
 * En-tête de l'invitation avec design élégant et animations avancées
 * @param {Object} guestInfo - Informations sur l'invité (si personnalisé)
 * @param {string} className - Classes CSS additionnelles
 * @param {boolean} animated - Si les animations doivent être activées
 */
const Header = ({ guestInfo = null, className = "", animated = true }) => {
  const [parallaxOffset, setParallaxOffset] = useState(0)
  const [scrollOpacity, setScrollOpacity] = useState(1)
  const [messageRef, messageIsVisible] = useIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true,
  })

  // Récupération des informations de table basées sur le groupe de l'invité
  const [tableInfo, setTableInfo] = useState(null)

  // Effet pour trouver la table correspondant au groupe de l'invité
  useEffect(() => {
    if (guestInfo && guestInfo.group && invitationInfo.tables) {
      const table = invitationInfo.tables.find(
        (table) => table.name.toLowerCase() === guestInfo.group.toLowerCase()
      )
      if (table) {
        setTableInfo(table)
      }
    }
  }, [guestInfo])

  // Détection du défilement pour effets multiples
  useEffect(() => {
    if (!animated) return

    const handleScroll = () => {
      const scrollPosition = window.scrollY
      // Effet parallaxe avec distance limitée
      const offset = Math.min(scrollPosition * 0.2, 150)
      setParallaxOffset(offset)

      // Effet de fondu progressif lors du défilement
      const maxScroll = window.innerHeight * 0.6
      const newOpacity = 1 - Math.min(scrollPosition / maxScroll, 0.6)
      setScrollOpacity(newOpacity)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [animated])

  // Optimisation pour ajouter séquentiellement les animations
  const getAnimationDelay = (index) => {
    return { animationDelay: `${index * 100}ms` }
  }

  return (
    <>
      <header
        className={`relative overflow-hidden min-h-[90vh] flex flex-col justify-center ${className}`}
      >
        {/* Arrière-plan décoratif avec effet parallaxe amélioré */}
        <div
          className="absolute inset-0 bg-primary/5 bg-floral-pattern opacity-15 z-0 hardware-accelerated"
          style={{
            backgroundSize: "cover",
            transform: `scale(1.1) translateY(${parallaxOffset}px)`,
            backgroundPosition: "center",
            transition: "transform 0.05s linear",
          }}
        ></div>

        {/* Effet de halo brillant animé avec particules */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-gradient-radial from-accent/20 to-transparent blur-3xl animate-pulse-slow"></div>
          <div
            className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-gradient-radial from-primary/10 to-transparent blur-3xl animate-pulse-slow"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>

        {/* Particules flottantes décoratives avancées */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className={`absolute rounded-full ${
                i % 3 === 0
                  ? "bg-primary/5"
                  : i % 3 === 1
                  ? "bg-accent/5"
                  : "bg-secondary/5"
              }`}
              style={{
                width: `${Math.random() * 12 + 3}px`,
                height: `${Math.random() * 12 + 3}px`,
                top: `${5 + Math.random() * 90}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.4 + Math.random() * 0.6,
                animation: `float-particle ${
                  5 + Math.random() * 15
                }s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* En-tête principal */}
        <div
          className="relative z-10 px-6 py-14 sm:py-20 text-center"
          style={{ opacity: scrollOpacity }}
        >
          {/* Décoration florale supérieure avec animation */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 opacity-20 animate-float-slow">
            <svg
              viewBox="0 0 100 30"
              fill="currentColor"
              className="text-primary"
            >
              <path d="M50 0C45 10 35 15 25 15C35 15 45 20 50 30C55 20 65 15 75 15C65 15 55 10 50 0Z" />
            </svg>
          </div>

          {/* Message d'invitation avec animation progressive */}
          <div className="mb-10">
            <p
              className={`text-muted font-elegant text-sm sm:text-base tracking-wide reveal-on-scroll ${
                animated ? "is-revealed" : ""
              }`}
              style={getAnimationDelay(0)}
            >
              {invitationInfo.families.groomFamily} &{" "}
              {invitationInfo.families.brideFamily}
            </p>
            <p
              className={`text-primary font-sans text-sm sm:text-base tracking-widest uppercase mt-2 reveal-on-scroll ${
                animated ? "is-revealed" : ""
              }`}
              style={getAnimationDelay(1)}
            >
              VOUS INVITENT AU MARIAGE DE
            </p>
          </div>

          {/* Noms des mariés avec effet brillant amélioré et carte élégante */}
          <div className="mb-12 relative backdrop-blur-sm bg-white/5 py-8 px-6 rounded-xl shadow-elegant transform transition-all duration-500 hover:shadow-xl">
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              <div className="absolute -inset-x-1/4 -top-1/4 w-150 h-150 bg-gradient-conic from-primary/10 via-accent/5 to-primary/10 opacity-70 animate-slow-spin blur-3xl"></div>
            </div>

            <h1
              className={`font-cursive text-4xl sm:text-5xl md:text-6xl mb-4 select-none reveal-on-scroll ${
                animated ? "is-revealed" : ""
              }`}
              style={getAnimationDelay(2)}
            >
              <span className="py-2 px-1 text-primary-dark relative">
                {invitationInfo.couple.groom}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent transform"></span>
              </span>
            </h1>

            <div
              className={`flex items-center justify-center my-4 reveal-on-scroll ${
                animated ? "is-revealed" : ""
              }`}
              style={getAnimationDelay(3)}
            >
              {/* Séparateur avec cœur animé */}
              <div className="h-px w-16 bg-accent/50"></div>
              <div className="mx-4 text-accent relative">
                <svg
                  className="w-8 h-8 animate-pulse-slow transform hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <div className="absolute -inset-2 bg-accent/5 rounded-full blur-md animate-pulse-slow"></div>
              </div>
              <div className="h-px w-16 bg-accent/50"></div>
            </div>

            <h1
              className={`font-cursive text-4xl sm:text-5xl md:text-6xl select-none reveal-on-scroll ${
                animated ? "is-revealed" : ""
              }`}
              style={getAnimationDelay(4)}
            >
              <span className="py-2 px-1 text-primary-dark relative">
                {invitationInfo.couple.bride}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent transform"></span>
              </span>
            </h1>
          </div>

          {/* Date et lieu avec bordure élégante et animation */}
          <div
            className={`mb-8 py-5 px-6 mx-auto max-w-sm rounded-lg reveal-on-scroll backdrop-blur-sm bg-gradient-to-r from-white/10 via-white/20 to-white/10 shadow-elegant ${
              animated ? "is-revealed" : ""
            }`}
            style={getAnimationDelay(5)}
          >
            <p className="font-elegant text-xl sm:text-2xl text-primary-dark mb-1">
              Le {invitationInfo.event.date}
            </p>
            <p className="text-muted">à {invitationInfo.event.venue}</p>
          </div>

          {/* Message personnalisé pour l'invité avec effet verre amélioré */}
          {guestInfo && (
            <div
              ref={messageRef}
              className={`mt-10 p-6 rounded-xl mx-auto max-w-md reveal-on-scroll backdrop-blur-md bg-gradient-to-br from-white/20 to-white/10 shadow-elegant border border-white/10 transform transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                messageIsVisible ? "is-revealed" : ""
              }`}
              style={getAnimationDelay(6)}
            >
              <p className="font-elegant text-sm sm:text-base text-primary-dark italic relative">
                <span className="absolute -top-4 -left-2 text-accent opacity-30 text-3xl">
                  &ldquo;
                </span>
                {guestInfo.message}
                <span className="absolute -bottom-4 -right-2 text-accent opacity-30 text-3xl">
                  &rdquo;
                </span>
              </p>
            </div>
          )}

          {/* Button scroll down avec animation améliorée - position ajustée en mobile */}
          <div
            className={`absolute ${
              guestInfo ? "bottom-4 sm:bottom-8" : "bottom-8"
            } left-1/2 transform -translate-x-1/2 mt-12 z-10`}
          >
            <button
              className="group flex flex-col items-center justify-center text-primary opacity-70 hover:opacity-100 transition-all bg-white/30 backdrop-blur-sm p-2 rounded-full shadow-sm"
              onClick={() =>
                document
                  .getElementById("details")
                  .scrollIntoView({ behavior: "smooth" })
              }
              aria-label="Défiler vers le bas"
            >
              <span className="text-xs uppercase tracking-widest mb-1 group-hover:transform group-hover:translate-y-1 transition-transform hidden sm:block">
                Découvrir
              </span>
              <div className="relative">
                <svg
                  className="w-7 h-7 sm:w-10 sm:h-10 animate-bounce-slow"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  ></path>
                </svg>
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Styles internes */}
        <style>{`
          .shadow-elegant {
            box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05);
          }
          
          .hardware-accelerated {
            transform: translateZ(0);
            will-change: transform;
          }
          
          @keyframes float-particle {
            0%, 100% {
              transform: translateY(0) translateX(0);
            }
            50% {
              transform: translateY(-20px) translateX(10px);
            }
          }
          
          .animate-float-slow {
            animation: float 8s ease-in-out infinite;
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0) translateX(-50%);
            }
            50% {
              transform: translateY(-10px) translateX(-50%);
            }
          }
          
          .animate-pulse-slow {
            animation: pulse 3s ease-in-out infinite;
          }
          
          .animate-bounce-slow {
            animation: bounce 2s ease-in-out infinite;
          }
          
          .animate-slow-spin {
            animation: spin 20s linear infinite;
          }
          
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
          }
          
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          .reveal-on-scroll {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
          }
          
          .reveal-on-scroll.is-revealed {
            opacity: 1;
            transform: translateY(0);
          }
        `}</style>
      </header>

      {/* Affichage des informations de table */}
      {tableInfo && (
        <div className="py-6 px-4">
          <div className="max-w-3xl mx-auto">
            <div
              className="rounded-2xl shadow-elegant p-6 backdrop-blur-sm border border-white/30 transform transition-all duration-500 hover:shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${tableInfo.color}15, ${tableInfo.color}30)`,
                borderLeft: `4px solid ${tableInfo.color}`,
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <h3 className="font-elegant text-xl text-primary-dark mb-2 sm:mb-0 relative inline-block">
                  <span className="flex items-center">
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="none"
                      stroke={tableInfo.color}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span style={{ color: tableInfo.color }}>
                      Table {tableInfo.name}
                    </span>
                  </span>
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent transform scale-0 group-hover:scale-100 transition-transform duration-500"></span>
                </h3>
                <span
                  className="text-sm font-medium px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: `${tableInfo.color}20`,
                    color: tableInfo.color,
                  }}
                >
                  {tableInfo.count} invités
                </span>
              </div>

              <div className="divide-y divide-primary/10">
                {/* Affichage de l'invité actuel uniquement */}
                {guestInfo &&
                  tableInfo.invites.map((invite, index) => {
                    // Ne montrer que l'invité actuel
                    if (
                      invite.name.toLowerCase() === guestInfo.name.toLowerCase()
                    ) {
                      return (
                        <div
                          key={index}
                          className="py-3 flex justify-between items-center -mx-3 px-3 rounded-lg"
                          style={{
                            backgroundColor: `${tableInfo.color}15`,
                          }}
                        >
                          <div className="flex items-center">
                            <span
                              className="w-2 h-2 rounded-full mr-3"
                              style={{ backgroundColor: tableInfo.color }}
                            ></span>
                            <span className="text-primary-dark">
                              {invite.name}
                            </span>
                          </div>
                          <span
                            className="text-sm px-2 py-1 rounded-full text-muted"
                            style={{ backgroundColor: `${tableInfo.color}15` }}
                          >
                            {invite.count}{" "}
                            {invite.count > 1 ? "personnes" : "personne"}
                          </span>
                        </div>
                      )
                    }
                    return null
                  })}

                {/* Message indiquant la présence d'autres invités anonymes */}
                <div className="py-4 text-center mt-3">
                  <p className="text-muted text-sm italic">
                    {guestInfo
                      ? `Vous partagerez cette table avec ${
                          tableInfo.count - (guestInfo.count || 1)
                        } autres invités`
                      : "Informations des invités masquées pour préserver leur confidentialité"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
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
 