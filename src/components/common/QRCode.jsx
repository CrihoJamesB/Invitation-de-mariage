import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import QRCodeLibrary from "qrcode.react"

/**
 * Composant QRCode qui génère un code QR avec style personnalisé
 * @param {string} value - La valeur à encoder dans le QR code (généralement une URL)
 * @param {number} size - Taille du QR code en pixels
 * @param {string} bgColor - Couleur d'arrière-plan
 * @param {string} fgColor - Couleur des modules (points) du QR code
 * @param {string} level - Niveau de correction d'erreur ('L', 'M', 'Q', 'H')
 * @param {boolean} includeMargin - Si une marge doit être incluse
 * @param {string} className - Classes CSS additionnelles
 * @param {string} logoSrc - URL de l'image du logo à inclure au centre (optionnel)
 * @param {number} logoSize - Taille du logo en pixels
 * @param {string} title - Titre à afficher au-dessus du QR code
 * @param {string} caption - Légende à afficher sous le QR code
 * @param {string} tableColor - Couleur associée à la table de l'invité
 * @param {string} id - Identifiant unique pour le canvas du QR code
 */
const QRCode = ({
  value,
  size = 200,
  bgColor = "#ffffff",
  fgColor = "#8B5D33", // Couleur primaire par défaut
  level = "H",
  includeMargin = true,
  className = "",
  logoSrc = "",
  logoSize = 50,
  title = "",
  caption = "",
  tableColor = "", // Nouvelle prop pour la couleur de la table
  id = "",
}) => {
  const [canvasRef, setCanvasRef] = useState(null)
  const [containerId] = useState(
    `qr-container-${Math.random().toString(36).substring(2, 10)}`
  )

  // Utiliser la couleur de la table si fournie
  const qrCodeColor = tableColor || fgColor

  // Fonction pour télécharger le QR code avec titre
  const downloadQRCode = () => {
    if (!canvasRef) return

    try {
      // Définir un facteur de résolution pour une meilleure qualité
      const scaleFactor = 3

      // Créer un canvas temporaire pour l'image complète avec titre
      const tempCanvas = document.createElement("canvas")
      const padding = 30 * scaleFactor // Espacement autour du QR code
      const titleHeight = title ? 60 * scaleFactor : 0 // Hauteur pour le titre

      // Définir les dimensions du canvas avec une haute résolution
      tempCanvas.width = size * scaleFactor + padding * 2
      tempCanvas.height = size * scaleFactor + padding * 2 + titleHeight

      const ctx = tempCanvas.getContext("2d")

      // Fond blanc
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)

      // Dessiner une bordure décorative
      const borderWidth = 8 * scaleFactor
      ctx.strokeStyle = qrCodeColor
      ctx.lineWidth = borderWidth
      ctx.strokeRect(
        borderWidth / 2,
        borderWidth / 2,
        tempCanvas.width - borderWidth,
        tempCanvas.height - borderWidth
      )

      // Ajouter un titre plus élégant si présent
      if (title) {
        // Titre principal
        ctx.fillStyle = qrCodeColor
        ctx.font = `bold ${24 * scaleFactor}px Arial`
        ctx.textAlign = "center"
        ctx.fillText(title, tempCanvas.width / 2, 35 * scaleFactor)

        // Sous-titre
        ctx.font = `${14 * scaleFactor}px Arial`
        ctx.fillText(
          "Invitation au mariage de Fiston & Vino",
          tempCanvas.width / 2,
          52 * scaleFactor
        )
      }

      // Dessiner le QR code avec une meilleure résolution
      const qrScale = scaleFactor
      ctx.drawImage(
        canvasRef,
        padding,
        titleHeight + padding,
        size * qrScale,
        size * qrScale
      )

      // Dessiner une déco florale autour de l'image (simple et élégant)
      ctx.fillStyle = `${qrCodeColor}50`
      const centerX = tempCanvas.width / 2
      const centerY = tempCanvas.height - 20 * scaleFactor

      // Petite déco florale en bas
      const flowerSize = 12 * scaleFactor

      // Motif simple
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2
        const x = centerX + Math.cos(angle) * flowerSize * 3
        const y = centerY + Math.sin(angle) * flowerSize * 2

        ctx.beginPath()
        ctx.arc(x, y, flowerSize, 0, Math.PI * 2)
        ctx.fill()
      }

      // Convertir en URL de données et télécharger avec haute qualité
      const dataURL = tempCanvas.toDataURL("image/png", 1.0)

      // Vérifier si on est sur un appareil mobile (pour gérer le téléchargement différemment)
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )

      if (isMobile) {
        // Sur mobile, ouvrir l'image dans un nouvel onglet pour permettre le téléchargement manuel
        const newTab = window.open()
        if (newTab) {
          newTab.document.write(`
            <html>
              <head>
                <title>QR Code - ${title || "Invitation"}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body { text-align: center; font-family: Arial; padding: 20px; }
                  img { max-width: 100%; height: auto; margin-bottom: 20px; }
                  p { color: #666; margin-bottom: 20px; }
                </style>
              </head>
              <body>
                <h2>QR Code - ${title || "Invitation"}</h2>
                <img src="${dataURL}" alt="QR Code">
                <p>Appuyez longuement sur l'image et sélectionnez "Enregistrer l'image" pour télécharger</p>
              </body>
            </html>
          `)
          newTab.document.close()
        }
      } else {
        // Sur desktop, télécharger directement
        const downloadLink = document.createElement("a")
        downloadLink.href = dataURL
        downloadLink.download = `invitation-${
          title.replace(/\s+/g, "-") || "qrcode"
        }.png`
        downloadLink.click()
      }

      // Afficher une indication de succès
      const successIndicator = document.createElement("div")
      successIndicator.style.position = "fixed"
      successIndicator.style.top = "20px"
      successIndicator.style.left = "50%"
      successIndicator.style.transform = "translateX(-50%)"
      successIndicator.style.padding = "10px 20px"
      successIndicator.style.background = "#4CAF50"
      successIndicator.style.color = "white"
      successIndicator.style.borderRadius = "4px"
      successIndicator.style.zIndex = "9999"
      successIndicator.style.opacity = "0"
      successIndicator.style.transition = "opacity 0.3s ease"
      successIndicator.textContent = isMobile
        ? "QR Code ouvert dans un nouvel onglet"
        : "QR Code téléchargé"

      document.body.appendChild(successIndicator)

      // Animation de l'indicateur
      setTimeout(() => {
        successIndicator.style.opacity = "1"
      }, 100)

      setTimeout(() => {
        successIndicator.style.opacity = "0"
        setTimeout(() => {
          document.body.removeChild(successIndicator)
        }, 300)
      }, 3000)
    } catch (error) {
      console.error("Erreur lors du téléchargement du QR code:", error)
      alert(
        "Une erreur est survenue lors du téléchargement. Veuillez réessayer."
      )
    }
  }

  // Ajouter le logo au QR code après le rendu si un logo est fourni
  useEffect(() => {
    if (canvasRef && logoSrc) {
      const canvas = canvasRef
      const ctx = canvas.getContext("2d")

      const logo = new Image()
      logo.src = logoSrc

      logo.onload = () => {
        // Position du logo au centre du QR code
        const centerX = size / 2 - logoSize / 2
        const centerY = size / 2 - logoSize / 2

        // Dessiner un cercle blanc en arrière-plan du logo
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, logoSize / 1.8, 0, 2 * Math.PI)
        ctx.fillStyle = bgColor
        ctx.fill()

        // Dessiner le logo
        ctx.drawImage(logo, centerX, centerY, logoSize, logoSize)
      }
    }
  }, [canvasRef, logoSrc, logoSize, size, bgColor])

  // Utiliser useEffect pour récupérer la référence au canvas après le rendu
  useEffect(() => {
    // On utilise un timer pour s'assurer que le QRCode est bien rendu
    const timer = setTimeout(() => {
      const qrCanvas = document.querySelector(`#${containerId} canvas`)
      if (qrCanvas) {
        setCanvasRef(qrCanvas)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [containerId])

  return (
    <div
      className={`flex flex-col items-center ${className}`}
      id={containerId}
    >
      {title && (
        <h3
          className="text-center font-elegant font-semibold text-lg mb-3"
          style={{ color: qrCodeColor }}
        >
          {title}
        </h3>
      )}

      <div
        className="bg-white p-3 rounded-xl shadow-elegant"
        style={{
          borderColor: qrCodeColor,
          borderWidth: "2px",
          borderStyle: "solid",
        }}
      >
        <QRCodeLibrary
          value={value}
          size={size}
          bgColor={bgColor}
          fgColor={qrCodeColor}
          level={level}
          includeMargin={includeMargin}
          renderAs="canvas"
          id={id || `qr-${Math.random().toString(36).substr(2, 9)}`}
        />
      </div>

      {caption && <p className="mt-2 text-muted text-sm">{caption}</p>}

      <button
        className="mt-3 px-4 py-2 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full hover:from-primary-dark hover:to-primary transition-all duration-300 flex items-center shadow-md"
        style={{ backgroundColor: qrCodeColor }}
        onClick={downloadQRCode}
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          ></path>
        </svg>
        Télécharger
      </button>
    </div>
  )
}

QRCode.propTypes = {
  value: PropTypes.string.isRequired,
  size: PropTypes.number,
  bgColor: PropTypes.string,
  fgColor: PropTypes.string,
  level: PropTypes.oneOf(["L", "M", "Q", "H"]),
  includeMargin: PropTypes.bool,
  className: PropTypes.string,
  logoSrc: PropTypes.string,
  logoSize: PropTypes.number,
  title: PropTypes.string,
  caption: PropTypes.string,
  tableColor: PropTypes.string,
  id: PropTypes.string,
}

export default QRCode
