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
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [messageRef, messageIsVisible] = useIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true
  });

  // Détection du défilement pour effets multiples
  useEffect(() => {
    if (!animated) return;
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      // Effet parallaxe avec distance limitée
      const offset = Math.min(scrollPosition * 0.2, 150);
      setParallaxOffset(offset);
      
      // Effet de fondu progressif lors du défilement
      const maxScroll = window.innerHeight * 0.6;
      const newOpacity = 1 - Math.min(scrollPosition / maxScroll, 0.6);
      setScrollOpacity(newOpacity);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [animated]);

  // Optimisation pour ajouter séquentiellement les animations
  const getAnimationDelay = (index) => {
    return { animationDelay: `${index * 100}ms` };
  };

  return (
    <header className={`relative overflow-hidden min-h-[90vh] flex flex-col justify-center ${className}`}>
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

      {/* Effet de halo brillant animé */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-pulse-slow golden-glow"></div>
      </div>

      {/* Particules flottantes décoratives */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-3 h-3 rounded-full bg-accent/5" 
            style={{
              top: `${10 + Math.random() * 80}%`, 
              left: `${Math.random() * 100}%`,
              opacity: 0.4 + Math.random() * 0.6,
              animation: `float-particle ${5 + Math.random() * 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`
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
        <div className="mb-8">
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
            className={`text-primary font-sans text-sm sm:text-base tracking-widest uppercase mt-1 reveal-on-scroll ${
              animated ? "is-revealed" : ""
            }`}
            style={getAnimationDelay(1)}
          >
            VOUS INVITENT AU MARIAGE DE
          </p>
        </div>

        {/* Noms des mariés avec effet brillant amélioré */}
        <div className="mb-10 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 blur-xl golden-glow animate-glow-pulse"></div>
          <h1
            className={`font-cursive text-4xl sm:text-5xl md:text-6xl text-gradient mb-1 select-none hardware-accelerated reveal-on-scroll ${
              animated ? "is-revealed" : ""
            }`}
            style={getAnimationDelay(2)}
          >
            {invitationInfo.couple.groom}
          </h1>
          <div
            className={`flex items-center justify-center my-3 reveal-on-scroll ${
              animated ? "is-revealed" : ""
            }`}
            style={getAnimationDelay(3)}
          >
            {/* Séparateur avec cœur animé */}
            <div className="h-px w-12 bg-accent opacity-70"></div>
            <div className="mx-3 text-accent">
              <svg
                className="w-6 h-6 animate-pulse-slow transform hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div className="h-px w-12 bg-accent opacity-70"></div>
          </div>
          <h1
            className={`font-cursive text-4xl sm:text-5xl md:text-6xl text-gradient hardware-accelerated reveal-on-scroll ${
              animated ? "is-revealed" : ""
            }`}
            style={getAnimationDelay(4)}
          >
            {invitationInfo.couple.bride}
          </h1>
        </div>

        {/* Date et lieu avec bordure élégante et animation */}
        <div
          className={`mb-8 py-4 px-6 mx-auto max-w-sm border-t border-b border-primary/20 reveal-on-scroll backdrop-blur-sm bg-white/5 shadow-sm ${
            animated ? "is-revealed" : ""
          }`}
          style={getAnimationDelay(5)}
        >
          <p className="font-elegant text-lg sm:text-xl text-primary-dark">
            Le {invitationInfo.event.date}
          </p>
          <p className="font-sans text-sm text-muted mt-1">
            à {invitationInfo.event.venue}
          </p>
        </div>

        {/* Message personnalisé pour l'invité avec effet verre amélioré */}
        {guestInfo && (
          <div
            ref={messageRef}
            className={`mt-8 glass-card p-5 rounded-xl mx-auto max-w-md reveal-on-scroll backdrop-blur-md bg-white/30 shadow-elegant transform transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${
              messageIsVisible ? "is-revealed" : ""
            }`}
            style={getAnimationDelay(6)}
          >
            <p className="font-elegant text-sm sm:text-base text-primary-dark italic relative">
              <span className="absolute -top-4 -left-2 text-accent opacity-30 text-3xl">
                "
              </span>
              {guestInfo.message}
              <span className="absolute -bottom-4 -right-2 text-accent opacity-30 text-3xl">
                "
              </span>
            </p>
          </div>
        )}

        {/* Button scroll down */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button 
            className="text-primary opacity-70 hover:opacity-100 transition-opacity"
            onClick={() => document.getElementById('details').scrollIntoView({ behavior: 'smooth' })}
            aria-label="Défiler vers le bas"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Styles internes */}
      <style jsx="true">{`
        .text-gradient {
          background: linear-gradient(to right, var(--color-primary-dark), var(--color-primary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
        }
        
        .hardware-accelerated {
          transform: translateZ(0);
          will-change: transform;
        }
        
        .golden-glow {
          animation: glow-pulse 4s ease-in-out infinite;
        }
        
        .shadow-elegant {
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05);
        }

        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        
        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
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
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
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
 