import React, { useState } from "react"
import PropTypes from "prop-types"
import { generateGuestId } from "../../data/guests"
import Button from "../common/Button"
import QRCode from "../common/QRCode"
import Card from "../common/Card"

/**
 * Composant affichant un invité dans la liste d'administration
 * avec options pour générer et partager son QR code
 *
 * @param {Object} guest - Informations sur l'invité
 * @param {string} group - Groupe auquel appartient l'invité
 * @param {Function} onShare - Fonction appelée pour partager l'invitation
 * @param {string} baseUrl - URL de base pour la génération du lien d'invitation
 */
const GuestListItem = ({
  guest,
  group,
  onShare = () => {},
  baseUrl = window.location.origin,
}) => {
  const [showQR, setShowQR] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // Génération de l'ID unique et de l'URL d'invitation
  const guestId = generateGuestId(group, guest.name)
  const invitationUrl = `${baseUrl}/invitation/${guestId}`

  // Construit l'URL de partage WhatsApp
  const getWhatsAppShareUrl = () => {
    const message = encodeURIComponent(
      `Invitation pour *${guest.name}* au mariage de Fiston Zaka et Vino Banza.\nVoici votre invitation personnalisée: ${invitationUrl}`
    )
    return `https://wa.me/?text=${message}`
  }

  // Simule la génération du QR code (dans une vraie application, cela pourrait impliquer une API)
  const handleGenerate = () => {
    setIsGenerating(true)
    // Simuler un délai de génération
    setTimeout(() => {
      setIsGenerating(false)
      setShowQR(true)
    }, 800)
  }

  // Partage sur WhatsApp
  const handleShare = () => {
    window.open(getWhatsAppShareUrl(), "_blank")
    onShare(guest, group)
  }

  // Télécharger le QR code en tant qu'image
  const handleDownload = () => {
    const canvas = document.getElementById(`qr-${guestId}`)
    if (canvas) {
      const link = document.createElement("a")
      link.download = `invitation-${guest.name.replace(/\s+/g, "-")}.png`
      link.href = canvas.toDataURL("image/png")
      link.click()
    }
  }

  return (
    <Card
      variant="elegant"
      className="overflow-visible"
    >
      <Card.Body>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Informations de l'invité */}
          <div>
            <h3 className="font-elegant text-lg text-primary-dark">
              {guest.name}
            </h3>
            <div className="flex items-center mt-1">
              <span className="text-muted text-sm">Groupe: {group}</span>
              <span className="mx-2 text-primary/20">•</span>
              <span className="text-muted text-sm">
                {guest.count > 1 ? `${guest.count} personnes` : "1 personne"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {!showQR ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerate}
                disabled={isGenerating}
                icon={
                  isGenerating ? (
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      ></path>
                    </svg>
                  )
                }
              >
                {isGenerating ? "Génération..." : "Générer QR Code"}
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQR(false)}
                icon={
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                }
              >
                Masquer
              </Button>
            )}

            <Button
              variant="primary"
              size="sm"
              onClick={handleShare}
              icon={
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.151-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345"></path>
                </svg>
              }
            >
              Partager
            </Button>
          </div>
        </div>

        {/* QR Code (affiché conditionnellement) */}
        {showQR && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <QRCode
                  id={`qr-${guestId}`}
                  value={invitationUrl}
                  size={160}
                  logoSrc="/src/assets/images/wedding-logo.png"
                  logoSize={40}
                  title={guest.name}
                />
              </div>

              <div className="flex-grow space-y-4">
                <div>
                  <h4 className="font-sans text-sm font-medium text-primary-dark">
                    Lien d'invitation
                  </h4>
                  <p className="text-xs text-muted break-all mt-1">
                    {invitationUrl}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        ></path>
                      </svg>
                    }
                    onClick={() => {
                      navigator.clipboard.writeText(invitationUrl)
                      // Dans une vraie application, ajouter une notification
                    }}
                  >
                    Copier le lien
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    icon={
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        ></path>
                      </svg>
                    }
                    onClick={handleDownload}
                  >
                    Télécharger QR
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

GuestListItem.propTypes = {
  guest: PropTypes.shape({
    name: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
  }).isRequired,
  group: PropTypes.string.isRequired,
  onShare: PropTypes.func,
  baseUrl: PropTypes.string,
}

export default GuestListItem
