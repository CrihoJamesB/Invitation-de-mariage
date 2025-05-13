/**
 * Configuration pour les services de cartographie
 * Centralise les coordonnées du lieu et les paramètres des différents services
 */

// Coordonnées exactes du lieu de mariage (Inga, Kinshasa)
export const VENUE_COORDINATES = {
  lat: "-4.349492299999992",
  lng: "15.284177500000002",
  name: "Inga",
  city: "Kinshasa",
  country: "RD Congo",
}

// Paramètres optimisés pour l'iframe Google Maps
export const MAPS_CONFIG = {
  iframeUrl:
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d268.0709042223314!2d15.284177500000002!3d-4.349492299999992!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a311727fd6733%3A0x90c247f29251d470!2sInga%2C%20Kinshasa!5e1!3m2!1sfr!2scd!4v1747145837388!5m2!1sfr!2scd",
  width: "100%",
  height: "450",
  style: "border:0",
  loading: "lazy",
  allowFullscreen: true,
  referrerPolicy: "no-referrer-when-downgrade",
}

// Export pour la compatibilité avec le code existant
export const GOOGLE_MAPS_IFRAME_URL = MAPS_CONFIG.iframeUrl

/**
 * Génère les URLs pour différents services de navigation
 * @param {Object} venue - Informations sur le lieu du mariage
 * @returns {Object} - URLs pour différents services de navigation
 */
export const getNavigationUrls = (venue) => {
  const locationName = encodeURIComponent(`${venue.name} - ${venue.address}`)
  const { lat, lng } = VENUE_COORDINATES

  return {
    // Lien direct vers Google Maps avec itinéraire
    googleMaps: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving&dir_action=navigate`,

    // Lien direct vers Yango avec itinéraire
    yango: `https://yango.go.link/route?end-lat=${lat}&end-lon=${lng}&ref=weddingapp&adj_t=vokme8e_nd9s9z9&lang=fr&adj_deeplink_js=1&adj_fallback=https%3A%2F%2Fyango.com%2Ffr_int%2Forder%2F%3Fgto%3D${lng}%2C${lat}%26ref%3Dweddingapp`,

    // Lien direct vers Apple Plans avec itinéraire
    appleMaps: `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d&t=m`,

    // Lien direct vers Uber avec itinéraire
    uber: `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${locationName}`,
  }
}

/**
 * Génère l'URL pour partager la localisation via WhatsApp avec un message optimisé
 * @param {Object} venue - Informations sur le lieu
 * @param {Object} couple - Informations sur le couple
 * @returns {string} - URL WhatsApp
 */
export const getWhatsAppShareUrl = (venue, couple) => {
  const { lat, lng, name, city, country } = VENUE_COORDINATES
  const message = encodeURIComponent(
    `📍 Lieu du mariage de ${couple.groom} et ${couple.bride}:\n\n${name}, ${venue.address}\n${city}, ${country}\n\n🗺️ Itinéraire: https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`
  )

  return `https://wa.me/?text=${message}`
}
