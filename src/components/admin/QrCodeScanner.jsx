import { useState, useEffect, useRef, useCallback } from "react"
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
  const [guestInfo, setGuestInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [scanHistory, setScanHistory] = useState([])
  const [cameras, setCameras] = useState([])
  const [selectedCamera, setSelectedCamera] = useState("")
  const html5QrCodeRef = useRef(null)
  const scannerContainerRef = useRef(null)

  // Récupérer la liste des caméras disponibles
  const fetchCameras = useCallback(async () => {
    try {
      const devices = await Html5Qrcode.getCameras()
      if (devices && devices.length) {
        setCameras(devices)
        setSelectedCamera(devices[0].id)
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des caméras:", err)
    }
  }, [])

  // Charger les caméras au démarrage
  useEffect(() => {
    fetchCameras()
  }, [fetchCameras])

  // Gestionnaire de succès du scan
  const handleScanSuccess = useCallback(async (decodedText) => {
    setLoading(true)
    setError(null)

    try {
      // Récupérer les informations de l'invité depuis Firestore
      const guestId = decodedText
      console.log("QR Code scanné avec succès:", guestId)
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
  }, [])

  // Fonction pour arrêter le scanner en toute sécurité
  const stopScanner = useCallback(async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop()
        html5QrCodeRef.current = null
      } catch (err) {
        console.error("Erreur lors de l'arrêt du scanner:", err)
      }
    }
    setScanning(false)
  }, [])

  // Fonction pour démarrer le scanner
  const startScanner = useCallback(async () => {
    try {
      setScanning(true)
      setError(null)
      setGuestInfo(null)

      // Nettoyer toute instance précédente
      await stopScanner()

      // Vérifier si le conteneur existe et a des dimensions
      if (!scannerContainerRef.current) {
        setError("Conteneur du scanner non trouvé.")
        setScanning(false)
        return
      }

      // S'assurer que le conteneur a des dimensions avant de continuer
      const containerWidth = scannerContainerRef.current.offsetWidth
      const containerHeight = scannerContainerRef.current.offsetHeight

      if (containerWidth < 100 || containerHeight < 100) {
        setError(
          `Dimensions du conteneur trop petites: ${containerWidth}x${containerHeight}px`
        )
        setScanning(false)
        return
      }

      console.log(
        `Dimensions du scanner: ${containerWidth}x${containerHeight}px`
      )

      // Créer une nouvelle instance du scanner
      html5QrCodeRef.current = new Html5Qrcode("reader", {
        verbose: false,
        formatsToSupport: ["QR_CODE"],
      })

      const config = {
        fps: 10,
        qrbox: {
          width: Math.min(200, containerWidth - 50),
          height: Math.min(200, containerHeight - 50),
        },
        aspectRatio: 1.0,
        disableFlip: false,
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true,
        },
      }

      console.log("Configuration du scanner:", config)
      console.log("Caméra sélectionnée:", selectedCamera)

      // Utiliser la caméra sélectionnée ou la caméra par défaut
      const cameraId = selectedCamera || true

      await html5QrCodeRef.current.start(
        cameraId,
        config,
        (decodedText) => {
          console.log("Code QR détecté:", decodedText)
          if (html5QrCodeRef.current) {
            html5QrCodeRef.current
              .stop()
              .then(() => {
                handleScanSuccess(decodedText)
              })
              .catch((err) => {
                console.error("Erreur lors de l'arrêt du scanner:", err)
              })
              .finally(() => {
                setScanning(false)
              })
          }
        },
        (errorMessage) => {
          // Ignorer les erreurs de scan en cours qui sont normales
          if (
            !errorMessage.includes("No MultiFormat Readers were able to detect")
          ) {
            console.log("Erreur de scan:", errorMessage)
          }
        }
      )
    } catch (error) {
      console.error("Erreur d'initialisation:", error)
      setError(`Erreur lors de la préparation du scanner: ${error.message}`)
      setScanning(false)
    }
  }, [handleScanSuccess, selectedCamera, stopScanner])

  // Nettoyer le scanner à la démonture du composant
  useEffect(() => {
    return () => {
      stopScanner()
    }
  }, [stopScanner])

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
        {/* Sélection de la caméra */}
        {cameras.length > 1 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-primary-dark mb-1">
              Sélectionner une caméra:
            </label>
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary bg-white text-primary-dark"
              disabled={scanning}
            >
              {cameras.map((camera) => (
                <option
                  key={camera.id}
                  value={camera.id}
                >
                  {camera.label || `Caméra ${camera.id.slice(0, 5)}...`}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Zone de scan */}
        <div className="mb-6">
          <div
            id="reader"
            ref={scannerContainerRef}
            style={{
              width: "100%",
              minHeight: "256px",
              height: "256px",
              position: "relative",
              overflow: "hidden",
            }}
            className={`max-w-md mx-auto rounded bg-gray-100 flex items-center justify-center ${
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
              <div className="flex flex-col items-center">
                <p className="text-sm text-primary mb-2">Scan en cours...</p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={stopScanner}
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Arrêter
                </Button>
              </div>
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
