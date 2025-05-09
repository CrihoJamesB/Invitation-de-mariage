import React from "react"
import PropTypes from "prop-types"
import { invitationInfo } from "../../data/invitationInfo"
import Card from "../common/Card"

/**
 * Section des détails de l'événement avec design élégant
 * @param {string} className - Classes CSS additionnelles
 */
const DetailSection = ({ className = "" }) => {
  return (
    <section
      id="details"
      className={`py-12 px-4 ${className}`}
    >
      <div className="max-w-3xl mx-auto">
        {/* Titre de la section */}
        <div className="text-center mb-10">
          <h2 className="font-elegant text-3xl text-primary mb-2">Détails</h2>
          <p className="text-muted text-sm max-w-md mx-auto">
            Nous serions honorés de votre présence lors de notre célébration
          </p>
          <div className="mt-3 flex justify-center">
            <div className="h-px w-20 bg-accent opacity-50"></div>
          </div>
        </div>

        {/* Cartes d'information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Carte Date et Heure */}
          <Card
            className="transform transition-all duration-300 hover:-translate-y-1"
            variant="elegant"
          >
            <Card.Body className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
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
              <p className="text-primary-dark font-semibold text-lg">
                {invitationInfo.event.date}
              </p>
              <p className="text-muted mt-1">à {invitationInfo.event.time}</p>
              <div className="mt-4 bg-primary/5 rounded-lg p-3">
                <p className="text-sm text-primary-dark font-medium">
                  Arrivée des invités à partir de 13h30
                </p>
              </div>
            </Card.Body>
          </Card>

          {/* Carte Lieu */}
          <Card
            className="transform transition-all duration-300 hover:-translate-y-1"
            variant="elegant"
          >
            <Card.Body className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
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
              <p className="text-primary-dark font-semibold text-lg">
                {invitationInfo.event.venue}
              </p>
              <p className="text-muted mt-1">{invitationInfo.event.address}</p>
              <p className="text-sm text-muted mt-1">
                {invitationInfo.event.location}, {invitationInfo.event.city}
              </p>
              <div className="mt-4 bg-primary/5 rounded-lg p-3">
                <p className="text-sm text-primary-dark">
                  <span className="font-medium">Référence :</span>{" "}
                  {invitationInfo.event.reference}
                </p>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Texte supplémentaire */}
        <div className="text-center mt-10 max-w-xl mx-auto">
          <div className="p-5 rounded-xl bg-secondary shadow-soft">
            <p className="text-primary-dark font-elegant text-lg italic">
              {invitationInfo.welcomeMessage}
            </p>
          </div>

          {/* Dress code */}
          <div className="mt-8">
            <h4 className="font-sans uppercase tracking-wider text-sm text-primary mb-2">
              Dress Code
            </h4>
            <p className="text-muted text-base">{invitationInfo.dressCode}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

DetailSection.propTypes = {
  className: PropTypes.string,
}

export default DetailSection
