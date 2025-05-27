import { useState, useEffect } from "react"
import { Html5Qrcode } from "html5-qrcode"
import guestService from "../../firebase/guestService"
import Card from "../common/Card"
import Button from "../common/Button"

/**
 * Composant de scanner QR code pour le contrôle d'accès au mariage
 * Permet de scanner les QR codes des invités et d'afficher leurs informations
 */
const QrCodeScanner = () => {
  const [scanning, setScanning] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [guestInfo, setGuestInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [scanHistory, setScanHistory] = useState([])

  // Gestionnaire de succès du scan
  const handleScanSuccess = async (decodedText) => {
    setLoading(true)
    setError(null)
    setScanResult(decodedText)

    try {
      // Récupérer les informations de l'invité depuis Firestore
      const guestId = decodedText
      const guest = await guestService.getGuestById(guestId)

      if (!guest) {
        setError("Invité non trouvé. QR code invalide.")
        setGuestInfo(null)
        setLoading(false)
        return
      }

      setGuestInfo(guest)

      // Enregistrer le scan dans Firestore
      await guestService.recordScan(guestId, {
        timestamp: new Date(),
        location: "Entrée principale",
      })

      // Mettre à jour l'historique des scans
      setScanHistory((prev) => [
        {
          id: guestId,
          name: guest.name,
          group: guest.group,
          timestamp: new Date(),
          count: (guest.scanCount || 0) + 1,
        },
        ...prev,
      ])

      // Jouer un son de succès
      try {
        // Essayer de jouer un son
        const audio = new Audio()
        audio.src =
          "https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3"
        audio.play().catch((e) => console.log("Impossible de jouer le son:", e))
      } catch (error) {
        console.error("Erreur lors de la lecture du son:", error)
      }
    } catch (error) {
      console.error("Erreur lors du traitement du scan:", error)
      setError(`Erreur: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour démarrer le scanner
  const startScanner = () => {
    setScanning(true)
    setError(null)
    setScanResult(null)
    setGuestInfo(null)

    const html5QrCode = new Html5Qrcode("reader")

    html5QrCode
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          handleScanSuccess(decodedText)
          html5QrCode.stop()
          setScanning(false)
        },
        (errorMessage) => {
          // Ignorer les erreurs de scan en cours
          console.log(errorMessage)
        }
      )
      .catch((err) => {
        setError(`Erreur d'initialisation de la caméra: ${err}`)
        setScanning(false)
      })
  }

  // Nettoyer le scanner à la démonture du composant
  useEffect(() => {
    return () => {
      if (scanning) {
        const html5QrCode = new Html5Qrcode("reader")
        html5QrCode
          .stop()
          .catch((err) =>
            console.error("Erreur lors de l'arrêt du scanner:", err)
          )
      }
    }
  }, [scanning])

  return (
    <Card
      variant="default"
      className="w-full"
    >
      <Card.Header>
        <h2 className="text-2xl font-elegant text-primary-dark">
          Scanner QR Code
        </h2>
      </Card.Header>
      <Card.Body className="p-4">
        {/* Zone de scan */}
        <div className="mb-6">
          <div
            id="reader"
            className={`w-full max-w-md h-64 mx-auto rounded bg-gray-100 flex items-center justify-center ${
              scanning ? "border-2 border-primary" : ""
            }`}
          >
            {!scanning && (
              <div className="text-center text-muted">
                <svg
                  className="w-12 h-12 mx-auto mb-2 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <p>Cliquez sur le bouton ci-dessous pour activer le scanner</p>
              </div>
            )}
          </div>

          <div className="mt-4 text-center">
            {!scanning ? (
              <Button
                variant="primary"
                onClick={startScanner}
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Activer la caméra
              </Button>
            ) : (
              <p className="text-sm text-primary">Scan en cours...</p>
            )}
          </div>
        </div>

        {/* Résultats du scan */}
        {loading && (
          <div className="text-center py-4">
            <div
              className="spinner-border text-primary"
              role="status"
            >
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            <p className="font-semibold">Erreur</p>
            <p>{error}</p>
          </div>
        )}

        {guestInfo && (
          <div className="bg-green-50 rounded p-4 mb-4 border-l-4 border-green-500">
            <div className="flex items-start">
              <div className="mr-4">
                <svg
                  className="w-10 h-10 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800">
                  {guestInfo.name}
                </h3>
                <p className="text-green-700">Groupe: {guestInfo.group}</p>
                <p className="text-green-700">
                  Nombre de personnes: {guestInfo.count}
                </p>
                <p className="text-green-700">
                  Statut:{" "}
                  {guestInfo.scanned ? (
                    <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs">
                      Déjà scanné ({guestInfo.scanCount || 1} fois)
                    </span>
                  ) : (
                    <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">
                      Premier scan
                    </span>
                  )}
                </p>
                {guestInfo.message && (
                  <p className="mt-2 text-sm italic text-gray-600">
                    {guestInfo.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Historique des scans */}
        {scanHistory.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">
              Historique des scans récents
            </h3>
            <div className="overflow-auto max-h-64">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invité
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Groupe
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Heure
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scans
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {scanHistory.map((scan, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-2 text-sm">{scan.name}</td>
                      <td className="px-4 py-2 text-sm">{scan.group}</td>
                      <td className="px-4 py-2 text-sm">
                        {scan.timestamp.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {scan.count}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}

export default QrCodeScanner
