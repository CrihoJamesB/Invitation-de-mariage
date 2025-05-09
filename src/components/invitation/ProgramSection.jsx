import { useEffect, useState, useRef } from "react"
import PropTypes from "prop-types"
import { invitationInfo } from "../../data/invitationInfo"

/**
 * Section affichant le programme de la journée avec une timeline interactive
 * @param {string} className - Classes CSS additionnelles
 */
const ProgramSection = ({ className = "" }) => {
  const [activeEvent, setActiveEvent] = useState(null)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  // Mise à jour automatique des horaires
  useEffect(() => {
    // Ceci permet de s'assurer que les événements du programme sont mis à jour
    if (invitationInfo && invitationInfo.schedule) {
      // Mettre à jour tous les horaires en commençant par 19h
      invitationInfo.schedule.forEach((event, index) => {
        // Cherche le premier événement (accueil des invités)
        if (
          index === 0 ||
          event.title.toLowerCase().includes("accueil") ||
          event.title.toLowerCase().includes("arrivée")
        ) {
          event.time = "19h00"
        }

        // Chercher l'événement de la fête et mettre à jour l'heure si nécessaire
        if (
          event.title.toLowerCase().includes("fête") ||
          event.title.toLowerCase().includes("soirée")
        ) {
          event.time = "19h30"
        }
      })
    }
  }, [])

  // Détecter quand la section est visible pour animer l'entrée
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section
      id="programme"
      ref={sectionRef}
      className={`py-12 px-4 bg-gradient-to-b from-primary/5 via-white to-primary/5 ${className}`}
    >
      <div
        className={`max-w-4xl mx-auto transform transition-all duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Titre de la section avec animation de soulignement */}
        <div className="text-center mb-12">
          <h2 className="font-elegant text-3xl sm:text-4xl text-primary mb-3 relative inline-block">
            Programme
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent transform -translate-y-1"></span>
          </h2>
          <p className="text-muted text-sm max-w-lg mx-auto">
            Déroulement de notre soirée spéciale à partir de 19h
          </p>
        </div>

        {/* Navigation horizontale pour mobile */}
        <div className="md:hidden mb-8 overflow-x-auto pb-4 flex items-center justify-start gap-3 snap-x scrollbar-thin">
          {invitationInfo.schedule.map((event, index) => (
            <button
              key={index}
              onClick={() => setActiveEvent(index)}
              className={`flex-shrink-0 snap-start px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                activeEvent === index
                  ? "bg-primary text-white shadow-md"
                  : "bg-white text-primary-dark shadow-sm hover:bg-primary/5"
              }`}
            >
              <span className="mr-2">{event.time}</span>
              {event.title}
            </button>
          ))}
        </div>

        {/* Timeline avec design amélioré - Version mobile */}
        <div className="md:hidden space-y-6">
          {invitationInfo.schedule.map((event, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-5 shadow-elegant border-l-4 transform transition-all duration-500 ${
                activeEvent === index
                  ? "border-primary scale-100 opacity-100"
                  : "border-primary/30 opacity-80 hover:opacity-100"
              }`}
              onClick={() => setActiveEvent(index)}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 text-primary flex-shrink-0">
                  <span className="text-sm font-bold">{event.time}</span>
                </div>
                <div>
                  <h3 className="font-elegant text-lg text-primary-dark">
                    {event.title}
                    {event.title.toLowerCase().includes("fête") && (
                      <span className="ml-2 inline-flex items-center">
                        <svg
                          className="w-4 h-4 text-accent"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                        </svg>
                      </span>
                    )}
                  </h3>
                  <p className="text-muted text-sm mt-1">{event.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline avec design amélioré - Version desktop */}
        <div className="relative timeline-container pb-10 hidden md:block">
          {/* Ligne verticale centrale de la timeline avec animation de pulsation */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary/10 via-primary/40 to-primary/10 timeline-line"></div>

          {/* Événements */}
          <div className="space-y-20">
            {invitationInfo.schedule.map((event, index) => (
              <div
                key={index}
                className={`relative timeline-event ${
                  isVisible ? "animate-timeline-fade-in" : ""
                }`}
                style={{ animationDelay: `${index * 300}ms` }}
                onMouseEnter={() => setActiveEvent(index)}
              >
                {/* Conteneur pour chaque événement */}
                <div
                  className={`flex flex-col md:flex-row items-center ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Point sur la timeline */}
                  <div
                    className={`absolute left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md z-10 transition-all duration-300 ${
                      activeEvent === index ? "scale-125" : ""
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full bg-white pulse-animation"></div>
                  </div>

                  {/* Contenu pour desktop (aligné à gauche/droite) */}
                  <div
                    className={`md:w-1/2 ${
                      index % 2 === 0
                        ? "md:pr-12 md:text-right"
                        : "md:pl-12 md:text-left"
                    }`}
                  >
                    <div
                      className={`rounded-xl p-6 bg-white shadow-elegant border-l-4 transform transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${
                        activeEvent === index
                          ? "border-primary opacity-100"
                          : "border-primary/30 opacity-90"
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div
                          className={`flex items-center h-6 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold ${
                            index % 2 === 0 ? "ml-auto" : ""
                          }`}
                        >
                          {event.time}
                        </div>
                      </div>
                      <h3 className="font-elegant text-xl text-primary-dark mb-2">
                        {event.title}
                        {event.title.toLowerCase().includes("fête") && (
                          <span className="ml-2 inline-flex items-center">
                            <svg
                              className="w-4 h-4 text-accent"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          </span>
                        )}
                      </h3>
                      <p className="text-muted">{event.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note supplémentaire avec un design élégant */}
        <div className="mt-16 text-center">
          <div className="bg-white p-6 rounded-xl shadow-elegant max-w-lg mx-auto border border-primary/10 relative">
            <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-md">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <p className="text-primary-dark text-sm italic">
              Les horaires sont donnés à titre indicatif. L&apos;accueil
              commencera à 19h.
            </p>
            <div className="mt-3 pt-3 border-t border-primary/10">
              <p className="text-xs text-muted">
                Pour toute question concernant le déroulement, n&apos;hésitez
                pas à contacter les témoins.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Styles spécifiques à la timeline */}
      <style jsx>{`
        .timeline-event {
          opacity: 0;
        }

        @keyframes timeline-fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-timeline-fade-in {
          animation: timeline-fade-in 0.6s ease-out forwards;
        }

        .timeline-dot {
          transition: all 0.3s ease;
        }

        .timeline-event:hover .timeline-dot {
          transform: translate(-50%, 0) scale(1.2);
        }

        .pulse-animation {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
          }
          70% {
            transform: scale(1);
            box-shadow: 0 0 0 5px rgba(255, 255, 255, 0);
          }
          100% {
            transform: scale(0.95);
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          }
        }

        .shadow-elegant {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }

        .scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 2px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 2px;
        }

        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </section>
  )
}

ProgramSection.propTypes = {
  className: PropTypes.string,
}

export default ProgramSection 