// Configuration Firebase pour l'application de mariage
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
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

// Initialisation des services
const db = getFirestore(app)
const auth = getAuth(app)

export { db, auth }
