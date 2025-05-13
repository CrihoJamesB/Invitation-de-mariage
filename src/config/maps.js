/**
 * Configuration pour les services de cartographie
 * Centralise les coordonnées du lieu et les paramètres des différents services
 */

// Coordonnées exactes du lieu de mariage (extraites de l'iframe)
export const VENUE_COORDINATES = {
  lat: "-4.349435",
  lng: "15.284469",
}

// URL de l'iframe Google Maps (vue satellite)
export const GOOGLE_MAPS_IFRAME_URL =
  "https://www.google.com/maps/embed?pb=!1m24!1m12!1m3!1d443.67125756005686!2d15.284143436383307!3d-4.349251041147483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m9!3e6!4m3!3m2!1d-4.3140573!2d15.280600799999998!4m3!3m2!1d-4.3494354!2d15.284469399999999!5e1!3m2!1sfr!2scd!4v1746796304467!5m2!1sfr!2scd"

/**
 * Obtient la position actuelle de l'utilisateur
 * @returns {Promise<{lat: number, lng: number}>} - Coordonnées de l'utilisateur
 */
export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('La géolocalisation n\'est pas supportée par votre navigateur'));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

/**
 * Génère les URLs pour différents services de navigation
 * @param {Object} venue - Informations sur le lieu du mariage
 * @param {Object} userPosition - Position actuelle de l'utilisateur
 * @returns {Object} - URLs pour différents services de navigation
 */
export const getNavigationUrls = async (venue) => {
  const locationName = encodeURIComponent(`${venue.name} - ${venue.address}`);
  
  try {
    const userPosition = await getCurrentPosition();
    
    return {
      // Lien direct vers Google Maps avec point de départ dynamique
      googleMaps: `https://www.google.com/maps/dir/?api=1&origin=${userPosition.lat},${userPosition.lng}&destination=${VENUE_COORDINATES.lat},${VENUE_COORDINATES.lng}`,

      // Lien direct vers Yango avec point de départ dynamique
      yango: `https://yango.go.link/route?start-lat=${userPosition.lat}&start-lon=${userPosition.lng}&end-lat=${VENUE_COORDINATES.lat}&end-lon=${VENUE_COORDINATES.lng}&ref=weddingapp&adj_t=vokme8e_nd9s9z9&lang=fr&adj_deeplink_js=1&adj_fallback=https%3A%2F%2Fyango.com%2Ffr_int%2Forder%2F%3Fgto%3D${VENUE_COORDINATES.lng}%2C${VENUE_COORDINATES.lat}%26ref%3Dweddingapp`,

      // Lien direct vers Apple Plans avec point de départ dynamique
      appleMaps: `https://maps.apple.com/?saddr=${userPosition.lat},${userPosition.lng}&daddr=${VENUE_COORDINATES.lat},${VENUE_COORDINATES.lng}&q=${locationName}`,

      // Lien direct vers Uber avec point de départ dynamique
      uber: `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${userPosition.lat}&pickup[longitude]=${userPosition.lng}&dropoff[latitude]=${VENUE_COORDINATES.lat}&dropoff[longitude]=${VENUE_COORDINATES.lng}&dropoff[nickname]=${locationName}`,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de la position:', error);
    // Retourner les URLs sans point de départ en cas d'erreur
    return {
      googleMaps: `https://www.google.com/maps?q=${VENUE_COORDINATES.lat},${VENUE_COORDINATES.lng}`,
      yango: `https://yango.go.link/route?end-lat=${VENUE_COORDINATES.lat}&end-lon=${VENUE_COORDINATES.lng}&ref=weddingapp&adj_t=vokme8e_nd9s9z9&lang=fr`,
      appleMaps: `https://maps.apple.com/?ll=${VENUE_COORDINATES.lat},${VENUE_COORDINATES.lng}&q=${locationName}`,
      uber: `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=${VENUE_COORDINATES.lat}&dropoff[longitude]=${VENUE_COORDINATES.lng}&dropoff[nickname]=${locationName}`,
    };
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
