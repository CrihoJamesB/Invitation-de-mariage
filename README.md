# Structure du projet d'invitation de mariage

## Organisation des fichiers

wedding-invitation-app/
├── src/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── background.jpg
│   │   │   ├── couple.jpg
│   │   │   ├── flowers.svg
│   │   │   └── venue.jpg
│   │   └── fonts/
│   │       └── [polices élégantes]
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── QRCode.jsx
│   │   ├── invitation/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── DetailSection.jsx
│   │   │   ├── ProgramSection.jsx
│   │   │   ├── LocationSection.jsx
│   │   │   └── WelcomeMessage.jsx
│   │   └── admin/
│   │       ├── GuestItem.jsx
│   │       ├── GuestList.jsx
│   │       ├── GuestGroup.jsx
│   │       ├── SearchBar.jsx
│   │       └── ShareButton.jsx
│   ├── pages/
│   │   ├── Invitation.jsx
│   │   ├── GuestManagement.jsx
│   │   ├── QRGenerator.jsx
│   │   └── NotFound.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── guestService.js
│   │   └── qrCodeService.js
│   ├── hooks/
│   │   ├── useGuests.js
│   │   └── useQRCode.js
│   ├── utils/
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── context/
│   │   └── GuestContext.jsx
│   ├── data/
│   │   └── guests.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
│   ├── favicon.ico
│   └── robots.txt


Plan pour votre application d'invitation de mariage
Je comprends votre besoin de créer une application d'invitation personnalisée pour le mariage de Fiston Zaka et Vino Banza. Voici un plan bien structuré pour vous aider à réaliser ce projet avec React, Vite et Tailwind CSS, en suivant une approche "mobile first".
Structure du projet
Le projet sera décomposé en plusieurs composants principaux:

Page d'invitation personnalisée - Design élégant et responsive
Interface de gestion des invités - Pour générer et partager les QR codes
Générateur de QR codes - Pour créer des liens d'invitation personnalisés
Base de données des invités - Pour stocker les informations des invités

Étapes de développement
1. Configuration du projet

Installer les dépendances (Vite, React, Tailwind CSS)
Configurer le routage pour les invitations personnalisées
Mettre en place une stratégie de gestion d'état (Context API ou Redux)

2. Développement de l'interface d'invitation

Créer un design moderne et élégant
Implémenter une mise en page responsive (mobile first)
Ajouter des animations fluides

3. Système de gestion des invités

Interface pour visualiser la liste des invités
Fonctionnalité de génération de QR codes
Option de partage des invitations via WhatsApp

4. Développement du générateur de QR codes

Implémentation de la génération dynamique des QR codes
Liaison des QR codes à des URLs personnalisées

5. Optimisation des performances

Optimisation pour mobile (80% des utilisateurs)
Chargement rapide des pages
Minimisation des ressources

Commençons par créer le squelette de l'application et la page d'invitation en React et Tailwind CSS.