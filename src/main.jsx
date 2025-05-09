import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Polyfill pour les navigateurs plus anciens
import 'core-js/stable'
import 'regenerator-runtime/runtime'

/**
 * Rendu de l'application React dans l'élément root
 * Avec StrictMode activé pour détecter les problèmes potentiels
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
