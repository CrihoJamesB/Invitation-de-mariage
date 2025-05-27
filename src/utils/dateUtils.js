/**
 * Utilitaires pour la gestion des dates et timestamps
 */

/**
 * Formate un timestamp Firebase pour l'affichage
 *
 * @param {Object} timestamp - Timestamp Firebase ou Date JavaScript
 * @param {boolean} includeTime - Inclure l'heure dans le format
 * @returns {string} Date formatée en format français
 */
export const formatTimestamp = (timestamp, includeTime = true) => {
  if (!timestamp) return "N/A"

  let date
  // Si c'est un timestamp Firebase
  if (timestamp.toDate && typeof timestamp.toDate === "function") {
    date = timestamp.toDate()
  }
  // Si c'est déjà une date JavaScript
  else if (timestamp instanceof Date) {
    date = timestamp
  }
  // Si ce n'est pas un format reconnu
  else {
    return "Format de date inconnu"
  }

  // Options pour le format de date
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }

  // Ajouter l'heure si demandé
  if (includeTime) {
    options.hour = "2-digit"
    options.minute = "2-digit"
    options.second = "2-digit"
  }

  // Formater la date selon la locale française
  return new Intl.DateTimeFormat("fr-FR", options).format(date)
}

/**
 * Formate uniquement l'heure d'un timestamp
 *
 * @param {Object} timestamp - Timestamp Firebase ou Date JavaScript
 * @returns {string} Heure formatée en format français
 */
export const formatTime = (timestamp) => {
  return formatTimestamp(timestamp, false)
}

/**
 * Calcule la différence en jours entre aujourd'hui et une date
 *
 * @param {Date|Object} date - Date ou Timestamp Firebase
 * @returns {number} Nombre de jours de différence
 */
export const getDaysDifference = (date) => {
  if (!date) return 0

  let targetDate
  if (date.toDate && typeof date.toDate === "function") {
    targetDate = date.toDate()
  } else if (date instanceof Date) {
    targetDate = date
  } else {
    return 0
  }

  const today = new Date()
  const diffTime = Math.abs(today - targetDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}
