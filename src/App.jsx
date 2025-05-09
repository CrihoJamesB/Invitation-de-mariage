import { useState } from 'react'
import './App.css'
import Button from './components/Button'
import Card from './components/Card'
import Input from './components/Input'
import Layout from './components/Layout'

/**
 * Composant principal de l'application
 */
function App() {
  // État pour le formulaire d'exemple
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  })
  const [errors, setErrors] = useState({})

  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Réinitialiser l'erreur si l'utilisateur commence à taper
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Validation et soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation simple
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email est invalide'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Traitement du formulaire (simulation)
    alert(`Formulaire soumis avec succès!\nNom: ${formData.name}\nEmail: ${formData.email}`)
  }

  // En-tête de l'application
  const header = (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-primary">Mon Application</h1>
      <nav>
        <ul className="flex space-x-4">
          <li><a href="#" className="text-primary hover:underline">Accueil</a></li>
          <li><a href="#" className="text-primary hover:underline">À propos</a></li>
          <li><a href="#" className="text-primary hover:underline">Contact</a></li>
        </ul>
      </nav>
    </div>
  )

  // Pied de page de l'application
  const footer = (
    <div className="flex justify-between items-center">
      <p>&copy; {new Date().getFullYear()} - Mon Application</p>
      <div className="flex space-x-4">
        <a href="#" className="text-white hover:underline">Mentions légales</a>
        <a href="#" className="text-white hover:underline">Politique de confidentialité</a>
      </div>
    </div>
  )

  return (
    <Layout header={header} footer={footer}>
      <Layout.Section 
        title="Bienvenue sur Mon Application" 
        subtitle="Une application moderne construite avec React, Vite et Tailwind CSS"
      >
        <Layout.Grid cols={2} gap={6}>
          {/* Carte d'information */}
          <Card variant="elevated" hoverable>
            <Card.Header>
              <h3 className="text-xl font-semibold">Fonctionnalités</h3>
            </Card.Header>
            <Card.Body>
              <ul className="list-disc pl-5 space-y-2">
                <li>Composants réutilisables</li>
                <li>Styles modernes avec Tailwind CSS</li>
                <li>Performance optimisée avec Vite</li>
                <li>Formulaires avec validation</li>
              </ul>
            </Card.Body>
            <Card.Footer>
              <Button variant="primary">En savoir plus</Button>
            </Card.Footer>
          </Card>

          {/* Formulaire d'exemple */}
          <Card variant="outlined">
            <Card.Header>
              <h3 className="text-xl font-semibold">Formulaire d'exemple</h3>
            </Card.Header>
            <Card.Body>
              <form onSubmit={handleSubmit}>
                <Input
                  id="name"
                  name="name"
                  label="Nom"
                  placeholder="Entrez votre nom"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="Entrez votre email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />
                <div className="flex space-x-4 mt-6">
                  <Button type="submit" variant="primary">Soumettre</Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setFormData({ name: '', email: '' })
                      setErrors({})
                    }}
                  >
                    Réinitialiser
                  </Button>
                </div>
              </form>
            </Card.Body>
          </Card>
        </Layout.Grid>
      </Layout.Section>

      <Layout.Section title="Variantes de boutons">
        <Layout.Container>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primaire</Button>
            <Button variant="secondary">Secondaire</Button>
            <Button variant="outline">Contour</Button>
            <Button variant="text">Texte</Button>
            <Button variant="success">Succès</Button>
            <Button variant="warning">Avertissement</Button>
            <Button variant="error">Erreur</Button>
          </div>
        </Layout.Container>
      </Layout.Section>
    </Layout>
  )
}

export default App
