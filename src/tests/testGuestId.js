// Fichier de test pour la fonction generateGuestId
import guestService from "../firebase/guestService"

// Test des noms avec caractères accentués
console.log("=== TEST DE LA FONCTION generateGuestId ===")

// Test avec des caractères accentués
const testCases = [
  { group: "Gaëlle", name: "James-Badibanga" },
  { group: "Table Éléphant", name: "François" },
  { group: "Théâtre", name: "Anaïs" },
  { group: "Café", name: "Jérôme" },
  { group: "Table.spéciale", name: "Marie-Noël" },
]

// Exécuter les tests
testCases.forEach((test) => {
  console.log(`Test: ${test.group} / ${test.name}`)
  const id = guestService.generateGuestId(test.group, test.name)
  console.log(`ID généré: ${id}`)
  console.log("---")
})

// Test supplémentaire avec le cas exact mentionné
const exactCase = { group: "Gaëlle", name: "James-Badibanga" }
console.log(`Test exact: ${exactCase.group} / ${exactCase.name}`)
const exactId = guestService.generateGuestId(exactCase.group, exactCase.name)
console.log(`ID généré: ${exactId}`)
console.log(
  `URL complète: https://invitationmariagefistonvino.criho.tech/invitation/${exactId}`
)
