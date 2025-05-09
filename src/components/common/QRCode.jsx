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
 */
const QRCode = ({
  value,
  size = 200,
  bgColor = "#ffffff",
  fgColor = "#8B5D33", // Couleur primaire de notre thème
  level = "H",
  includeMargin = true,
  className = "",
  logoSrc = "",
  logoSize = 50,
  title = "",
  caption = "",
}) => {
  const [canvasRef, setCanvasRef] = useState(null)

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
    <div className={`flex flex-col items-center ${className}`}>
      {title && (
        <h3 className="text-center font-elegant font-semibold text-lg mb-3 text-primary">
          {title}
        </h3>
      )}

      <div className="bg-white p-3 rounded-xl shadow-elegant">
        <QRCodeLibrary
          value={value}
          size={size}
          bgColor={bgColor}
          fgColor={fgColor}
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

      {caption && (
        <p className="text-center text-sm text-muted mt-3">{caption}</p>
      )}
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
}

export default QRCode
