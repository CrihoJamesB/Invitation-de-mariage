// Configuration Firebase pour l'application de mariage
import { initializeApp } from "firebase/app"
import {
  enableIndexedDbPersistence,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAJyHbhXTGWN8Frfnrkfh1yiAnNQuKb2Lg",
  authDomain: "mariage-a3309.firebaseapp.com",
  projectId: "mariage-a3309",
  storageBucket: "mariage-a3309.appspot.com",
  messagingSenderId: "851249523629",
  appId: "1:851249523629:web:0c73d232fbd2f2210a0f24",
  measurementId: "G-RJMFSEY5MB",
}

// Initialisation de Firebase
const app = initializeApp(firebaseConfig)

// Initialisation des services avec des configurations optimisées
// Utiliser initializeFirestore avec persistentLocalCache pour améliorer les performances
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
})

// Activer la persistance hors ligne pour que l'application fonctionne sans connexion
// Note: Cela peut échouer dans certains navigateurs, donc utiliser try/catch
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === "failed-precondition") {
      // Plusieurs onglets ouverts, la persistance ne peut être activée que dans un seul
      console.warn(
        "La persistance des données ne peut pas être activée car plusieurs onglets sont ouverts"
      )
    } else if (err.code === "unimplemented") {
      // Le navigateur ne prend pas en charge la persistance
      console.warn(
        "Le navigateur actuel ne prend pas en charge toutes les fonctionnalités nécessaires pour la persistance des données"
      )
    }
  })
} catch (error) {
  console.warn("Erreur lors de l'activation de la persistance:", error)
}

const auth = getAuth(app)

export { db, auth }
