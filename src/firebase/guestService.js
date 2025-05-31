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
  writeBatch,
  limit,
  orderBy,
} from "firebase/firestore"

// Collections Firestore
const GUESTS_COLLECTION = "guests"
const SCANS_COLLECTION = "scans"

/**
 * Service pour gérer les invités et les scans dans Firestore
 */
const guestService = {
  // Synchroniser tous les invités depuis les données locales - Version optimisée avec batch
  async syncGuestsFromLocal(guestsData) {
    try {
      // Utiliser les lots (batches) pour des opérations groupées plus efficaces
      const batchSize = 500 // Limite Firestore pour les opérations par lot
      let operationCount = 0
      let currentBatch = writeBatch(db)
      let batches = []

      Object.entries(guestsData).forEach(([groupName, groupGuests]) => {
        groupGuests.forEach((guest) => {
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

          // Ajouter au lot courant
          const docRef = doc(db, GUESTS_COLLECTION, guestId)
          currentBatch.set(docRef, guestData)
          operationCount++

          // Si on atteint la limite du lot, créer un nouveau lot
          if (operationCount >= batchSize) {
            batches.push(currentBatch)
            currentBatch = writeBatch(db)
            operationCount = 0
          }
        })
      })

      // Ajouter le dernier lot s'il contient des opérations
      if (operationCount > 0) {
        batches.push(currentBatch)
      }

      // Exécuter tous les lots en parallèle
      return Promise.all(batches.map((batch) => batch.commit()))
    } catch (error) {
      console.error("Erreur lors de la synchronisation des invités:", error)
      throw error
    }
  },

  // Récupérer tous les invités avec limite pour éviter les surcharges
  async getAllGuests(maxLimit = 1000) {
    try {
      // Utiliser limit() pour éviter de récupérer trop de données
      const guestsQuery = query(
        collection(db, GUESTS_COLLECTION),
        limit(maxLimit)
      )
      const guestsSnapshot = await getDocs(guestsQuery)
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
      console.log("Tentative de récupération de l'invité avec ID:", guestId)

      // Sanitiser l'ID pour Firestore
      const sanitizedGuestId = this.sanitizeFirestoreId(guestId)
      console.log("ID sanitisé:", sanitizedGuestId)

      // Récupérer le document
      const guestDoc = await getDoc(
        doc(db, GUESTS_COLLECTION, sanitizedGuestId)
      )

      if (!guestDoc.exists()) {
        console.log("Aucun document trouvé pour cet ID")
        return null
      }

      // Récupérer les données et les retourner
      const guestData = guestDoc.data()
      console.log("Données de l'invité trouvées:", guestData)
      return guestData
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

      // Optimisation: ne récupérer le document complet que si nécessaire
      // Si ce n'est pas nécessaire, retourner simplement les données mises à jour
      const updatedData = {
        id: guestId,
        ...updates,
        updatedAt: new Date(), // Approximation locale pour éviter une requête supplémentaire
      }

      return updatedData
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
      // Sanitiser l'ID pour éviter les problèmes de chemin Firestore
      const sanitizedGuestId = this.sanitizeFirestoreId(guestId)

      // Ajouter l'entrée de scan
      const scanRef = await addDoc(collection(db, SCANS_COLLECTION), {
        guestId: sanitizedGuestId,
        timestamp: serverTimestamp(),
        ...scanData,
      })

      // Mettre à jour les informations de l'invité
      const guestRef = doc(db, GUESTS_COLLECTION, sanitizedGuestId)
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

  // Obtenir l'historique des scans pour un invité - limité et trié
  async getGuestScans(guestId, maxResults = 10) {
    try {
      const sanitizedGuestId = this.sanitizeFirestoreId(guestId)
      const q = query(
        collection(db, SCANS_COLLECTION),
        where("guestId", "==", sanitizedGuestId),
        orderBy("timestamp", "desc"), // Plus récent d'abord
        limit(maxResults) // Limiter le nombre de résultats
      )
      const scansSnapshot = await getDocs(q)
      return scansSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des scans pour l'invité ${guestId}:`,
        error
      )
      return []
    }
  },

  // Obtenir tous les scans avec pagination
  async getAllScans(pageSize = 20, startAfterDoc = null) {
    try {
      let scansQuery

      if (startAfterDoc) {
        scansQuery = query(
          collection(db, SCANS_COLLECTION),
          orderBy("timestamp", "desc"),
          startAfterDoc,
          limit(pageSize)
        )
      } else {
        scansQuery = query(
          collection(db, SCANS_COLLECTION),
          orderBy("timestamp", "desc"),
          limit(pageSize)
        )
      }

      const scansSnapshot = await getDocs(scansQuery)

      // Préparer les données pour la pagination
      const lastDoc = scansSnapshot.docs[scansSnapshot.docs.length - 1]

      const scans = scansSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      return {
        scans,
        lastDoc,
        hasMore: scansSnapshot.docs.length === pageSize,
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des scans:", error)
      return { scans: [], lastDoc: null, hasMore: false }
    }
  },

  // Réinitialiser tous les scans des invités
  async resetAllGuestScans() {
    try {
      // 1. Récupérer tous les invités
      const guestsQuery = query(collection(db, GUESTS_COLLECTION))
      const guestsSnapshot = await getDocs(guestsQuery)

      // 2. Utiliser un batch pour optimiser les performances
      const batchSize = 500 // Limite Firestore pour les opérations par lot
      let operationCount = 0
      let currentBatch = writeBatch(db)
      let batches = []

      // 3. Réinitialiser le statut de scan pour chaque invité
      guestsSnapshot.docs.forEach((docSnapshot) => {
        const guestRef = doc(db, GUESTS_COLLECTION, docSnapshot.id)
        currentBatch.update(guestRef, {
          scanned: false,
          scanCount: 0,
          lastScan: null,
          updatedAt: serverTimestamp(),
        })

        operationCount++

        // Si on atteint la limite du lot, créer un nouveau lot
        if (operationCount >= batchSize) {
          batches.push(currentBatch)
          currentBatch = writeBatch(db)
          operationCount = 0
        }
      })

      // Ajouter le dernier lot s'il contient des opérations
      if (operationCount > 0) {
        batches.push(currentBatch)
      }

      // 4. Exécuter tous les lots
      await Promise.all(batches.map((batch) => batch.commit()))

      // 5. Supprimer tous les documents de la collection scans
      const scansQuery = query(collection(db, SCANS_COLLECTION))
      const scansSnapshot = await getDocs(scansQuery)

      // Réinitialiser les opérations de lot
      operationCount = 0
      currentBatch = writeBatch(db)
      batches = []

      scansSnapshot.docs.forEach((scanDoc) => {
        const scanRef = doc(db, SCANS_COLLECTION, scanDoc.id)
        currentBatch.delete(scanRef)

        operationCount++

        // Si on atteint la limite du lot, créer un nouveau lot
        if (operationCount >= batchSize) {
          batches.push(currentBatch)
          currentBatch = writeBatch(db)
          operationCount = 0
        }
      })

      // Ajouter le dernier lot s'il contient des opérations
      if (operationCount > 0) {
        batches.push(currentBatch)
      }

      // Exécuter tous les lots
      await Promise.all(batches.map((batch) => batch.commit()))

      return {
        success: true,
        resetCount: guestsSnapshot.size,
        deletedScans: scansSnapshot.size,
      }
    } catch (error) {
      console.error("Erreur lors de la réinitialisation des scans:", error)
      throw error
    }
  },

  // Générer un ID unique pour un invité
  generateGuestId(group, name) {
    console.log("Génération d'ID pour:", { group, name })

    // Sanitisation améliorée
    const sanitizedGroup = group
      .trim()
      .toLowerCase()
      // Remplacer les espaces par des tirets
      .replace(/\s+/g, "-")
      // Supprimer les caractères spéciaux
      .replace(/[^a-z0-9-]/g, "")
      // Éviter les tirets doubles
      .replace(/-+/g, "-")

    const sanitizedName = name
      .trim()
      .toLowerCase()
      // Remplacer les espaces par des tirets
      .replace(/\s+/g, "-")
      // Supprimer les caractères spéciaux
      .replace(/[^a-z0-9-]/g, "")
      // Éviter les tirets doubles
      .replace(/-+/g, "-")

    const guestId = `${sanitizedGroup}_${sanitizedName}`
    console.log("ID généré:", guestId)

    return guestId
  },

  // Fonction utilitaire pour sanitiser les ID pour Firestore
  sanitizeFirestoreId(id) {
    // Retirer toute URL ou chemin qui pourrait causer des problèmes
    if (id.includes("/")) {
      // Si c'est une URL ou un chemin avec des /
      const parts = id.split("/")
      // Prendre la dernière partie non vide
      for (let i = parts.length - 1; i >= 0; i--) {
        if (parts[i].trim()) {
          return parts[i].trim()
        }
      }
    }

    // Nettoyer les caractères non autorisés pour les ID Firestore
    return id.replace(/[#.[\]/]/g, "_")
  },
}

export default guestService
