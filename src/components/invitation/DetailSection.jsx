import { useState } from "react"
import PropTypes from "prop-types"
import { invitationInfo } from "../../data/invitationInfo"
import Card from "../common/Card"

/**
 * Section des détails de l'événement avec design élégant et interactif
 * @param {string} className - Classes CSS additionnelles
 */
const DetailSection = ({ className = "" }) => {
  const [activeTab, setActiveTab] = useState("date")

  return (
    <section
      id="details"
      className={`py-12 px-4 ${className} relative overflow-hidden`}
    >
      {/* Éléments décoratifs en arrière-plan */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/5 z-0 blur-3xl"></div>
      <div className="absolute bottom-10 -left-10 w-56 h-56 rounded-full bg-accent/5 z-0 blur-3xl"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Titre de la section avec effet décoratif */}
        <div className="text-center mb-12 relative">
          <h2 className="font-elegant text-3xl sm:text-4xl text-primary mb-3 relative inline-block">
            Détails
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent transform -translate-y-1"></span>
          </h2>
          <p className="text-muted text-sm max-w-md mx-auto">
            Nous serions honorés de votre présence lors de notre célébration
          </p>

          {/* Navigation par onglets pour mobile */}
          <div className="flex justify-center mt-6 md:hidden">
            <div className="bg-white rounded-full shadow-md p-1 inline-flex">
              <button
                className={`py-1.5 px-4 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === "date"
                    ? "bg-primary text-white shadow-inner"
                    : "text-primary/70 hover:bg-primary/5"
                }`}
                onClick={() => setActiveTab("date")}
              >
                Date
              </button>
              <button
                className={`py-1.5 px-4 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === "lieu"
                    ? "bg-primary text-white shadow-inner"
                    : "text-primary/70 hover:bg-primary/5"
                }`}
                onClick={() => setActiveTab("lieu")}
              >
                Lieu
              </button>
            </div>
          </div>
        </div>

        {/* Cartes d'information avec design amélioré */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Carte Date et Heure */}
          <Card
            className={`transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${
              activeTab === "lieu" ? "hidden md:block" : ""
            }`}
            variant="elegant"
          >
            <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
              <div className="bg-primary/10 rotate-45 transform origin-bottom-left w-28 h-28 -translate-y-12 translate-x-6"></div>
            </div>
            <Card.Body className="text-center relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 mb-4 shadow-inner">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <h3 className="font-elegant text-xl text-primary-dark mb-3">
                Date & Heure
              </h3>
              <p className="text-primary-dark font-semibold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent inline-block">
                {invitationInfo.event.date}
              </p>
              <p className="text-muted mt-1">à {invitationInfo.event.time}</p>

              {/* Détails supplémentaires avec meilleure mise en évidence */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-primary-dark">19h00</span>
                  <span className="text-xs text-muted">
                    Accueil des invités
                  </span>
                </div>

                <div className="flex items-center justify-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-accent"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"
                      ></path>
                    </svg>
                  </div>
                  <span className="text-primary-dark">19h30</span>
                  <span className="text-xs text-muted">
                    Début de la cérémonie
                  </span>
                </div>
              </div>

              <div className="mt-6 bg-primary/5 rounded-lg p-4 border-l-2 border-primary/30 text-left">
                <div className="flex">
                  <svg
                    className="w-5 h-5 text-primary/70 mr-2 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <div>
                    <p className="text-sm text-primary-dark font-medium">
                      Arrivée recommandée à partir de 19h
                    </p>
                    <p className="text-xs text-muted mt-1">
                      Merci d&apos;arriver à l&apos;avance pour faciliter
                      l&apos;organisation
                    </p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Carte Lieu */}
          <Card
            className={`transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${
              activeTab === "date" ? "hidden md:block" : ""
            }`}
            variant="elegant"
          >
            <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden">
              <div className="bg-primary/10 rotate-45 transform origin-bottom-left w-28 h-28 -translate-y-12 translate-x-6"></div>
            </div>
            <Card.Body className="text-center relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 mb-4 shadow-inner">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="font-elegant text-xl text-primary-dark mb-3">
                Lieu
              </h3>
              <p className="text-primary-dark font-semibold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent inline-block">
                {invitationInfo.event.venue}
              </p>
              <p className="text-muted mt-1">{invitationInfo.event.address}</p>
              <p className="text-sm text-muted mt-1">
                {invitationInfo.event.location}, {invitationInfo.event.city}
              </p>

              {/* Options supplémentaires avec icônes */}
              <div className="flex justify-center gap-3 mt-4">
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  aria-label="Voir sur la carte"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                </button>
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  aria-label="Itinéraire Google Maps"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </button>
                <button
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  aria-label="Partager le lieu"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-6 bg-primary/5 rounded-lg p-4 border-l-2 border-primary/30">
                <div className="flex items-start">
                  <svg
                    className="w-5 h-5 text-primary/70 mr-2 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <div className="text-left">
                    <p className="text-sm text-primary-dark">
                      <span className="font-medium">Référence :</span>{" "}
                      {invitationInfo.event.reference}
                    </p>
                    <p className="text-xs text-muted mt-1">
                      Parking disponible sur place
                    </p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Texte supplémentaire avec design élégant */}
        <div className="text-center mt-12 max-w-xl mx-auto">
          <div className="p-6 rounded-xl bg-gradient-to-br from-secondary to-secondary/60 shadow-elegant transform transition-all duration-500 hover:shadow-lg">
            <svg
              className="w-6 h-6 text-primary/50 mx-auto mb-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              ></path>
            </svg>
            <p className="text-primary-dark font-elegant text-lg italic">
              {invitationInfo.welcomeMessage}
            </p>
          </div>

          {/* Dress code avec design moderne */}
          <div className="mt-10">
            <div className="inline-block bg-white px-6 py-4 rounded-xl shadow-elegant border border-primary/10 transform transition-all duration-500 hover:shadow-lg">
              <h4 className="font-sans uppercase tracking-wider text-sm text-primary mb-2">
                Dress Code
              </h4>
              <div className="h-px w-full bg-primary/10 my-2"></div>
              <p className="text-primary-dark text-base font-medium">
                {invitationInfo.dressCode}
              </p>
              <div className="flex justify-center gap-3 mt-4">
                <span className="w-4 h-4 rounded-full bg-primary/30 transition-all duration-300 hover:scale-125"></span>
                <span className="w-4 h-4 rounded-full bg-accent/30 transition-all duration-300 hover:scale-125"></span>
                <span className="w-4 h-4 rounded-full bg-primary/30 transition-all duration-300 hover:scale-125"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .shadow-elegant {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
        .shadow-inner {
          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
        }
      `}</style>
    </section>
  )
}

DetailSection.propTypes = {
  className: PropTypes.string,
}

export default DetailSection
