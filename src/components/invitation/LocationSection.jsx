import React from "react"
import PropTypes from "prop-types"
import { invitationInfo } from "../../data/invitationInfo"
import Button from "../common/Button"

/**
 * Section affichant la localisation de l'événement avec une carte intégrée
 * @param {string} className - Classes CSS additionnelles
 */
const LocationSection = ({ className = "" }) => {
  // Construire l'URL Google Maps avec les paramètres de la salle
  const getGoogleMapsUrl = () => {
    const address = encodeURIComponent(
      `${invitationInfo.event.venue}, ${invitationInfo.event.address}, ${invitationInfo.event.location}, ${invitationInfo.event.city}, ${invitationInfo.event.country}`
    )
    return `https://www.google.com/maps/search/?api=1&query=${address}`
  }

  // Ouvrir Google Maps en mode navigation
  const openGoogleMapsNavigation = () => {
    const url = getGoogleMapsUrl()
    window.open(url, "_blank")
  }

  // Construire l'URL de partage WhatsApp
  const getWhatsAppShareUrl = () => {
    const message = encodeURIComponent(
      `Lieu du mariage de ${invitationInfo.couple.groom} et ${
        invitationInfo.couple.bride
      }: ${invitationInfo.event.venue}, ${invitationInfo.event.address}, ${
        invitationInfo.event.city
      }. Voici le lien Google Maps: ${getGoogleMapsUrl()}`
    )
    return `https://wa.me/?text=${message}`
  }

  return (
    <section
      id="lieu"
      className={`py-12 px-4 ${className}`}
    >
      <div className="max-w-3xl mx-auto">
        {/* Titre de la section */}
        <div className="text-center mb-10">
          <h2 className="font-elegant text-3xl text-primary mb-2">
            Localisation
          </h2>
          <p className="text-muted text-sm max-w-md mx-auto">
            Retrouvez-nous facilement grâce à la carte
          </p>
          <div className="mt-3 flex justify-center">
            <div className="h-px w-20 bg-accent opacity-50"></div>
          </div>
        </div>

        {/* Carte et infos */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Carte */}
          <div className="md:col-span-3 rounded-xl overflow-hidden shadow-elegant h-[300px] sm:h-[350px] md:h-[400px]">
            <iframe
              title="Carte du lieu de mariage"
              className="w-full h-full border-0"
              src={`https://www.google.com/maps/embed/v1/place?key=VOTRE_CLE_API&q=${encodeURIComponent(
                `${invitationInfo.event.venue}, ${invitationInfo.event.address}, ${invitationInfo.event.city}`
              )}&zoom=15`}
              allowFullScreen
            ></iframe>
          </div>

          {/* Informations et boutons */}
          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <h3 className="font-elegant text-2xl text-primary-dark mb-3">
                {invitationInfo.event.venue}
              </h3>

              <p className="text-primary-dark font-medium mb-1">
                {invitationInfo.event.address}
              </p>

              <p className="text-muted text-sm mb-4">
                {invitationInfo.event.location}
                <br />
                {invitationInfo.event.city}, {invitationInfo.event.country}
              </p>

              <div className="bg-primary/5 p-4 rounded-lg mb-6">
                <h4 className="font-sans text-primary-dark font-medium mb-2">
                  Informations pratiques
                </h4>
                <ul className="text-muted text-sm space-y-2">
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-primary mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Parking disponible à proximité</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-primary mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Référence: {invitationInfo.event.reference}</span>
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 text-primary mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Accessible aux personnes à mobilité réduite</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="space-y-3">
              <Button
                variant="primary"
                fullWidth
                icon={
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
                    ></path>
                  </svg>
                }
                onClick={openGoogleMapsNavigation}
              >
                Obtenir l'itinéraire
              </Button>

              <Button
                variant="outline"
                fullWidth
                icon={
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.151-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345M12 21.594c-1.349 0-2.68-.213-3.934-.638l-.285-.135-2.91.776.791-2.891-.149-.294a10.856 10.856 0 01-.69-3.996c0-6.01 4.935-10.897 10.989-10.897 2.94 0 5.7 1.15 7.769 3.223a10.816 10.816 0 013.234 7.75c0 6.011-4.935 10.904-10.989 10.904M20.415 3.549a12.987 12.987 0 00-9.245-3.829C4.91-.27-.085 8.816-.085 19.201c0 2.146.42 4.246 1.235 6.204l-1.485 5.406 5.55-1.441c1.875.713 3.906 1.095 5.97 1.095 6.259 0 11.255-9.086 11.255-19.472 0-3.465-1.35-6.769-3.786-9.241" />
                  </svg>
                }
                onClick={() => window.open(getWhatsAppShareUrl(), "_blank")}
              >
                Partager sur WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

LocationSection.propTypes = {
  className: PropTypes.string,
}

export default LocationSection
