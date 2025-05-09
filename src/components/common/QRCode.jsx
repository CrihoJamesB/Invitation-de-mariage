import React, { useEffect, useState, useRef } from "react"
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
  const containerRef = useRef(null)

  // Utiliser la couleur de la table si fournie
  const qrCodeColor = tableColor || fgColor

  // Fonction pour télécharger le QR code avec titre
  const downloadQRCode = () => {
    if (!canvasRef) return

    // Créer un canvas temporaire pour l'image complète avec titre
    const tempCanvas = document.createElement("canvas")
    const padding = 20 // Espacement autour du QR code
    const titleHeight = title ? 40 : 0 // Hauteur pour le titre

    // Définir les dimensions du canvas
    tempCanvas.width = size + padding * 2
    tempCanvas.height = size + padding * 2 + titleHeight

    const ctx = tempCanvas.getContext("2d")

    // Fond blanc
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height)

    // Ajouter un titre si présent
    if (title) {
      ctx.fillStyle = qrCodeColor
      ctx.font = "bold 16px Arial"
      ctx.textAlign = "center"
      ctx.fillText(title, tempCanvas.width / 2, 25)
    }

    // Dessiner le QR code
    ctx.drawImage(canvasRef, padding, titleHeight + padding, size, size)

    // Ajouter une bordure de couleur
    ctx.strokeStyle = qrCodeColor
    ctx.lineWidth = 2
    ctx.strokeRect(5, 5, tempCanvas.width - 10, tempCanvas.height - 10)

    // Convertir en URL de données et télécharger
    const dataURL = tempCanvas.toDataURL("image/png")
    const downloadLink = document.createElement("a")
    downloadLink.href = dataURL
    downloadLink.download = `invitation-${
      title.replace(/\s+/g, "-") || "qrcode"
    }.png`
    downloadLink.click()
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

  return (
    <div
      className={`flex flex-col items-center ${className}`}
      ref={containerRef}
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
          id={id}
          value={value}
          size={size}
          bgColor={bgColor}
          fgColor={qrCodeColor}
          level={level}
          includeMargin={includeMargin}
          renderAs="canvas"
          ref={(ref) => {
            if (ref) {
              setCanvasRef(ref.firstChild)
            }
          }}
        />
      </div>

      <div className="flex items-center mt-3 gap-2">
        {caption && <p className="text-center text-sm text-muted">{caption}</p>}

        <button
          onClick={downloadQRCode}
          className="text-xs flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          style={{ color: qrCodeColor, backgroundColor: `${qrCodeColor}15` }}
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Télécharger
        </button>
      </div>
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
