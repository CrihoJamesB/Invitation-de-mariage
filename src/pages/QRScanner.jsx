import { useState, useEffect, useCallback } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"
import guestService from "../firebase/guestService"
import Button from "../components/common/Button"
import Card from "../components/common/Card"
import { invitationInfo } from "../data/invitationInfo"
import { formatTimestamp } from "../utils/dateUtils"

/**
 * Page permettant de scanner les QR codes des invitations
 * Utilise html5-qrcode pour le scan via la caméra
 */
const QRScanner = () => {
  const [isScanning, setIsScanning] = useState(true)
  const [guestInfo, setGuestInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [tableColor, setTableColor] = useState("#4CAF50") // Couleur par défaut

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

      // Déterminer la table et sa couleur
      let tableInfo = null

      // Extraire le nom de la table à partir de l'ID de l'invité
      // Format attendu: table_nom-invite
      const tableName = guestId.split("_")[0]

      // Rechercher la table correspondante dans invitationInfo
      tableInfo = invitationInfo.tables.find(
        (table) => table.name.toLowerCase() === tableName.toLowerCase()
      )

      // Définir la couleur en fonction de la table trouvée
      if (tableInfo) {
        setTableColor(tableInfo.color)
      }

      setGuestInfo({
        ...guestDetails,
        scanHistory,
        lastScanId: result,
        tableName: tableInfo ? tableInfo.name : "Table inconnue",
        tableColor: tableInfo ? tableInfo.color : "#4CAF50",
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
    setTableColor("#4CAF50") // Réinitialiser la couleur par défaut
  }, [])

  return (
    <div className="bg-secondary min-h-screen pb-10">
      {/* En-tête */}
      <header className="bg-primary text-white py-6 sm:py-8 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-elegant text-2xl sm:text-3xl">
                Scanner d&apos;Invitations
              </h1>
              <p className="text-white/70 mt-1 sm:mt-2 text-sm sm:text-base">
                Scannez les QR codes des invitations pour enregistrer les
                arrivées
              </p>
            </div>
            <div className="w-full sm:w-auto">
              <a
                href="/guest-management"
                className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-white text-primary rounded-md shadow hover:bg-primary/10 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Retour à la gestion
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 -mt-4 sm:-mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-6">
          {/* Boîte de scan */}
          <Card
            variant="elegant"
            className="p-3 sm:p-6 lg:col-span-2"
          >
            <div className="text-center mb-3 sm:mb-4">
              <h2 className="font-elegant text-xl sm:text-2xl text-primary-dark mb-1 sm:mb-2">
                {isScanning ? "Scannez un QR code" : "Résultat du scan"}
              </h2>
              <p className="text-muted text-sm">
                {isScanning
                  ? "Placez le QR code devant la caméra"
                  : "Détails de l&apos;invitation scannée"}
              </p>
            </div>

            {isScanning ? (
              <div
                id="qr-reader"
                className="w-full max-w-sm mx-auto h-[280px] sm:h-[320px]"
              ></div>
            ) : (
              <div className="text-center">
                {loading ? (
                  <div className="py-6 sm:py-8">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted">Traitement du QR code...</p>
                  </div>
                ) : error ? (
                  <div className="py-6 sm:py-8">
                    <div
                      className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded relative"
                      role="alert"
                    >
                      <strong className="font-bold">Erreur!</strong>
                      <span className="block sm:inline sm:ml-2">{error}</span>
                    </div>
                    <Button
                      variant="primary"
                      className="mt-5 sm:mt-6 w-full sm:w-auto"
                      onClick={resetScanner}
                    >
                      Réessayer
                    </Button>
                  </div>
                ) : guestInfo ? (
                  <div className="py-3 sm:py-4">
                    {/* Carte de résultat avec la couleur de la table */}
                    <div
                      className="border rounded mb-4 sm:mb-6 shadow-md overflow-hidden"
                      style={{
                        backgroundColor: `${guestInfo.tableColor}10`,
                        borderColor: guestInfo.tableColor,
                      }}
                    >
                      <div className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                          <div className="text-center sm:text-left">
                            <span className="text-lg sm:text-xl font-semibold block mb-1">
                              {guestInfo.name}
                            </span>
                            <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3 justify-center sm:justify-start">
                              <span className="text-sm">
                                <span className="font-medium">Table:</span>{" "}
                                {guestInfo.tableName}
                              </span>
                              <span className="hidden xs:inline text-primary/20">
                                •
                              </span>
                              <span className="text-sm">
                                <span className="font-medium">Groupe:</span>{" "}
                                {guestInfo.group}
                              </span>
                            </div>
                            <span className="block mt-1 text-sm">
                              {guestInfo.count > 1
                                ? `${guestInfo.count} personnes`
                                : "1 personne"}
                            </span>
                          </div>
                          <div
                            className="text-center sm:text-right px-3 sm:px-4 py-2 sm:py-3 rounded-full mx-auto sm:mx-0"
                            style={{
                              backgroundColor: `${guestInfo.tableColor}30`,
                            }}
                          >
                            <span className="block font-bold text-xl sm:text-2xl">
                              {guestInfo.scanCount || 1}
                            </span>
                            <span className="text-xs sm:text-sm">
                              {guestInfo.scanCount > 1 ? "scans" : "scan"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {guestInfo.scanHistory &&
                      guestInfo.scanHistory.length > 0 && (
                        <div className="mb-4 sm:mb-6">
                          <h3 className="font-semibold text-base sm:text-lg text-primary-dark mb-2 sm:mb-3">
                            Historique des scans
                          </h3>
                          <div className="bg-white rounded-lg shadow overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                  </th>
                                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Heure
                                  </th>
                                  <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Scanné par
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {guestInfo.scanHistory.map((scan, index) => {
                                  // Extraire la date du timestamp
                                  let dateObj = null
                                  if (scan.timestamp && scan.timestamp.toDate) {
                                    dateObj = scan.timestamp.toDate()
                                  }

                                  // Formater la date (juste la date)
                                  const formattedDate = dateObj
                                    ? new Intl.DateTimeFormat("fr-FR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                      }).format(dateObj)
                                    : "N/A"

                                  // Formater l'heure (juste l'heure)
                                  const formattedTime = dateObj
                                    ? new Intl.DateTimeFormat("fr-FR", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                      }).format(dateObj)
                                    : "N/A"

                                  return (
                                    <tr
                                      key={scan.id || index}
                                      className={
                                        scan.id === guestInfo.lastScanId
                                          ? "bg-opacity-20"
                                          : ""
                                      }
                                      style={
                                        scan.id === guestInfo.lastScanId
                                          ? {
                                              backgroundColor: `${guestInfo.tableColor}20`,
                                            }
                                          : {}
                                      }
                                    >
                                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                                        {formattedDate}
                                      </td>
                                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                                        {formattedTime}
                                      </td>
                                      <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                                        {scan.scannedBy || "Admin"}
                                      </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                    <Button
                      variant="primary"
                      className="mt-3 sm:mt-4 w-full sm:w-auto"
                      onClick={resetScanner}
                      style={{
                        backgroundColor: guestInfo.tableColor,
                        borderColor: guestInfo.tableColor,
                      }}
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
                  <div className="py-6 sm:py-8">
                    <p className="text-muted">
                      Aucun résultat de scan disponible
                    </p>
                    <Button
                      variant="primary"
                      className="mt-4 w-full sm:w-auto"
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
            className="p-3 sm:p-6"
          >
            <h3 className="font-elegant text-lg sm:text-xl text-primary-dark mb-2 sm:mb-3">
              Comment ça marche?
            </h3>
            <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-muted text-sm sm:text-base">
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

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-primary-dark mb-2">
                Conseils pour un meilleur scan:
              </h4>
              <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-muted text-sm">
                <li>Assurez-vous que l&apos;éclairage est suffisant</li>
                <li>Tenez le QR code stable et droit</li>
                <li>Évitez les reflets sur le QR code</li>
                <li>Placez le QR code à environ 15-20 cm de la caméra</li>
              </ul>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-medium text-primary-dark mb-2">
                Tables et couleurs:
              </h4>
              <div className="grid grid-cols-2 xs:grid-cols-3 gap-2">
                {invitationInfo.tables.slice(0, 9).map((table) => (
                  <div
                    key={table.name}
                    className="p-2 rounded text-center text-white text-xs"
                    style={{ backgroundColor: table.color }}
                  >
                    {table.name}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default QRScanner
