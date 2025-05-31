// Test simple pour la fonction generateGuestId

// Simuler la fonction generateGuestId pour le test
function generateGuestId(group, name) {
  console.log("Génération d'ID pour:", { group, name })

  // Fonction pour normaliser une chaîne pour ID tout en préservant les lettres accentuées
  const normalizeForId = (text) => {
    // Convertir en minuscules et supprimer les espaces en début/fin
    let result = text.trim().toLowerCase()

    // Remplacer les espaces par des tirets
    result = result.replace(/\s+/g, "-")

    // Remplacer les caractères dangereux pour Firebase (.#$[]/)
    // mais garder les accents et autres caractères valides
    result = result.replace(/[.#$[\]/]/g, "-")

    // Éviter les tirets doubles
    result = result.replace(/-+/g, "-")

    return result
  }

  const sanitizedGroup = normalizeForId(group)
  const sanitizedName = normalizeForId(name)

  const guestId = `${sanitizedGroup}_${sanitizedName}`
  console.log("ID généré:", guestId)

  return guestId
}

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
  const id = generateGuestId(test.group, test.name)
  console.log(`ID généré: ${id}`)
  console.log("---")
})

// Test supplémentaire avec le cas exact mentionné
const exactCase = { group: "Gaëlle", name: "James-Badibanga" }
console.log(`Test exact: ${exactCase.group} / ${exactCase.name}`)
const exactId = generateGuestId(exactCase.group, exactCase.name)
console.log(`ID généré: ${exactId}`)
console.log(
  `URL complète: https://invitationmariagefistonvino.criho.tech/invitation/${exactId}`
)
