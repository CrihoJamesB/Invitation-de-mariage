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
        if (index === 0) {
          setActiveEvent(event.time)
        }
      })
    }
  }, [])

  // Effet d'observation de visibilité pour les animations
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
      className={`py-16 px-4 ${className} relative overflow-hidden`}
    >
      {/* Arrière-plan décoratif avec effet de dégradé */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-white/90 to-white/95"></div>

      {/* Éléments décoratifs en arrière-plan */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-radial from-primary/10 to-transparent z-0 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gradient-radial from-accent/10 to-transparent z-0 blur-3xl"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-gradient-radial from-secondary/5 to-transparent z-0 blur-3xl opacity-60"></div>

      {/* Motif décoratif */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] z-0"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Titre de la section avec animation */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-10"
          }`}
        >
          <h2 className="font-elegant text-3xl sm:text-4xl text-primary mb-4 relative inline-block">
            Programme
            <div className="absolute bottom-0 left-1/2 w-3/4 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent"></div>
          </h2>
          <p className="text-muted text-sm max-w-md mx-auto leading-relaxed">
            Découvrez les moments clés de notre célébration
          </p>
        </div>

        {/* Conteneur de la timeline adaptative */}
        <div className="flex flex-col items-center">
          {/* Version mobile - timeline verticale */}
          <div className="block md:hidden w-full">
            <div
              className={`relative py-5 transition-all duration-1000 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Ligne temporelle verticale */}
              <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/30 via-accent/40 to-primary/30 rounded-full"></div>

              {/* Événements de la timeline */}
              {invitationInfo.schedule.map((event, index) => (
                <div
                  key={event.time}
                  className={`relative mb-12 last:mb-0 transition-all duration-500 ${
                    activeEvent === event.time
                      ? "scale-100 opacity-100"
                      : "scale-95 opacity-70"
                  }`}
                >
                  {/* Point de la timeline avec effet pulsation */}
                  <div
                    className={`absolute left-4 w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer z-20`}
                    onClick={() => setActiveEvent(event.time)}
                  >
                    <span
                      className={`w-3 h-3 rounded-full ${
                        activeEvent === event.time
                          ? "bg-accent animate-pulse-ring"
                          : "bg-primary/40"
                      }`}
                    ></span>
                    <span
                      className={`absolute w-8 h-8 rounded-full ${
                        activeEvent === event.time
                          ? "border-2 border-accent/40"
                          : "border border-primary/20"
                      }`}
                    ></span>
                  </div>

                  {/* Contenu de l'événement avec style moderne */}
                  <div
                    className={`ml-12 p-5 rounded-xl backdrop-blur-sm border border-white/50 shadow-elegant transition-all duration-500 transform hover:-translate-y-1 hover:shadow-xl ${
                      activeEvent === event.time
                        ? "bg-gradient-to-br from-white/90 to-white/80 border-accent/20"
                        : "bg-white/70"
                    }`}
                    onClick={() => setActiveEvent(event.time)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-elegant text-xl text-primary-dark">
                        {event.time}
                      </span>
                      <span
                        className={`text-xs rounded-full px-3 py-1 ${
                          activeEvent === event.time
                            ? "bg-accent/10 text-accent"
                            : "bg-primary/5 text-primary/70"
                        }`}
                      >
                        {index === 0
                          ? "Début"
                          : index === invitationInfo.schedule.length - 1
                          ? "Fin"
                          : `Étape ${index + 1}`}
                      </span>
                        </div>
                    <h3 className="font-medium text-lg text-primary-dark mb-2">
                      {event.title}
                    </h3>
                    <p className="text-muted text-sm">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

          {/* Version desktop - timeline horizontale */}
          <div className="hidden md:block w-full">
            <div
              className={`relative transition-all duration-1000 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Ligne temporelle horizontale */}
              <div className="absolute top-12 left-0 right-0 h-1 bg-gradient-to-r from-primary/30 via-accent/40 to-primary/30 rounded-full"></div>

              {/* Conteneur des événements */}
              <div className="flex justify-between relative">
                {invitationInfo.schedule.map((event, index) => (
                  <div
                    key={event.time}
                    className={`w-1/${
                      invitationInfo.schedule.length
                    } px-2 transition-all duration-500 ${
                      activeEvent === event.time ? "opacity-100" : "opacity-70"
                    }`}
                  >
                    {/* Point de la timeline avec effet pulsation */}
                    <div
                      className="relative mx-auto w-8 h-8 flex items-center justify-center cursor-pointer z-20"
                      onClick={() => setActiveEvent(event.time)}
                    >
                      <span
                        className={`w-3 h-3 rounded-full ${
                          activeEvent === event.time
                            ? "bg-accent animate-pulse-ring"
                            : "bg-primary/40"
                        }`}
                      ></span>
                      <span
                        className={`absolute w-8 h-8 rounded-full ${
                          activeEvent === event.time
                            ? "border-2 border-accent/40"
                            : "border border-primary/20"
                        }`}
                      ></span>
                    </div>

                    {/* Heure au-dessus de la ligne */}
                    <div
                      className="text-center mb-8 mt-2"
                      onClick={() => setActiveEvent(event.time)}
                    >
                      <span
                        className={`font-medium ${
                          activeEvent === event.time
                            ? "text-accent"
                            : "text-primary/70"
                        }`}
                      >
                        {event.time}
                      </span>
                    </div>

                    {/* Contenu de l'événement en dessous de la ligne */}
                    <div
                      className={`p-5 rounded-xl backdrop-blur-sm transition-all duration-500 transform hover:-translate-y-1 hover:shadow-xl cursor-pointer border border-white/50 shadow-elegant ${
                        activeEvent === event.time
                          ? "bg-gradient-to-br from-white/90 to-white/80 border-accent/20"
                          : "bg-white/70"
                      }`}
                      onClick={() => setActiveEvent(event.time)}
                    >
                      <span
                        className={`text-xs rounded-full px-3 py-1 mb-3 inline-block ${
                          activeEvent === event.time
                            ? "bg-accent/10 text-accent"
                            : "bg-primary/5 text-primary/70"
                        }`}
                      >
                        {index === 0
                          ? "Début"
                          : index === invitationInfo.schedule.length - 1
                          ? "Fin"
                          : `Étape ${index + 1}`}
                      </span>
                      <h3 className="font-medium text-lg text-primary-dark mb-2">
                        {event.title}
                      </h3>
                      <p className="text-muted text-sm">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Message d'information supplémentaire */}
          <div
            className={`mt-16 max-w-2xl mx-auto text-center transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-10"
            }`}
          >
            <div className="p-6 rounded-2xl bg-gradient-to-br from-white/95 to-white/80 shadow-elegant backdrop-blur-sm border border-white/30 transform transition-all duration-500 hover:shadow-lg relative overflow-hidden">
              {/* Effet décoratif en arrière-plan */}
              <div className="absolute -inset-px bg-grid-pattern opacity-5"></div>
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 rounded-full bg-gradient-radial from-primary/5 to-transparent blur-xl"></div>
              <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 rounded-full bg-gradient-radial from-accent/5 to-transparent blur-xl"></div>

              <div className="relative">
                <svg
                  className="w-8 h-8 text-primary/40 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <p className="text-primary-dark font-elegant text-xl italic leading-relaxed">
                  Nous vous invitons à respecter les horaires pour que cette
                  journée soit aussi parfaite pour vous que pour nous.
                </p>

                <div className="mt-6 flex justify-center">
                  <a
                    href="#details"
                    className="inline-flex items-center px-5 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors group"
                  >
                    <svg
                      className="w-4 h-4 mr-2 group-hover:animate-bounce"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    Voir plus de détails
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .shadow-elegant {
          box-shadow: 0 10px 40px -5px rgba(0, 0, 0, 0.08);
        }

        .bg-grid-pattern {
          background-image: linear-gradient(
              to right,
              rgba(0, 0, 0, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(var(--color-accent-rgb), 0.7);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(var(--color-accent-rgb), 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(var(--color-accent-rgb), 0);
          }
        }

        .animate-pulse-ring {
          animation: pulse-ring 2s infinite;
        }
      `}</style>
    </section>
  )
}

ProgramSection.propTypes = {
  className: PropTypes.string,
}

export default ProgramSection