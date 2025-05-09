/**
 * Utilitaire pour l'initialisation et la gestion du cryptage
 * Utilise crypto-js qui est installé comme dépendance
 */
import CryptoJS from "crypto-js"

// Clé de base pour le cryptage (à ne pas modifier)
const BASE_KEY = "mariage_app_security"

/**
 * Génère une clé de cryptage à partir d'une chaîne spécifique
 * @param {string} salt - Sel pour renforcer la clé
 * @returns {string} - Clé de hachage générée
 */
export const generateKey = (salt = "") => {
  return CryptoJS.SHA256(`${BASE_KEY}_${salt}`).toString()
}

/**
 * Crypte des données avec une clé spécifique
 * @param {object|string} data - Données à crypter
 * @param {string} customKey - Clé personnalisée (optionnelle)
 * @returns {string} - Chaîne cryptée
 */
export const encrypt = (data, customKey = null) => {
  try {
    const key = customKey || generateKey("admin")
    const jsonString = typeof data === "string" ? data : JSON.stringify(data)
    return CryptoJS.AES.encrypt(jsonString, key).toString()
  } catch (error) {
    console.warn("Échec du cryptage:", error)
    return JSON.stringify(data)
  }
}

/**
 * Décrypte des données avec une clé spécifique
 * @param {string} encryptedData - Données cryptées
 * @param {string} customKey - Clé personnalisée (optionnelle)
 * @returns {object|null} - Données décryptées ou null en cas d'échec
 */
export const decrypt = (encryptedData, customKey = null) => {
  try {
    // Si les données commencent par {, elles ne sont probablement pas cryptées
    if (encryptedData.indexOf("{") === 0) {
      return JSON.parse(encryptedData)
    }

    const key = customKey || generateKey("admin")
    const bytes = CryptoJS.AES.decrypt(encryptedData, key)
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8)

    if (!decryptedText) {
      throw new Error("Décryptage a produit une chaîne vide")
    }

    return JSON.parse(decryptedText)
  } catch (error) {
    console.warn("Échec du décryptage:", error)
    // Essayer de parser en JSON si le décryptage échoue
    try {
      return JSON.parse(encryptedData)
    } catch {
      return null
    }
  }
}

// Exporter CryptoJS pour une utilisation directe si nécessaire
export { CryptoJS }
