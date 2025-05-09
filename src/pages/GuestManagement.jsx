import React, { useState, useEffect } from "react"
import { guests } from "../data/guests"
import GuestListItem from "../components/admin/GuestListItem"
import Card from "../components/common/Card"
import Button from "../components/common/Button"

/**
 * Page d'administration pour la gestion des invités
 * Permet de rechercher, filtrer et partager les invitations
 */
const GuestManagement = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGroup, setSelectedGroup] = useState("")
  const [filteredGuests, setFilteredGuests] = useState([])
  const [stats, setStats] = useState({
    totalGuests: 0,
    totalPeople: 0,
    sharedInvitations: 0,
  })
  const [sharedInvites, setSharedInvites] = useState([])

  // Initialiser les statistiques et la liste filtrée au chargement
  useEffect(() => {
    // Calculer les statistiques initiales
    let totalPeople = 0
    let totalGuests = 0

    Object.values(guests).forEach((group) => {
      totalGuests += group.length
      group.forEach((guest) => {
        totalPeople += guest.count
      })
    })

    setStats({
      totalGuests,
      totalPeople,
      sharedInvitations: 0,
    })

    // Initialiser la liste filtrée avec tous les invités
    const initialList = []
    Object.entries(guests).forEach(([groupName, groupGuests]) => {
      groupGuests.forEach((guest) => {
        initialList.push({ ...guest, group: groupName })
      })
    })

    setFilteredGuests(initialList)
  }, [])

  // Filtrer les invités quand le terme de recherche ou le groupe change
  useEffect(() => {
    const filtered = []

    Object.entries(guests).forEach(([groupName, groupGuests]) => {
      // Si un groupe est sélectionné et que ce n'est pas ce groupe, ignorer
      if (selectedGroup && groupName !== selectedGroup) return

      const matchingGuests = groupGuests.filter((guest) =>
        guest.name.toLowerCase().includes(searchTerm.toLowerCase())
      )

      matchingGuests.forEach((guest) => {
        filtered.push({ ...guest, group: groupName })
      })
    })

    setFilteredGuests(filtered)
  }, [searchTerm, selectedGroup])

  // Gérer le partage d'une invitation
  const handleShare = (guest, group) => {
    // Vérifier si cette invitation a déjà été partagée
    const alreadyShared = sharedInvites.some(
      (invite) => invite.name === guest.name && invite.group === group
    )

    // Si ce n'est pas déjà partagé, ajouter à la liste des partagés
    if (!alreadyShared) {
      const newSharedInvites = [...sharedInvites, { ...guest, group }]
      setSharedInvites(newSharedInvites)

      // Mettre à jour les statistiques
      setStats((prev) => ({
        ...prev,
        sharedInvitations: prev.sharedInvitations + 1,
      }))
    }
  }

  // Obtenir la liste des groupes uniques
  const groupsList = Object.keys(guests)

  return (
    <div className="bg-secondary min-h-screen pb-10">
      {/* En-tête */}
      <header className="bg-primary text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-elegant text-3xl">Gestion des Invités</h1>
          <p className="text-white/70 mt-2">
            Gérez les invitations pour le mariage de Fiston Zaka et Vino Banza
          </p>
        </div>
      </header>

      {/* Tableaux de statistiques */}
      <div className="max-w-4xl mx-auto px-4 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total des invités"
            value={stats.totalGuests}
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

          <StatCard
            title="Total des personnes"
            value={stats.totalPeople}
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                ></path>
              </svg>
            }
          />

          <StatCard
            title="Invitations partagées"
            value={stats.sharedInvitations}
            percentage={Math.round(
              (stats.sharedInvitations / stats.totalGuests) * 100
            )}
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
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                ></path>
              </svg>
            }
          />
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <Card
          variant="default"
          className="p-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-grow">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary bg-white text-primary-dark placeholder-muted"
                  placeholder="Rechercher un invité..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Filtre par groupe */}
            <div className="w-full md:w-1/3">
              <select
                className="block w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-primary focus:border-primary bg-white text-primary-dark"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
              >
                <option value="">Tous les groupes</option>
                {groupsList.map((group) => (
                  <option
                    key={group}
                    value={group}
                  >
                    {group}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      </div>

      {/* Liste des invités */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <h2 className="font-elegant text-2xl text-primary-dark mb-4">
          {filteredGuests.length}{" "}
          {filteredGuests.length > 1 ? "invités trouvés" : "invité trouvé"}
        </h2>

        <div className="space-y-4">
          {filteredGuests.map((guest, index) => (
            <GuestListItem
              key={`${guest.group}-${guest.name}-${index}`}
              guest={guest}
              group={guest.group}
              onShare={handleShare}
            />
          ))}

          {filteredGuests.length === 0 && (
            <Card
              variant="flat"
              className="p-8 text-center"
            >
              <div className="text-muted">
                <svg
                  className="w-12 h-12 mx-auto mb-4 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <p className="text-lg font-elegant">
                  Aucun invité ne correspond à votre recherche
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Composant interne pour afficher une statistique
 */
const StatCard = ({ title, value, percentage, icon }) => (
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
            <p className="text-2xl font-semibold text-primary-dark">{value}</p>
            {percentage !== undefined && (
              <span className="ml-2 text-sm text-primary/80 mb-1">
                ({percentage}%)
              </span>
            )}
          </div>
        </div>
      </div>
    </Card.Body>
  </Card>
)

export default GuestManagement
