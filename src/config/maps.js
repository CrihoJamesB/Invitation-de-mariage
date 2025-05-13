/**
 * Configuration pour les services de cartographie
 * Centralise les coordonnées du lieu et les paramètres des différents services
 */

// Coordonnées exactes du lieu de mariage (Inga, Kinshasa)
export const VENUE_COORDINATES = {
  lat: "-4.349492299999992",
  lng: "15.284177500000002",
}

// URL de l'iframe Google Maps (vue satellite)
export const GOOGLE_MAPS_IFRAME_URL =
  "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d268.0709042223314!2d15.284177500000002!3d-4.349492299999992!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a311727fd6733%3A0x90c247f29251d470!2sInga%2C%20Kinshasa!5e1!3m2!1sfr!2scd!4v1747145837388!5m2!1sfr!2scd"

/**
 * Génère les URLs pour différents services de navigation
 * @param {Object} venue - Informations sur le lieu du mariage
 * @returns {Object} - URLs pour différents services de navigation
 */
export const getNavigationUrls = (venue) => {
  const locationName = encodeURIComponent(`${venue.name} - ${venue.address}`)

  return {
    // Lien direct vers Google Maps (ne nécessite pas de clé API)
    googleMaps: `https://www.google.com/maps?q=${VENUE_COORDINATES.lat},${VENUE_COORDINATES.lng}`,

    // Lien direct vers Yango (sans point de départ prédéfini)
    yango: `https://yango.go.link/route?end-lat=${VENUE_COORDINATES.lat}&end-lon=${VENUE_COORDINATES.lng}&ref=weddingapp&adj_t=vokme8e_nd9s9z9&lang=fr&adj_deeplink_js=1&adj_fallback=https%3A%2F%2Fyango.com%2Ffr_int%2Forder%2F%3Fgto%3D${VENUE_COORDINATES.lng}%2C${VENUE_COORDINATES.lat}%26ref%3Dweddingapp`,

    // Lien direct vers Apple Plans
    appleMaps: `https://maps.apple.com/?ll=${VENUE_COORDINATES.lat},${VENUE_COORDINATES.lng}&q=${locationName}`,

    // Lien direct vers Uber (sans point de départ prédéfini)
    uber: `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${VENUE_COORDINATES.lat}&dropoff[longitude]=${VENUE_COORDINATES.lng}&dropoff[nickname]=${locationName}`,
  }
}

/**
 * Génère l'URL pour partager la localisation via WhatsApp
 * @param {Object} venue - Informations sur le lieu
 * @param {Object} couple - Informations sur le couple
 * @returns {string} - URL WhatsApp
 */
export const getWhatsAppShareUrl = (venue, couple) => {
  const message = encodeURIComponent(
    `Lieu du mariage de ${couple.groom} et ${couple.bride}: ${venue.name}, ${venue.address}, ${venue.city}. Voici le lien Google Maps: https://www.google.com/maps?q=${VENUE_COORDINATES.lat},${VENUE_COORDINATES.lng}`
  )

  return `https://wa.me/?text=${message}`
}
