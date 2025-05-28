import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { invitationInfo } from "../data/invitationInfo"
import Card from "../components/common/Card"
import Button from "../components/common/Button"

/**
 * Page d'affichage des informations d'une table
 * Accessible via le scan du QR code de la table
 */
const TableView = () => {
  const { tableName } = useParams()
  const [table, setTable] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Récupérer les informations de la table
  useEffect(() => {
    setLoading(true)

    try {
      // Rechercher la table correspondante dans les données
      const foundTable = invitationInfo.tables.find(
        (t) => t.name.toLowerCase().replace(/\s+/g, "-") === tableName
      )

      if (foundTable) {
        setTable(foundTable)
      } else {
        setError("Table non trouvée")
      }
    } catch (err) {
      setError("Erreur lors du chargement des données de la table")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [tableName])

  // Afficher un message de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-primary-dark">
            Chargement des informations...
          </p>
        </div>
      </div>
    )
  }

  // Afficher un message d'erreur
  if (error || !table) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
        <Card
          variant="flat"
          className="max-w-md w-full p-6"
        >
          <div className="text-center">
            <div className="bg-danger/10 p-3 rounded-full inline-block mb-4">
              <svg
                className="w-8 h-8 text-danger"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-primary-dark mb-2">
              {error || "Table non trouvée"}
            </h1>
            <p className="text-muted mb-4">
              La table que vous recherchez n'existe pas ou n'est plus
              disponible.
            </p>
            <Link to="/">
              <Button
                variant="primary"
                className="w-full"
              >
                Retourner à l'accueil
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary pb-16">
      {/* En-tête */}
      <header className="bg-primary text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="font-elegant text-3xl sm:text-4xl md:text-5xl"
            style={{ color: table.color }}
          >
            Table {table.name}
          </h1>
          <p className="mt-2 text-white/90">
            {invitationInfo.couple.groom} & {invitationInfo.couple.bride}
          </p>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <Card
          variant="elegant"
          className="p-6 sm:p-8"
        >
          <div className="text-center mb-8">
            <h2 className="font-elegant text-2xl sm:text-3xl text-primary-dark mb-3">
              Bienvenue à votre table
            </h2>
            <p className="text-muted">
              Nous sommes ravis de vous accueillir à notre célébration. Voici
              les personnes qui partageront cette table avec vous.
            </p>
          </div>

          {/* Liste des invités */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-soft">
            <h3 className="font-elegant text-xl text-primary-dark mb-4 flex items-center">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Invités à cette table ({table.count} personnes)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {table.invites.map((invite, index) => (
                <div
                  key={index}
                  className="border border-gray-100 rounded-lg p-4 hover:shadow-soft transition-shadow"
                  style={{ borderLeft: `4px solid ${table.color}` }}
                >
                  <div className="font-medium text-primary-dark">
                    {invite.name}
                  </div>
                  <div className="text-sm text-muted mt-1">
                    {invite.count > 1
                      ? `${invite.count} personnes`
                      : "1 personne"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Informations sur l'événement */}
          <div className="mt-8 p-6 border-t border-gray-100">
            <h3 className="font-elegant text-xl text-primary-dark mb-4">
              Détails de l'événement
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-start mb-4">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary-dark">Date</h4>
                    <p className="text-muted">{invitationInfo.event.date}</p>
                  </div>
                </div>

                <div className="flex items-start mb-4">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary-dark">Heure</h4>
                    <p className="text-muted">{invitationInfo.event.time}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start mb-4">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-primary-dark">Lieu</h4>
                    <p className="text-muted">{invitationInfo.event.venue}</p>
                    <p className="text-muted">{invitationInfo.event.address}</p>
                    <p className="text-muted">
                      {invitationInfo.event.location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bouton pour voir l'invitation complète */}
          <div className="mt-8 text-center">
            <Link to="/">
              <Button
                variant="primary"
                className="px-6"
                style={{
                  backgroundColor: table.color,
                  borderColor: table.color,
                }}
              >
                Voir l'invitation complète
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default TableView
