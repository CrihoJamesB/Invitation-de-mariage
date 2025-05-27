import React, { useState, useRef } from "react"
import QrScanner from "react-qr-scanner"
import guestService from "../../firebase/guestService"
import Card from "../common/Card"
import Button from "../common/Button"

/**
 * Composant de scanner QR code pour vérifier les invitations
 */
const QRScanner = ({ onScanComplete }) => {
  const [scanning, setScanning] = useState(true)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [guest, setGuest] = useState(null)
  const [loading, setLoading] = useState(false)
  const scannerRef = useRef(null)

  // Gérer le scan d'un QR code
  const handleScan = async (data) => {
    if (data && data.text && !loading) {
      // Arrêter le scan une fois qu'un QR code est détecté
      setScanning(false)
      setLoading(true)

      try {
        // Extraire l'ID de l'invité du QR code
        const guestId = data.text
        setResult(guestId)

        // Rechercher les informations de l'invité
        const guestData = await guestService.getGuestById(guestId)

        if (guestData) {
          setGuest(guestData)

          // Enregistrer ce scan dans la base de données
          await guestService.recordScan(guestId, {
            location: "Entrée",
            userAgent: navigator.userAgent,
            manual: false,
          })

          // Notifier le composant parent du scan réussi
          if (onScanComplete) {
            onScanComplete(guestData)
          }
        } else {
          setError("Invité non trouvé. QR code invalide.")
        }
      } catch (err) {
        console.error("Erreur lors du scan:", err)
        setError("Erreur lors du scan. Veuillez réessayer.")
      } finally {
        setLoading(false)
      }
    }
  }

  // Gérer les erreurs de scan
  const handleError = (err) => {
    console.error("Erreur de scanner:", err)
    setError("Erreur d'accès à la caméra. Vérifiez vos permissions.")
  }

  // Réinitialiser le scanner pour un nouveau scan
  const resetScanner = () => {
    setScanning(true)
    setResult(null)
    setGuest(null)
    setError(null)
  }

  // Configuration du scanner
  const scannerProps = {
    delay: 300,
    constraints: {
      video: {
        facingMode: "environment",
      },
    },
    style: {
      width: "100%",
      height: "auto",
      borderRadius: "0.5rem",
    },
  }

  return (
    <div className="w-full">
      <Card
        variant="elegant"
        className="overflow-hidden"
      >
        <Card.Body className="p-0">
          {scanning ? (
            <div className="relative">
              <QrScanner
                ref={scannerRef}
                onScan={handleScan}
                onError={handleError}
                {...scannerProps}
              />
              <div
                className="absolute inset-0 border-2 border-primary pointer-events-none"
                style={{
                  borderRadius: "0.25rem",
                  boxShadow: "inset 0 0 0 3px rgba(139, 93, 51, 0.5)",
                }}
              ></div>
            </div>
          ) : (
            <div className="p-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-primary">
                    Chargement des informations...
                  </p>
                </div>
              ) : guest ? (
                <div className="space-y-4">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <h3 className="text-xl font-elegant text-primary-dark">
                      {guest.name}
                    </h3>
                    <p className="text-muted">Groupe: {guest.group}</p>
                    <div className="flex items-center mt-2">
                      <span className="mr-2 text-sm">
                        {guest.count} personne(s)
                      </span>
                      <span className="text-sm bg-primary/20 py-1 px-2 rounded-full ml-auto">
                        {guest.scanCount > 0
                          ? `Scannés ${guest.scanCount} fois`
                          : "Premier scan"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-highlight p-3 rounded-lg">
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                          guest.scanned ? "bg-success" : "bg-primary"
                        }`}
                      ></div>
                      <span className="text-sm">
                        {guest.scanned ? "Déjà scannés" : "Première entrée"}
                      </span>
                    </div>
                    <span className="text-xs text-muted">
                      {guest.lastScan
                        ? new Date(guest.lastScan.toDate()).toLocaleString()
                        : "Jamais"}
                    </span>
                  </div>

                  <Button
                    onClick={resetScanner}
                    variant="primary"
                    className="w-full"
                  >
                    Scanner un autre QR code
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  {error ? (
                    <div className="text-danger mb-4">{error}</div>
                  ) : (
                    <div className="text-muted">Aucun résultat</div>
                  )}
                  <Button
                    onClick={resetScanner}
                    variant="primary"
                    className="mt-4"
                  >
                    Réessayer
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      {scanning && (
        <p className="text-center text-sm text-muted mt-4">
          Placez le QR code de l'invitation dans le cadre pour le scanner
        </p>
      )}
    </div>
  )
}

export default QRScanner
