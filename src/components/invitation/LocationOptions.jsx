import React, { useState } from "react"
import PropTypes from "prop-types"
import Button from "../common/Button"
import { invitationInfo } from "../../data/invitationInfo"
import RevealOnScroll from "../common/RevealOnScroll"
import { getNavigationUrls } from "../../config/maps"

/**
 * Composant affichant des options de navigation et des informations
 * complémentaires sur le lieu de la cérémonie
 *
 * @param {string} className - Classes CSS additionnelles
 */
const LocationOptions = ({ className = "" }) => {
  const [showInfo, setShowInfo] = useState(false)

  // Utiliser les URLs de navigation centralisées
  const navigationUrls = getNavigationUrls(invitationInfo.event)

  return (
    <div className={`mt-6 ${className}`}>
      <RevealOnScroll
        animation="fade-up"
        delay={100}
      >
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-elegant text-xl text-primary-dark">
            Options de navigation
          </h4>
          <button
            className="text-primary text-sm underline"
            onClick={() => setShowInfo(!showInfo)}
          >
            {showInfo ? "Masquer les détails" : "Plus d&apos;options"}
          </button>
        </div>

        {/* Services de navigation principaux */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <a
            href={navigationUrls.googleMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white p-3 rounded-lg shadow-soft text-primary-dark hover:bg-highlight transition-colors"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Google_Maps_Logo_2020.svg/512px-Google_Maps_Logo_2020.svg.png"
              alt="Google Maps"
              className="h-5"
            />
            <span className="font-medium text-sm">Google Maps</span>
          </a>

          <a
            href={navigationUrls.yango}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white p-3 rounded-lg shadow-soft text-primary-dark hover:bg-highlight transition-colors"
          >
            <svg 
              className="w-5 h-5 text-[#FF0033]" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              <path d="M11 7h2v7h-2zm-1 8h4v2h-4z" />
            </svg>
            <span className="font-medium text-sm">Yango</span>
          </a>
        </div>

        {/* Options additionnelles */}
        {showInfo && (
          <div className="bg-white p-4 rounded-lg shadow-soft space-y-4 animate-fade-in">
            <div>
              <h5 className="text-primary-dark font-medium text-sm mb-2">
                Autres services
              </h5>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={navigationUrls.appleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded border border-primary/10 hover:bg-primary/5"
                >
                  <svg
                    className="w-4 h-4 text-primary"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12.2 0c.59 0 1.49.16 2.4.46 1.35.45 2.53 1.33 3.34 2.44.52.71.92 1.55 1.16 2.43 0 0-2.41.84-2.39 3.05 0 2.44 2.14 3.27 2.14 3.27-.14.46-.35.98-.63 1.5-.42.77-.96 1.57-1.67 1.57-.7 0-.94-.44-1.74-.44-.8 0-1.06.44-1.74.44-.7 0-1.24-.8-1.67-1.56-.73-1.33-1.27-3.32-1.27-5.27 0-3.07 2-4.67 3.83-4.67.95 0 1.69.44 2.24.44.55 0 1.32-.44 2.24-.44.35 0 .94.09 1.57.29-1.33.7-2.24 2.09-2.24 3.67 0 1.77.99 3.18 2.43 3.87-.43 1.27-1.09 2.5-1.9 3.39M8.37 24c1.2 0 1.71-1.88 3.11-1.88 1.4 0 2.8 1.88 3.05 1.88.1 0 .21-.02.21-.12 0-.11-.24-.67-.37-.9-.12-.23-.23-.37-.32-.62-.96-2.58-.56-3.12-.1-4.95.45-1.73 2.2-3.01 2.2-3.01 0-.02-.06-.04-.06-.04-.37.05-.76.14-1.08.27-.33.13-.7.3-1 .3-.33 0-.71-.17-1.13-.25-.42-.08-.86-.15-1.18-.15-2.69 0-4.5 2.88-4.5 5.83 0 1.17.22 2.13.49 2.79.26.67.67.85.68.85" />
                  </svg>
                  <span className="text-xs">Apple Plans</span>
                </a>

                <a
                  href={navigationUrls.uber}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 rounded border border-primary/10 hover:bg-primary/5"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 22c-5.52 0-10-4.48-10-10S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zm4.59-16H7.42c-.32 0-.59.26-.59.58v8.84c0 .32.26.58.58.58h9.17c.33 0 .59-.26.59-.58V6.58c0-.32-.26-.58-.58-.58zM11 14.8v-3.38c0-.28.24-.42.5-.28l2.92 1.7c.26.14.26.44.02.59l-2.92 1.7c-.28.14-.52-.02-.52-.33z" />
                  </svg>
                  <span className="text-xs">Uber</span>
                </a>
              </div>
            </div>

            <div>
              <h5 className="text-primary-dark font-medium text-sm mb-2">
                Transport public
              </h5>
              <p className="text-muted text-xs">
                Plusieurs lignes de bus desservent la zone. Descendez à
                l&apos;arrêt &quot;Terrain Municipal&quot; et marchez environ 5
                minutes.
              </p>
            </div>

            <div>
              <h5 className="text-primary-dark font-medium text-sm mb-2">
                Parking
              </h5>
              <p className="text-muted text-xs">
                Un parking gratuit est disponible sur place avec environ 50
                places. Des parkings payants se trouvent également à proximité
                (environ 2000 FC pour la journée).
              </p>
            </div>

            <div>
              <h5 className="text-primary-dark font-medium text-sm mb-2">
                Contact venue
              </h5>
              <a
                href="tel:+243123456789"
                className="text-primary text-xs underline"
              >
                +243 12 345 6789
              </a>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInfo(false)}
              className="w-full mt-2"
            >
              Masquer les détails
            </Button>
          </div>
        )}
      </RevealOnScroll>
    </div>
  )
}

LocationOptions.propTypes = {
  className: PropTypes.string,
}

export default LocationOptions
