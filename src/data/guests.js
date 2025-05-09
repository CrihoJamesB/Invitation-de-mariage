/**
 * Liste complète des invités au mariage
 * Organisée par groupe d'invités et leurs personnes associées
 */

export const guests = {
  Shukrani: [
    {
      name: "institut kilanga",
      count: 7,
      message:
        "Chers amis de l'Institut Kilanga, votre présence enrichira notre célébration ! Bienvenue au mariage de Fiston Zaka et Vino Banza.",
    },
    {
      name: "couple FAKI",
      count: 2,
      message:
        "Famille Faki, c'est un honneur de vous compter parmi nous pour le grand jour ! Fiston Zaka et Vino Banza vous saluent chaleureusement.",
    },
    {
      name: "EP SHINDANO",
      count: 3,
      message:
        "Chers membres de l'EP Shindano, votre joie et votre bonne humeur sont essentielles ! À très vite pour célébrer Fiston Zaka et Vino Banza.",
    },
  ],
  Yvmie: [
    {
      name: "INSTITUT WILLIAM",
      count: 5,
      message:
        "Institut William, préparez-vous à partager un moment inoubliable ! Fiston Zaka et Vino Banza vous attendent.",
    },
    {
      name: "COUPLE MAKAMBU",
      count: 2,
      message:
        "Couple Makambu, votre complicité sera notre plus beau cadeau ! Merci de célébrer ce jour spécial avec Fiston Zaka et Vino Banza.",
    },
    {
      name: "COUPLE KIKWESE",
      count: 2,
      message:
        "Famille Kikwese, votre présence illuminera la fête ! Fiston Zaka et Vino Banza vous accueillent à bras ouverts.",
    },
    {
      name: "Vudwawu",
      count: 1,
      message:
        "Cher Vudwawu, toute l'équipe de Fiston Zaka et Vino Banza est ravie de vous recevoir pour cette belle journée.",
    },
  ],
  Yvanna: [
    {
      name: "ÉCOLE CROUCROU",
      count: 5,
      message:
        "École Croucrou, vos sourires et votre enthousiasme sont attendus ! Merci de venir fêter Fiston Zaka et Vino Banza.",
    },
    {
      name: "COUPLE LUCIEN",
      count: 2,
      message:
        "Couple Lucien, nous sommes impatients de partager ce moment magique avec vous ! À bientôt pour le mariage de Fiston Zaka et Vino Banza.",
    },
    {
      name: "COUPLE MASIALA",
      count: 2,
      message:
        "Famille Masiala, votre élégance animera notre journée ! Fiston Zaka et Vino Banza se réjouissent de vous voir.",
    },
  ],
  Aurore: [
    {
      name: "COUPLE FWAMBA EMMANUEL",
      count: 2,
      message:
        "Couple Fwamba Emmanuel, préparez-vous à une fête mémorable ! Fiston Zaka et Vino Banza vous remercient de votre présence.",
    },
    {
      name: "COUPLE MBUYU CLAUDE",
      count: 2,
      message:
        "Famille Mbuyu Claude, votre joie de vivre sera le plus beau des cadeaux ! Merci d'être là pour Fiston Zaka et Vino Banza.",
    },
    {
      name: "COUPLE KUMWIMBA PEGGY",
      count: 2,
      message:
        "Couple Kumwimba Peggy, votre présence apportera chaleur et sourire ! Fiston Zaka et Vino Banza sont impatients de vous accueillir.",
    },
    {
      name: "COUPLE MBUMBA FREDY",
      count: 2,
      message:
        "Famille Mbumba Fredy, merci de participer à cette grande aventure ! Fiston Zaka et Vino Banza vous saluent avec gratitude.",
    },
    {
      name: "ANGEL KYUNGU",
      count: 1,
      message:
        "Cher Angel Kyungu, votre soutien est précieux ! Bienvenue au mariage de Fiston Zaka et Vino Banza.",
    },
    {
      name: "Mukalay Jean",
      count: 1,
      message:
        "Cher Mukalay Jean, merci de joindre vos vœux à notre célébration ! À très vite pour fêter Fiston Zaka et Vino Banza.",
    },
  ],
  Beneth: [
    {
      name: "couple fwamba George",
      count: 2,
      message:
        "Couple Fwamba George, votre présence embellira le jour J ! Fiston Zaka et Vino Banza vous attendent.",
    },
    {
      name: "couple KYUNGU benjamin",
      count: 2,
      message:
        "Famille Kyungu Benjamin, merci d'être à nos côtés pour ce moment unique ! À bientôt pour le mariage de Fiston Zaka et Vino Banza.",
    },
    {
      name: "couple fwamba Franc",
      count: 2,
      message:
        "Couple Fwamba Franc, votre complicité rendra la fête encore plus belle ! Fiston Zaka et Vino Banza vous accueillent.",
    },
    {
      name: "Maman Nénette",
      count: 1,
      message:
        "Chère Maman Nénette, votre présence maternelle sera notre plus grand réconfort ! Bienvenue au mariage de Fiston Zaka et Vino Banza.",
    },
    {
      name: "Maman KYUNGU",
      count: 1,
      message:
        "Chère Maman Kyungu, merci de partager ce moment sacré avec nous ! Fiston Zaka et Vino Banza vous saluent chaleureusement.",
    },
    {
      name: "Maman Costa",
      count: 1,
      message:
        "Chère Maman Costa, votre bienveillance illuminera notre journée ! À très bientôt pour célébrer Fiston Zaka et Vino Banza.",
    },
  ],
  // Ajout d'autres groupes (restants)...
}

/**
 * Fonctions utilitaires pour manipuler les données des invités
 */
export const getGuestCount = () => {
  // Calcule le nombre total d'invités
  return Object.values(guests).reduce((total, group) => {
    return (
      total + group.reduce((groupTotal, guest) => groupTotal + guest.count, 0)
    )
  }, 0)
}

export const getGroupCount = () => {
  // Retourne le nombre de groupes d'invités
  return Object.keys(guests).length
}

export const findGuestByName = (name) => {
  // Recherche un invité par son nom (insensible à la casse)
  const normalizedName = name.toLowerCase()

  for (const group in guests) {
    const foundGuest = guests[group].find((guest) =>
      guest.name.toLowerCase().includes(normalizedName)
    )
    if (foundGuest) return { ...foundGuest, group }
  }

  return null
}

/**
 * Génère un ID unique pour chaque invité basé sur son groupe et son nom
 * Utilisé pour les URLs personnalisées et les QR codes
 */
export const generateGuestId = (group, name) => {
  const sanitizedGroup = group.replace(/\s+/g, "-").toLowerCase()
  const sanitizedName = name.replace(/\s+/g, "-").toLowerCase()

  return `${sanitizedGroup}_${sanitizedName}`
}

/**
 * Obtient les informations complètes d'un invité à partir de son ID
 */
export const getGuestInfoById = (guestId) => {
  const [groupId, ...nameParts] = guestId.split("_")
  const nameId = nameParts.join("_")

  // Recherche le groupe puis l'invité
  for (const group in guests) {
    if (group.replace(/\s+/g, "-").toLowerCase() === groupId) {
      const guest = guests[group].find((g) => {
        const gName = g.name.replace(/\s+/g, "-").toLowerCase()
        return gName === nameId
      })

      if (guest) return { ...guest, group }
    }
  }

  return null
}
