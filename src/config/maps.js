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
    "https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=Inga,Kinshasa&zoom=13&maptype=roadmap",
  width: "100%",
  height: "450",
  style: "border:0",
  loading: "lazy",
  allowFullscreen: true,
  referrerPolicy: "no-referrer-when-downgrade",
}

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
