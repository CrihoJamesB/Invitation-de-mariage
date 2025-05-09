/**
 * Configuration de l'authentification
 * Le mot de passe est stocké dans le fichier .env.local 
 * qui n'est pas versionnée pour des raisons de sécurité
 */
import { encrypt, decrypt } from "../utils/crypto"

// Récupération de la variable d'environnement avec une valeur par défaut
const adminPasswordFromEnv =
  import.meta.env?.VITE_ADMIN_PASSWORD ||
  window.env?.VITE_ADMIN_PASSWORD ||
  "password_temporaire"

export const AUTH_CONFIG = {
  // Récupération du mot de passe depuis les variables d'environnement
  adminPassword: adminPasswordFromEnv,

  // Fonction de validation pour comparer les mots de passe
  validatePassword: (inputPassword) => {
    return inputPassword === adminPasswordFromEnv
  },

  // Fonction pour crypter les données de session
  encryptSessionData: (data) => {
    return encrypt(data)
  },

  // Fonction pour décrypter les données de session
  decryptSessionData: (encryptedData) => {
    return decrypt(encryptedData)
  },
}
