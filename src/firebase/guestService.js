import { db } from "./config"
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"

// Collections Firestore
const GUESTS_COLLECTION = "guests"
const SCANS_COLLECTION = "scans"

/**
 * Service pour gérer les invités et les scans dans Firestore
 */
const guestService = {
  // Synchroniser tous les invités depuis les données locales
  async syncGuestsFromLocal(guestsData) {
    try {
      const batch = []

      Object.entries(guestsData).forEach(([groupName, groupGuests]) => {
        groupGuests.forEach(async (guest) => {
          // Créer un ID unique pour chaque invité
          const guestId = this.generateGuestId(groupName, guest.name)

          // Préparer les données de l'invité pour Firestore
          const guestData = {
            id: guestId,
            name: guest.name,
            group: groupName,
            count: guest.count,
            message: guest.message,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            scanned: false,
            scanCount: 0,
          }

          batch.push(setDoc(doc(db, GUESTS_COLLECTION, guestId), guestData))
        })
      })

      // Exécuter toutes les opérations en parallèle
      return Promise.all(batch)
    } catch (error) {
      console.error("Erreur lors de la synchronisation des invités:", error)
      throw error
    }
  },

  // Récupérer tous les invités
  async getAllGuests() {
    try {
      const guestsSnapshot = await getDocs(collection(db, GUESTS_COLLECTION))
      return guestsSnapshot.docs.map((doc) => doc.data())
    } catch (error) {
      console.error("Erreur lors de la récupération des invités:", error)
      // Retourner un tableau vide en cas d'erreur pour éviter les plantages
      return []
    }
  },

  // Récupérer un invité par son ID
  async getGuestById(guestId) {
    try {
      // Vérifier si guestId est une URL et en extraire l'identifiant
      if (guestId.includes("http") || guestId.includes("/")) {
        // Extraire le dernier segment de l'URL comme identifiant
        const urlSegments = guestId.split("/")
        guestId = urlSegments[urlSegments.length - 1]

        // S'assurer que l'ID est valide pour Firestore
        if (!guestId || guestId.includes("/")) {
          console.error(`ID d'invité invalide extrait de l'URL: ${guestId}`)
          return null
        }
      }

      const guestDoc = await getDoc(doc(db, GUESTS_COLLECTION, guestId))
      return guestDoc.exists() ? guestDoc.data() : null
    } catch (error) {
      console.error(
        `Erreur lors de la récupération de l'invité ${guestId}:`,
        error
      )
      return null
    }
  },

  // Ajouter un nouvel invité
  async addGuest(guestData) {
    try {
      const guestId = this.generateGuestId(guestData.group, guestData.name)

      const newGuest = {
        ...guestData,
        id: guestId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        scanned: false,
        scanCount: 0,
      }

      await setDoc(doc(db, GUESTS_COLLECTION, guestId), newGuest)
      return newGuest
    } catch (error) {
      console.error("Erreur lors de l'ajout d'un invité:", error)
      throw error
    }
  },

  // Mettre à jour un invité
  async updateGuest(guestId, updates) {
    try {
      const guestRef = doc(db, GUESTS_COLLECTION, guestId)

      await updateDoc(guestRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      })

      const updatedGuest = await getDoc(guestRef)
      return updatedGuest.data()
    } catch (error) {
      console.error(
        `Erreur lors de la mise à jour de l'invité ${guestId}:`,
        error
      )
      throw error
    }
  },

  // Supprimer un invité
  async deleteGuest(guestId) {
    try {
      return deleteDoc(doc(db, GUESTS_COLLECTION, guestId))
    } catch (error) {
      console.error(
        `Erreur lors de la suppression de l'invité ${guestId}:`,
        error
      )
      throw error
    }
  },

  // Enregistrer un scan de QR code
  async recordScan(guestId, scanData) {
    try {
      // Ajouter l'entrée de scan
      const scanRef = await addDoc(collection(db, SCANS_COLLECTION), {
        guestId,
        timestamp: serverTimestamp(),
        ...scanData,
      })

      // Mettre à jour les informations de l'invité
      const guestRef = doc(db, GUESTS_COLLECTION, guestId)
      const guestDoc = await getDoc(guestRef)

      if (guestDoc.exists()) {
        const guestData = guestDoc.data()

        await updateDoc(guestRef, {
          scanned: true,
          scanCount: (guestData.scanCount || 0) + 1,
          lastScan: serverTimestamp(),
        })
      }

      return scanRef.id
    } catch (error) {
      console.error(
        `Erreur lors de l'enregistrement du scan pour l'invité ${guestId}:`,
        error
      )
      throw error
    }
  },

  // Obtenir l'historique des scans pour un invité
  async getGuestScans(guestId) {
    try {
      const q = query(
        collection(db, SCANS_COLLECTION),
        where("guestId", "==", guestId)
      )
      const scansSnapshot = await getDocs(q)
      return scansSnapshot.docs.map((doc) => doc.data())
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des scans pour l'invité ${guestId}:`,
        error
      )
      return []
    }
  },

  // Obtenir tous les scans
  async getAllScans() {
    try {
      const scansSnapshot = await getDocs(collection(db, SCANS_COLLECTION))
      return scansSnapshot.docs.map((doc) => doc.data())
    } catch (error) {
      console.error("Erreur lors de la récupération des scans:", error)
      return []
    }
  },

  // Générer un ID unique pour un invité
  generateGuestId(group, name) {
    const sanitizedGroup = group.replace(/\s+/g, "-").toLowerCase()
    const sanitizedName = name.replace(/\s+/g, "-").toLowerCase()
    return `${sanitizedGroup}_${sanitizedName}`
  },
}

export default guestService
