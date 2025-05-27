import { useState, useEffect, useCallback } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import guestService from "../firebase/guestService"
import Button from "../components/common/Button"
import Card from "../components/common/Card"

/**
 * Page permettant de scanner les QR codes des invitations
 * Utilise html5-qrcode pour le scan via la caméra
 */
const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(true)
  const [guestInfo, setGuestInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const processQrCode = useCallback(async (decodedText) => {
    try {
      setLoading(true)
      setError("")

      // Extraire l'ID de l'invité du QR code (format attendu: URL avec ?id=XXX ou /invitation/ID)
      let guestId = null

      // Vérifier si c'est une URL avec un paramètre id
      if (decodedText.includes("?id=")) {
        const url = new URL(decodedText)
        guestId = url.searchParams.get("id")
      } else if (decodedText.includes("/invitation/")) {
        // Format URL: http://domaine/invitation/ID
        const urlParts = decodedText.split("/invitation/")
        if (urlParts.length > 1) {
          // Prendre la dernière partie après /invitation/
          guestId = urlParts[1].split("?")[0] // Enlever les paramètres d'URL s'il y en a
        }
      } else {
        // Si c'est juste l'ID directement
        guestId = decodedText
      }

      if (!guestId) {
        throw new Error("Format de QR code invalide. Aucun ID trouvé.")
      }

      // Enregistrer le scan dans Firebase et récupérer les infos de l'invité
      const result = await guestService.recordScan(guestId, {
        scannedBy: "admin",
        deviceInfo: navigator.userAgent,
      })

      // Récupérer les détails de l'invité pour affichage
      const guestDetails = await guestService.getGuestById(guestId)

      if (!guestDetails) {
        throw new Error("Invité non trouvé avec cet ID: " + guestId)
      }

      // Récupérer l'historique des scans pour cet invité
      const scanHistory = await guestService.getGuestScans(guestId)

      setGuestInfo({
        ...guestDetails,
        scanHistory,
        lastScanId: result,
      })
    } catch (error) {
      console.error("Erreur lors du traitement du QR code:", error)
      setError(error.message || "Erreur lors du traitement du QR code")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let scanner = null

    if (isScanning) {
      // Configuration optimisée du scanner
      const config = {
        fps: 5, // Réduire le nombre d'images par seconde pour économiser les ressources
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        aspectRatio: 1.0, // Pour améliorer les performances sur mobile
        disableFlip: true, // Désactiver le flip pour améliorer les performances
        formatsToSupport: [0], // Format QR code uniquement (0 = QR_CODE)
      }

      // Initialiser le scanner de QR code
      scanner = new Html5QrcodeScanner(
        "qr-reader",
        config,
        /* verbose= */ false
      )

      // Fonction appelée en cas de succès de scan
      const onScanSuccess = async (decodedText) => {
        // Arrêter le scanner après un succès
        if (scanner) {
          scanner.clear()
          scanner = null
        }
        setIsScanning(false)
        await processQrCode(decodedText)
      }

      // Fonction en cas d'erreur de scan
      const onScanFailure = () => {
        // Ne rien faire - continuer à scanner
        // Ne pas logger les erreurs pour améliorer les performances
      }

      // Démarrer le scanner
      scanner.render(onScanSuccess, onScanFailure)
    }

    // Nettoyer le scanner lors du démontage du composant
    return () => {
      if (scanner) {
        scanner.clear()
        scanner = null
      }
    }
  }, [isScanning, processQrCode])

  // Réinitialiser le scanner pour un nouveau scan
  const resetScanner = useCallback(() => {
    setGuestInfo(null)
    setError("")
    setIsScanning(true)
  }, [])

  // Formatter la date pour un affichage plus lisible
  const formatDate = useCallback((timestamp) => {
    if (!timestamp) return "N/A"

    // Si c'est un timestamp Firebase
    if (timestamp.toDate && typeof timestamp.toDate === "function") {
      const date = timestamp.toDate()
      return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(date)
    }

    // Si c'est déjà une date JavaScript
    if (timestamp instanceof Date) {
      return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(timestamp)
    }

    return "Format de date inconnu"
  }, [])

  return (
    <div className="bg-secondary min-h-screen pb-10">
      {/* En-tête */}
      <header className="bg-primary text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-elegant text-3xl">Scanner d&apos;Invitations</h1>
          <p className="text-white/70 mt-2">
            Scannez les QR codes des invitations pour enregistrer les arrivées
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Boîte de scan */}
          <Card
            variant="elegant"
            className="p-6"
          >
            <div className="text-center mb-4">
              <h2 className="font-elegant text-2xl text-primary-dark mb-2">
                {isScanning ? "Scannez un QR code" : "Résultat du scan"}
              </h2>
              <p className="text-muted">
                {isScanning
                  ? "Placez le QR code devant la caméra"
                  : "Détails de l&apos;invitation scannée"}
              </p>
            </div>

            {isScanning ? (
              <div
                id="qr-reader"
                className="w-full max-w-md mx-auto"
              ></div>
            ) : (
              <div className="text-center">
                {loading ? (
                  <div className="py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted">Traitement du QR code...</p>
                  </div>
                ) : error ? (
                  <div className="py-8">
                    <div
                      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                      role="alert"
                    >
                      <strong className="font-bold">Erreur!</strong>
                      <span className="block sm:inline"> {error}</span>
                    </div>
                    <Button
                      variant="primary"
                      className="mt-6"
                      onClick={resetScanner}
                    >
                      Réessayer
                    </Button>
                  </div>
                ) : guestInfo ? (
                  <div className="py-4">
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-xl font-semibold block">
                            {guestInfo.name}
                          </span>
                          <span className="block">
                            Groupe: {guestInfo.group}
                          </span>
                          <span className="block mt-1">
                            {guestInfo.count > 1
                              ? `${guestInfo.count} personnes`
                              : "1 personne"}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="block font-bold text-2xl">
                            {guestInfo.scanCount || 1}
                          </span>
                          <span className="text-sm">
                            {guestInfo.scanCount > 1 ? "scans" : "scan"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {guestInfo.scanHistory &&
                      guestInfo.scanHistory.length > 0 && (
                        <div className="mb-6">
                          <h3 className="font-semibold text-lg text-primary-dark mb-3">
                            Historique des scans
                          </h3>
                          <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date et heure
                                  </th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Scanné par
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {guestInfo.scanHistory.map((scan, index) => (
                                  <tr
                                    key={scan.id || index}
                                    className={
                                      scan.id === guestInfo.lastScanId
                                        ? "bg-green-50"
                                        : ""
                                    }
                                  >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {formatDate(scan.timestamp)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {scan.scannedBy || "Admin"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                    <Button
                      variant="primary"
                      className="mt-4"
                      onClick={resetScanner}
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
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                      Scanner un autre QR code
                    </Button>
                  </div>
                ) : (
                  <div className="py-8">
                    <p className="text-muted">
                      Aucun résultat de scan disponible
                    </p>
                    <Button
                      variant="primary"
                      className="mt-4"
                      onClick={resetScanner}
                    >
                      Réessayer
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Instructions */}
          <Card
            variant="flat"
            className="p-6"
          >
            <h3 className="font-elegant text-xl text-primary-dark mb-3">
              Comment ça marche?
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-muted">
              <li>
                Autorisez l&apos;accès à la caméra lorsque le navigateur vous le
                demande
              </li>
              <li>
                Présentez le QR code de l&apos;invitation face à la caméra
              </li>
              <li>
                Le système détectera automatiquement le code et affichera les
                informations
              </li>
              <li>
                Chaque scan est enregistré dans la base de données avec
                horodatage
              </li>
              <li>
                Si un invité présente plusieurs fois son QR code, tous les scans
                seront enregistrés
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default QRScanner
