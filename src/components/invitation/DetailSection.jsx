import { useState } from "react"
import PropTypes from "prop-types"
import { invitationInfo } from "../../data/invitationInfo"

/**
 * Section des détails de l'événement avec design élégant et interactif
 * @param {string} className - Classes CSS additionnelles
 */
const DetailSection = ({ className = "" }) => {
  const [activeTab, setActiveTab] = useState("date")

  return (
    <section
      id="details"
      className={`py-16 px-4 ${className} relative overflow-hidden`}
    >
      {/* Éléments décoratifs en arrière-plan améliorés */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-radial from-primary/10 to-transparent z-0 blur-3xl"></div>
      <div className="absolute bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-radial from-accent/10 to-transparent z-0 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/3 w-60 h-60 rounded-full bg-gradient-radial from-secondary/5 to-transparent z-0 blur-3xl opacity-60"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Titre de la section avec effet décoratif amélioré */}
        <div className="text-center mb-16 relative">
          <h2 className="font-elegant text-3xl sm:text-4xl text-primary mb-4 relative inline-block">
            Détails
            <div className="absolute bottom-0 left-1/2 w-3/4 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent"></div>
          </h2>
          <p className="text-muted text-sm max-w-md mx-auto leading-relaxed">
            Nous serions honorés de votre présence lors de notre célébration
          </p>

          {/* Navigation par onglets pour mobile avec effet float et shadow */}
          <div className="flex justify-center mt-8 md:hidden">
            <div className="bg-white rounded-full shadow-elegant p-1.5 inline-flex transform hover:translate-y-px transition-transform">
              <button
                className={`py-2 px-6 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === "date"
                    ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md"
                    : "text-primary-dark/70 hover:bg-primary/5"
                }`}
                onClick={() => setActiveTab("date")}
              >
                Date
              </button>
              <button
                className={`py-2 px-6 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === "lieu"
                    ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md"
                    : "text-primary-dark/70 hover:bg-primary/5"
                }`}
                onClick={() => setActiveTab("lieu")}
              >
                Lieu
              </button>
            </div>
          </div>
        </div>

        {/* Cartes d'information avec design amélioré et effets d'interactions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Carte Date et Heure avec glassmorphism et effets améliorés */}
          <div
            className={`group transform transition-all duration-500 hover:-translate-y-2 ${
              activeTab === "lieu" ? "hidden md:block" : ""
            }`}
          >
            <div className="relative p-6 rounded-2xl bg-gradient-to-b from-white/95 to-white/80 shadow-elegant backdrop-blur-sm border border-white/30 overflow-hidden">
              {/* Décoration supplémentaire */}
              <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
                <div className="bg-primary/10 rotate-45 transform origin-bottom-left w-32 h-32 -translate-y-12 translate-x-6"></div>
              </div>
              <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-gradient-radial from-primary/5 to-transparent blur-xl group-hover:opacity-80 transition-opacity"></div>

              <div className="text-center relative z-10">
                <div className="inline-flex items-center justify-center w-18 h-18 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 mb-5 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <svg
                    className="w-8 h-8 text-primary transform group-hover:rotate-12 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <h3 className="font-elegant text-2xl text-primary-dark mb-4 relative inline-block">
                  Date & Heure
                  <span className="absolute bottom-0 left-0 w-full h-0.5 scale-0 group-hover:scale-100 bg-gradient-to-r from-transparent via-primary/50 to-transparent transition-transform duration-500"></span>
                </h3>
                <p className="text-primary-dark font-semibold text-xl mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent inline-block">
                  {invitationInfo.event.date}
                </p>
                <p className="text-muted">à {invitationInfo.event.time}</p>

                {/* Timeline des événements améliorée */}
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-primary"
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
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-primary-dark">
                        19h00
                      </span>
                      <span className="text-xs text-muted">
                        Accueil des invités
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-accent"
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
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-primary-dark">
                        19h30
                      </span>
                      <span className="text-xs text-muted">
                        Début de la cérémonie
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-primary/5 rounded-xl p-5 border-l-2 border-primary/40 text-left">
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
              </div>
            </div>
          </div>

          {/* Carte Lieu avec glassmorphism et effets améliorés */}
          <div
            className={`group transform transition-all duration-500 hover:-translate-y-2 ${
              activeTab === "date" ? "hidden md:block" : ""
            }`}
          >
            <div className="relative p-6 rounded-2xl bg-gradient-to-b from-white/95 to-white/80 shadow-elegant backdrop-blur-sm border border-white/30 overflow-hidden">
              {/* Décoration supplémentaire */}
              <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
                <div className="bg-primary/10 rotate-45 transform origin-bottom-left w-32 h-32 -translate-y-12 translate-x-6"></div>
              </div>
              <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-gradient-radial from-accent/5 to-transparent blur-xl group-hover:opacity-80 transition-opacity"></div>

              <div className="text-center relative z-10">
                <div className="inline-flex items-center justify-center w-18 h-18 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 mb-5 shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <svg
                    className="w-8 h-8 text-primary transform group-hover:rotate-12 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
                <h3 className="font-elegant text-2xl text-primary-dark mb-4 relative inline-block">
                  Lieu
                  <span className="absolute bottom-0 left-0 w-full h-0.5 scale-0 group-hover:scale-100 bg-gradient-to-r from-transparent via-primary/50 to-transparent transition-transform duration-500"></span>
                </h3>
                <p className="text-primary-dark font-semibold text-xl mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent inline-block">
                  {invitationInfo.event.venue}
                </p>
                <p className="text-muted mb-1">
                  {invitationInfo.event.address}
                </p>
                <p className="text-sm text-muted">
                  {invitationInfo.event.location}, {invitationInfo.event.city}
                </p>

                {/* Options supplémentaires avec icônes améliorées et effets */}
                <div className="flex justify-center gap-4 mt-5">
                  <button
                    className="flex items-center justify-center w-11 h-11 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors transform hover:scale-110 transition-transform"
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
                    className="flex items-center justify-center w-11 h-11 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors transform hover:scale-110 transition-transform"
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
                    className="flex items-center justify-center w-11 h-11 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors transform hover:scale-110 transition-transform"
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

                <div className="mt-8 bg-primary/5 rounded-xl p-5 border-l-2 border-primary/40">
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
              </div>
            </div>
          </div>
        </div>

        {/* Texte supplémentaire avec design élégant */}
        <div className="text-center mt-16 max-w-2xl mx-auto">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-white/95 to-white/80 shadow-elegant backdrop-blur-sm border border-white/30 transform transition-all duration-500 hover:shadow-lg relative overflow-hidden">
            {/* Effet décoratif en arrière-plan */}
            <div className="absolute -inset-px bg-grid-pattern opacity-5"></div>
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 rounded-full bg-gradient-radial from-primary/5 to-transparent blur-xl"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 rounded-full bg-gradient-radial from-accent/5 to-transparent blur-xl"></div>

            <div className="relative">
              <svg
                className="w-8 h-8 text-primary/40 mx-auto mb-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <p className="text-primary-dark font-elegant text-xl italic leading-relaxed">
                {invitationInfo.welcomeMessage}
              </p>
            </div>
          </div>

          {/* Dress code avec design moderne */}
          <div className="mt-14 relative">
            <div className="inline-block bg-gradient-to-b from-white/95 to-white/80 px-10 py-6 rounded-2xl shadow-elegant border border-white/30 transform transition-all duration-500 hover:shadow-lg backdrop-blur-sm">
              {/* Effet décoratif */}
              <div className="absolute top-0 -mt-4 left-1/2 transform -translate-x-1/2 bg-primary/80 text-white text-xs uppercase tracking-widest py-1 px-4 rounded-full shadow-md">
                Dress Code
              </div>

              <p className="text-primary-dark text-lg font-medium mt-3">
                {invitationInfo.dressCode}
              </p>
              <div className="flex justify-center gap-4 mt-5">
                <span className="w-5 h-5 rounded-full bg-primary/40 transition-all duration-300 hover:scale-125 hover:bg-primary/60"></span>
                <span className="w-5 h-5 rounded-full bg-accent/40 transition-all duration-300 hover:scale-125 hover:bg-accent/60"></span>
                <span className="w-5 h-5 rounded-full bg-secondary/40 transition-all duration-300 hover:scale-125 hover:bg-secondary/60"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .shadow-elegant {
          box-shadow: 0 10px 40px -5px rgba(0, 0, 0, 0.08);
        }
        
        .shadow-inner {
          box-shadow: inset 0 2px 6px 0 rgba(0, 0, 0, 0.05);
        }
        
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </section>
  )
}

DetailSection.propTypes = {
  className: PropTypes.string,
}

export default DetailSection
