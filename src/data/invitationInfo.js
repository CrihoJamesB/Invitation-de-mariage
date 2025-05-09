/**
 * Informations sur le mariage et le lieu de la cérémonie
 */
export const invitationInfo = {
  // Informations sur le couple
  couple: {
    groom: "Fiston Zaka",
    bride: "Vino Banza",
  },

  // Informations sur l'événement
  event: {
    date: "31 Mai 2025",
    time: "14:00",
    venue: "Salle de fête Néema",
    address: "Avenue INGA, N° 1",
    location: "Commune de Bandalungwa, Quartier Adoula",
    city: "Kinshasa",
    country: "Congo-Kinshasa",
    reference: "Terrain municipal",
  },

  // Informations sur les familles
  families: {
    groomFamily: "Famille Lisongo",
    brideFamily: "Famille Fwamba",
  },

  // Message d'accueil principal
  welcomeMessage:
    "Nous avons l'immense joie de vous convier à notre union. Votre présence serait pour nous un honneur et rendrait ce jour encore plus mémorable.",

  // Programme de la journée
  schedule: [
    {
      time: "14:00",
      title: "Accueil des invités",
      description: "Arrivée et installation des invités",
    },
    {
      time: "15:00",
      title: "Cérémonie",
      description: "Célébration de notre union",
    },
    {
      time: "16:30",
      title: "Cocktail",
      description: "Photos et rafraîchissements",
    },
    {
      time: "18:00",
      title: "Dîner",
      description: "Repas et festivités",
    },
    {
      time: "20:00",
      title: "Soirée dansante",
      description: "Célébration jusqu'au bout de la nuit",
    },
  ],

  // Informations sur la dress code
  dressCode: "Tenue élégante",

  // Options RSVP
  rsvp: {
    deadline: "15 Avril 2025",
    contactPhone: "+243 XX XXX XXXX",
    contactEmail: "fistonvino2025@gmail.com",
  },
}

/**
 * Sections principales de l'invitation
 */
export const invitationSections = [
  { id: "accueil", title: "Accueil", icon: "heart" },
  { id: "details", title: "Détails", icon: "calendar" },
  { id: "lieu", title: "Lieu", icon: "map-pin" },
  { id: "programme", title: "Programme", icon: "clock" },
  { id: "rsvp", title: "RSVP", icon: "check-circle" },
]
