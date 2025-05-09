import React from "react"
import PropTypes from "prop-types"
import { invitationInfo } from "../../data/invitationInfo"

/**
 * Section affichant le programme de la journée avec une timeline
 * @param {string} className - Classes CSS additionnelles
 */
const ProgramSection = ({ className = "" }) => {
  return (
    <section
      id="programme"
      className={`py-12 px-4 bg-primary/5 ${className}`}
    >
      <div className="max-w-3xl mx-auto">
        {/* Titre de la section */}
        <div className="text-center mb-10">
          <h2 className="font-elegant text-3xl text-primary mb-2">Programme</h2>
          <p className="text-muted text-sm max-w-md mx-auto">
            Déroulement de notre journée spéciale
          </p>
          <div className="mt-3 flex justify-center">
            <div className="h-px w-20 bg-accent opacity-50"></div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Ligne verticale centrale de la timeline */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary/20"></div>

          {/* Événements */}
          <div className="space-y-8 md:space-y-0">
            {invitationInfo.schedule.map((event, index) => (
              <div
                key={index}
                className="relative"
              >
                {/* Conteneur pour chaque événement */}
                <div
                  className={`flex flex-col md:flex-row items-center ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Point sur la timeline (visible uniquement en desktop) */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-primary/10 border-2 border-primary items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>

                  {/* Contenu pour mobile (centré) et desktop (aligné à gauche/droite) */}
                  <div className="md:w-1/2 flex flex-col items-center md:items-end md:pr-8 md:text-right">
                    {index % 2 === 0 && (
                      <>
                        {/* Version desktop: contenu à droite */}
                        <div className="hidden md:block">
                          <TimelineItem
                            time={event.time}
                            title={event.title}
                            description={event.description}
                          />
                        </div>
                        {/* Version mobile: contenu centré */}
                        <div className="md:hidden">
                          <TimelineItem
                            time={event.time}
                            title={event.title}
                            description={event.description}
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="md:w-1/2 flex flex-col items-center md:items-start md:pl-8 md:text-left">
                    {index % 2 !== 0 && (
                      <TimelineItem
                        time={event.time}
                        title={event.title}
                        description={event.description}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note supplémentaire */}
        <div className="mt-12 text-center bg-white p-5 rounded-xl shadow-soft max-w-lg mx-auto">
          <p className="text-primary-dark text-sm italic">
            Les horaires sont donnés à titre indicatif. Merci de votre
            compréhension.
          </p>
        </div>
      </div>
    </section>
  )
}

/**
 * Composant interne pour chaque élément de la timeline
 */
const TimelineItem = ({ time, title, description }) => (
  <div className="bg-white p-4 rounded-xl shadow-elegant transform transition-all duration-300 hover:-translate-y-1 mb-4 md:mb-0 w-full max-w-xs">
    <div className="bg-primary/10 text-primary font-semibold rounded-lg py-1 px-3 inline-block text-sm mb-2">
      {time}
    </div>
    <h3 className="font-elegant text-xl text-primary-dark mb-1">{title}</h3>
    <p className="text-muted text-sm">{description}</p>
  </div>
)

TimelineItem.propTypes = {
  time: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
}

ProgramSection.propTypes = {
  className: PropTypes.string,
}

export default ProgramSection
