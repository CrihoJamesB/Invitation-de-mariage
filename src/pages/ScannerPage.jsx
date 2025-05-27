import React, { useState, useEffect } from "react"
import QRScanner from "../components/scanner/QRScanner"
import Card from "../components/common/Card"
import Button from "../components/common/Button"
import guestService from "../firebase/guestService"

/**
 * Page pour scanner les QR codes à l'entrée du mariage
 * Affiche les statistiques des entrées et permet de scanner les invitations
 */
const ScannerPage = () => {
  const [stats, setStats] = useState({
    totalScanned: 0,
    totalGuests: 0,
    recentScans: [],
  })
  const [loading, setLoading] = useState(true)
  const [manualEntry, setManualEntry] = useState(false)
  const [manualSearchTerm, setManualSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])

  // Charger les statistiques au chargement de la page
  useEffect(() => {
    const loadStats = async () => {
      try {
        // Récupérer les données des invités
        const guests = await guestService.getAllGuests()
        const scans = await guestService.getAllScans()

        // Calculer les statistiques
        const scannedGuests = guests.filter((guest) => guest.scanned)
        const totalPersons = guests.reduce(
          (total, guest) => total + guest.count,
          0
        )

        // Trier les scans par date (les plus récents en premier)
        const sortedScans = [...scans].sort((a, b) => {
          return b.timestamp?.toDate() - a.timestamp?.toDate()
        })

        // Mettre à jour les statistiques
        setStats({
          totalScanned: scannedGuests.length,
          totalGuests: guests.length,
          totalPersons,
          scannedPersons: scannedGuests.reduce(
            (total, guest) => total + guest.count,
            0
          ),
          recentScans: sortedScans.slice(0, 5),
        })
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()

    // Actualiser les statistiques toutes les 30 secondes
    const interval = setInterval(loadStats, 30000)
    return () => clearInterval(interval)
  }, [])

  // Gérer un scan réussi
  const handleScanComplete = (guest) => {
    // Mettre à jour les statistiques locales
    setStats((prev) => ({
      ...prev,
      totalScanned: prev.totalScanned + (guest.scanned ? 0 : 1),
      recentScans: [
        {
          guestId: guest.id,
          timestamp: new Date(),
          guest,
        },
        ...prev.recentScans,
      ].slice(0, 5),
    }))
  }

  // Rechercher un invité manuellement
  const handleManualSearch = async () => {
    if (manualSearchTerm.trim().length < 2) return

    setLoading(true)
    try {
      const allGuests = await guestService.getAllGuests()
      const results = allGuests.filter(
        (guest) =>
          guest.name.toLowerCase().includes(manualSearchTerm.toLowerCase()) ||
          guest.group.toLowerCase().includes(manualSearchTerm.toLowerCase())
      )

      setSearchResults(results)
    } catch (error) {
      console.error("Erreur lors de la recherche:", error)
    } finally {
      setLoading(false)
    }
  }

  // Enregistrer manuellement un scan
  const handleManualScan = async (guest) => {
    try {
      await guestService.recordScan(guest.id, {
        location: "Entrée",
        manual: true,
        userAgent: navigator.userAgent,
      })

      // Mettre à jour les résultats de recherche
      setSearchResults((prev) =>
        prev.map((g) =>
          g.id === guest.id
            ? { ...g, scanned: true, scanCount: (g.scanCount || 0) + 1 }
            : g
        )
      )

      // Mettre à jour les statistiques
      handleScanComplete(guest)
    } catch (error) {
      console.error("Erreur lors de l'enregistrement manuel:", error)
    }
  }

  return (
    <div className="bg-secondary min-h-screen pb-10">
      {/* En-tête */}
      <header className="bg-primary text-white py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-elegant text-3xl">Scanner d'entrée</h1>
          <p className="text-white/70 mt-2">
            Scannez les invitations à l'entrée du mariage
          </p>
        </div>
      </header>

      {/* Tableaux de statistiques */}
      <div className="max-w-4xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            title="Invités scannés"
            value={stats.totalScanned || 0}
            total={stats.totalGuests || 0}
            icon={
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                ></path>
              </svg>
            }
          />

          <StatCard
            title="Personnes présentes"
            value={stats.scannedPersons || 0}
            total={stats.totalPersons || 0}
            icon={
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            }
          />
        </div>
      </div>

      {/* Section principale avec scanner */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Scanner ou recherche manuelle */}
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-elegant text-2xl text-primary-dark">
                {manualEntry ? "Entrée manuelle" : "Scanner QR Code"}
              </h2>
              <Button
                variant="outline"
                onClick={() => setManualEntry(!manualEntry)}
                className="text-sm"
              >
                {manualEntry ? "Utiliser le scanner" : "Entrée manuelle"}
              </Button>
            </div>

            {manualEntry ? (
              <Card
                variant="default"
                className="p-4"
              >
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      className="block w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary bg-white text-primary-dark"
                      placeholder="Rechercher un invité..."
                      value={manualSearchTerm}
                      onChange={(e) => setManualSearchTerm(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleManualSearch()
                      }
                    />
                    <Button
                      variant="primary"
                      onClick={handleManualSearch}
                      disabled={loading}
                    >
                      Rechercher
                    </Button>
                  </div>

                  {/* Résultats de recherche */}
                  <div className="mt-4 space-y-2">
                    {searchResults.length > 0 ? (
                      searchResults.map((guest) => (
                        <div
                          key={guest.id}
                          className="border border-gray-200 rounded-lg p-3 flex justify-between items-center bg-white"
                        >
                          <div>
                            <h3 className="font-medium text-primary-dark">
                              {guest.name}
                            </h3>
                            <div className="text-sm text-muted">
                              <span>{guest.group}</span>
                              <span className="mx-2">•</span>
                              <span>{guest.count} personne(s)</span>
                            </div>
                          </div>
                          <Button
                            variant={guest.scanned ? "outline" : "primary"}
                            onClick={() => handleManualScan(guest)}
                            className="text-sm"
                            disabled={loading}
                          >
                            {guest.scanned
                              ? `Rescan (${guest.scanCount})`
                              : "Enregistrer"}
                          </Button>
                        </div>
                      ))
                    ) : manualSearchTerm && !loading ? (
                      <div className="text-center py-4 text-muted">
                        Aucun invité trouvé
                      </div>
                    ) : null}
                  </div>
                </div>
              </Card>
            ) : (
              <QRScanner onScanComplete={handleScanComplete} />
            )}
          </div>

          {/* Historique des scans récents */}
          <div>
            <h2 className="font-elegant text-2xl text-primary-dark mb-4">
              Derniers scans
            </h2>
            <Card
              variant="default"
              className="p-4"
            >
              {stats.recentScans && stats.recentScans.length > 0 ? (
                <ul className="divide-y divide-gray-100">
                  {stats.recentScans.map((scan, index) => {
                    // Obtenez des données d'invité plus riches si disponibles
                    const guestName = scan.guest?.name || scan.guestId
                    const guestGroup = scan.guest?.group || ""
                    const timestamp =
                      scan.timestamp instanceof Date
                        ? scan.timestamp
                        : scan.timestamp?.toDate
                        ? scan.timestamp.toDate()
                        : new Date()

                    return (
                      <li
                        key={index}
                        className="py-3"
                      >
                        <div className="flex items-start">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <svg
                              className="w-4 h-4 text-primary"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                              ></path>
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-primary-dark">
                              {guestName}
                            </p>
                            <p className="text-sm text-muted">{guestGroup}</p>
                            <p className="text-xs text-muted mt-1">
                              {timestamp.toLocaleTimeString()}
                              <span className="ml-1">
                                {scan.manual ? "(Manuel)" : ""}
                              </span>
                            </p>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className="text-center py-8 text-muted">
                  <svg
                    className="w-10 h-10 mx-auto mb-2 text-muted/50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    ></path>
                  </svg>
                  <p>Aucun scan récent</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Composant interne pour afficher une statistique
 */
const StatCard = ({ title, value, total, icon }) => {
  const percentage = total ? Math.round((value / total) * 100) : 0

  return (
    <Card
      variant="elegant"
      className="transform hover:-translate-y-1 transition-transform duration-300"
    >
      <Card.Body className="p-5">
        <div className="flex items-center">
          <div className="mr-4 bg-primary/10 p-3 rounded-full">{icon}</div>
          <div>
            <h3 className="text-lg font-medium text-primary-dark">{title}</h3>
            <div className="flex items-end">
              <p className="text-2xl font-semibold text-primary-dark">
                {value}{" "}
                <span className="text-sm font-normal text-muted">
                  / {total}
                </span>
              </p>
              <span className="ml-2 text-sm text-primary/80 mb-1">
                ({percentage}%)
              </span>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}

export default ScannerPage
