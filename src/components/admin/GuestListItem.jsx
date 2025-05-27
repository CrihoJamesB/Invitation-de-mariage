import { useState } from "react"
import PropTypes from "prop-types"
import { generateGuestId } from "../../data/guests"
import { invitationInfo } from "../../data/invitationInfo"
import Button from "../common/Button"
import QRCode from "../common/QRCode"
import Card from "../common/Card"
import { formatTimestamp } from "../../utils/dateUtils"

/**
 * Composant affichant un invité dans la liste d'administration
 * avec options pour générer et partager son QR code
 *
 * @param {Object} guest - Informations sur l'invité
 * @param {string} group - Groupe auquel appartient l'invité
 * @param {Function} onShare - Fonction appelée pour partager l'invitation
 * @param {Function} onEdit - Fonction appelée pour éditer l'invité
 * @param {Function} onDelete - Fonction appelée pour supprimer l'invité
 * @param {string} baseUrl - URL de base pour la génération du lien d'invitation
 */
const GuestListItem = ({
  guest,
  group,
  onShare = () => {},
  onEdit = () => {},
  onDelete = () => {},
  baseUrl = window.location.origin,
}) => {
  const [showQR, setShowQR] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // Génération de l'ID unique et de l'URL d'invitation
  const guestId = generateGuestId(group, guest.name)
  const invitationUrl = `${baseUrl}/invitation/${guestId}`

  // Récupérer la couleur de la table associée au groupe (table) de l'invité
  const getTableColor = () => {
    if (!group) return "#8B5D33" // Couleur par défaut

    const table = invitationInfo.tables.find(
      (table) => table.name.toLowerCase() === group.toLowerCase()
    )

    return table ? table.color : "#8B5D33" // Couleur de la table ou couleur par défaut
  }

  // Couleur associée à la table de l'invité
  const tableColor = getTableColor()

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

  // Déterminer si l'invité a été scanné
  const hasBeenScanned = guest.scanned || false
  const scanCount = guest.scanCount || 0
  const lastScan = guest.lastScan ? formatTimestamp(guest.lastScan) : null

  return (
    <Card
      variant="elegant"
      className="overflow-visible w-full transition-all duration-300 hover:shadow-lg"
    >
      <Card.Body className="p-3 sm:p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 md:gap-4">
          {/* Informations de l'invité */}
          <div className="flex-grow w-full lg:w-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-elegant text-lg text-primary-dark break-words flex flex-wrap items-center">
                <span className="mr-2">{guest.name}</span>
                {hasBeenScanned && (
                  <span
                    className="mt-1 sm:mt-0 text-xs font-normal px-2 py-1 rounded-full text-white whitespace-nowrap"
                    style={{ backgroundColor: tableColor }}
                  >
                    Scanné {scanCount > 1 ? `${scanCount} fois` : ""}
                  </span>
                )}
              </h3>

              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-light/20 text-primary-dark sm:hidden">
                {guest.count} {guest.count > 1 ? "personnes" : "personne"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="flex items-center text-muted text-sm">
                <span className="mr-1">Table:</span>
                <span
                  className="px-2 py-0.5 rounded-full text-white font-medium text-xs"
                  style={{ backgroundColor: tableColor }}
                >
                  {group}
                </span>
              </span>

              <span className="hidden sm:inline mx-2 text-primary/20">•</span>

              <span className="text-muted text-sm hidden sm:inline">
                {guest.count > 1 ? `${guest.count} personnes` : "1 personne"}
              </span>

              {/* Indicateur de scan */}
              {hasBeenScanned && lastScan && (
                <span className="text-xs bg-success/20 text-success py-0.5 px-2 rounded-full flex items-center ml-0 sm:ml-2 mt-1 sm:mt-0">
                  <svg
                    className="w-3 h-3 mr-1"
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
                  <span className="whitespace-nowrap">
                    Dernier scan: {lastScan}
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 mt-3 lg:mt-0">
            {!showQR ? (
              <Button
                variant="outline"
                size="sm"
                className="flex-grow xs:flex-grow-0"
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
                <span className="truncate">
                  {isGenerating ? "Génération..." : "QR Code"}
                </span>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="flex-grow xs:flex-grow-0"
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
              className="flex-grow xs:flex-grow-0"
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
              <span className="truncate">Partager</span>
            </Button>

            <div className="flex flex-wrap items-center gap-2 w-full xs:w-auto">
              {/* Bouton Modifier */}
              <Button
                variant="outline"
                size="sm"
                className="flex-grow xs:flex-grow-0"
                onClick={() => onEdit(guest)}
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                }
              >
                <span className="truncate">Modifier</span>
              </Button>

              {/* Bouton Supprimer */}
              <Button
                variant="outline"
                size="sm"
                className="text-danger hover:bg-danger/10 flex-grow xs:flex-grow-0"
                onClick={() => {
                  if (
                    window.confirm(
                      `Voulez-vous vraiment supprimer l'invité "${guest.name}" ?`
                    )
                  ) {
                    onDelete(guest)
                  }
                }}
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                }
              >
                <span className="truncate">Supprimer</span>
              </Button>
            </div>
          </div>
        </div>

        {/* QR Code (affiché conditionnellement) */}
        {showQR && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <QRCode
                  id={`qr-${guestId}`}
                  value={invitationUrl}
                  size={160}
                  logoSrc="/src/assets/images/wedding-logo.png"
                  logoSize={40}
                  title={guest.name}
                  tableColor={tableColor}
                  caption={`Table ${group}`}
                />
              </div>

              <div className="flex-grow space-y-4 w-full">
                <div>
                  <h4 className="font-sans text-sm font-medium text-primary-dark">
                    Lien d&apos;invitation
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
    message: PropTypes.string,
    scanned: PropTypes.bool,
    scanCount: PropTypes.number,
    lastScan: PropTypes.object,
  }).isRequired,
  group: PropTypes.string.isRequired,
  onShare: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  baseUrl: PropTypes.string,
}

export default GuestListItem
