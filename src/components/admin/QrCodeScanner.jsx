import { useState, useEffect, useRef } from "react"
import { Html5Qrcode } from "html5-qrcode"
import guestService from "../../firebase/guestService"
import Card from "../common/Card"
import Button from "../common/Button"
import { useError } from "../../App"

/**
 * Composant de scanner QR code pour le contrôle d'accès au mariage
 * Version simplifiée pour éviter les problèmes de DOM
 */
const QrCodeScanner = () => {
  const [scanning, setScanning] = useState(false)
  const [guestInfo, setGuestInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [scanHistory, setScanHistory] = useState([])
  const scannerRef = useRef(null)
  const html5QrCodeRef = useRef(null)

  // Utiliser le contexte global d'erreur
  const { setError: setGlobalError } = useError()

  // Nettoyer le scanner lorsqu'on quitte le composant
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && scanning) {
        try {
          html5QrCodeRef.current.stop().catch((err) => {
            console.warn("Nettoyage du scanner:", err)
          })
        } catch (error) {
          console.warn("Erreur lors du nettoyage du scanner:", error)
        }
      }
    }
  }, [scanning])

  // Fonction pour traiter le résultat du scan
  const handleScanSuccess = async (decodedText) => {
    setLoading(true)
    setError(null)

    try {
      console.log("QR Code scanné:", decodedText)
      const guestId = decodedText
      const guest = await guestService.getGuestById(guestId)

      if (!guest) {
        setError("Invité non trouvé. QR code invalide.")
        setGuestInfo(null)
        return
      }

      setGuestInfo(guest)

      // Enregistrer le scan
      await guestService.recordScan(guestId, {
        timestamp: new Date(),
        location: "Entrée principale",
      })

      // Mettre à jour l'historique
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

      // Jouer un son
      try {
        const audio = new Audio()
        audio.src =
          "https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3"
        audio.play().catch((e) => console.warn("Son non joué:", e))
      } catch (e) {
        console.warn("Erreur audio:", e)
      }
    } catch (error) {
      console.error("Erreur scan:", error)
      setError(`Erreur: ${error.message}`)

      // Si l'erreur contient "BLOCKED_BY_CLIENT", c'est probablement un bloqueur de pub
      if (error.message && error.message.includes("BLOCKED_BY_CLIENT")) {
        setGlobalError({
          message: "Demandes bloquées par un bloqueur de publicités",
          details:
            "Votre bloqueur de publicités (comme uBlock Origin, AdBlock, etc.) empêche l'application de fonctionner correctement. Veuillez désactiver votre bloqueur de publicités pour ce site et rafraîchir la page.",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  // Démarrer le scanner
  const startScanner = async () => {
    // Réinitialiser les états
    setError(null)
    setScanning(true)

    try {
      // Vérifier si l'élément existe
      if (!scannerRef.current) {
        setError("Élément scanner non trouvé")
        setScanning(false)
        return
      }

      // Créer une nouvelle instance du scanner
      html5QrCodeRef.current = new Html5Qrcode("reader")

      await html5QrCodeRef.current.start(
        { facingMode: "environment" }, // Utiliser la caméra arrière par défaut
        {
          fps: 10,
          qrbox: 250,
        },
        (decodedText) => {
          // Arrêter le scanner dès qu'un code est trouvé
          html5QrCodeRef.current
            .stop()
            .then(() => {
              setScanning(false)
              handleScanSuccess(decodedText)
            })
            .catch((err) => {
              console.error("Erreur d'arrêt:", err)
              setScanning(false)
            })
        },
        (errorMessage) => {
          // Ignorer les erreurs normales de détection
          if (!errorMessage.includes("MultiFormat")) {
            console.debug(errorMessage)
          }
        }
      )
    } catch (error) {
      console.error("Erreur au démarrage:", error)
      if (error.toString().includes("Permission")) {
        setError("Veuillez autoriser l'accès à votre caméra")
      } else {
        setError(`Erreur: ${error.toString()}`)
      }
      setScanning(false)
    }
  }

  // Arrêter le scanner
  const stopScanner = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current
        .stop()
        .then(() => {
          setScanning(false)
          html5QrCodeRef.current = null
        })
        .catch((err) => {
          console.error("Erreur lors de l'arrêt:", err)
          setScanning(false)
        })
    } else {
      setScanning(false)
    }
  }

  // Tester avec un code simulé
  const testScan = () => {
    const mockGuestId = "famille-danielle_louis-martin"
    handleScanSuccess(mockGuestId)
  }

  // Rafraîchir la page pour essayer de résoudre les problèmes de bloqueur de publicités
  const handleRefresh = () => {
    window.location.reload()
  }

  // Désactiver le bloqueur d'annonces
  const handleDisableAdBlocker = () => {
    setGlobalError({
      message: "Comment désactiver votre bloqueur de publicités",
      details: `
1. Trouvez l'icône du bloqueur de publicités dans votre navigateur (généralement en haut à droite)
2. Cliquez sur l'icône et sélectionnez "Désactiver sur ce site" ou "Mettre en pause"
3. Rechargez la page après avoir désactivé le bloqueur
      `,
    })
  }

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
            ref={scannerRef}
            style={{
              width: "100%",
              height: "300px",
              border: scanning ? "2px solid #4f46e5" : "1px solid #e5e7eb",
              borderRadius: "0.375rem",
              overflow: "hidden",
            }}
            className="max-w-md mx-auto"
          />

          <div className="mt-4 flex justify-center gap-2">
            {!scanning ? (
              <>
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
                  Scanner
                </Button>
                <Button
                  variant="secondary"
                  onClick={testScan}
                >
                  Tester
                </Button>
              </>
            ) : (
              <Button
                variant="secondary"
                onClick={stopScanner}
              >
                Arrêter
              </Button>
            )}
          </div>
        </div>

        {/* États et résultats */}
        {loading && (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-2 text-sm">Chargement...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            <p className="font-semibold">Erreur</p>
            <p>{error}</p>

            {/* Ajouter des options pour résoudre les problèmes courants */}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
              >
                <svg
                  className="w-4 h-4 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Actualiser
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisableAdBlocker}
              >
                <svg
                  className="w-4 h-4 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Problème de bloqueur?
              </Button>
            </div>
          </div>
        )}

        {guestInfo && !loading && (
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
