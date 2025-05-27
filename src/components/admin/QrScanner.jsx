import React, { useState, useEffect } from "react"
import { Html5Qrcode } from "html5-qrcode"
import PropTypes from "prop-types"

/**
 * Composant de scanner QR code
 * @param {function} onScanSuccess - Fonction appelée quand un QR code est détecté avec succès
 * @param {boolean} isActive - Si le scanner est actif
 */
const QRScanner = ({ onScanSuccess, isActive = true }) => {
  const [scanner, setScanner] = useState(null)
  const qrboxSize = 250
  const qrId = "qr-reader"

  // Configuration du scanner
  useEffect(() => {
    // Ne créer l'instance du scanner que s'il n'existe pas déjà
    if (!scanner && isActive) {
      const html5QrCode = new Html5Qrcode(qrId)
      setScanner(html5QrCode)
    }

    return () => {
      // Nettoyer le scanner quand le composant est démonté
      if (scanner && scanner.isScanning) {
        scanner
          .stop()
          .catch((err) =>
            console.error("Erreur lors de l'arrêt du scanner:", err)
          )
      }
    }
  }, [scanner, isActive])

  // Démarre ou arrête le scanner en fonction de isActive
  useEffect(() => {
    if (!scanner) return

    if (isActive && !scanner.isScanning) {
      // Configurer et démarrer le scanner
      const config = {
        fps: 10,
        qrbox: { width: qrboxSize, height: qrboxSize },
        aspectRatio: 1.0,
      }

      scanner
        .start(
          { facingMode: "environment" }, // Utiliser la caméra arrière pour mobile
          config,
          (decodedText) => {
            // Succès du scan
            if (onScanSuccess) {
              onScanSuccess(decodedText)
            }
          },
          (errorMessage) => {
            // Erreur silencieuse lors du scan (normal pendant la recherche de QR)
            console.debug(`Scan en cours: ${errorMessage}`)
          }
        )
        .catch((err) => {
          console.error("Erreur lors du démarrage du scanner:", err)
        })
    } else if (!isActive && scanner.isScanning) {
      // Arrêter le scanner si isActive devient false
      scanner.stop().catch((err) => {
        console.error("Erreur lors de l'arrêt du scanner:", err)
      })
    }
  }, [scanner, isActive, onScanSuccess, qrboxSize])

  return (
    <div className="qr-scanner-container">
      <div className="scanner-overlay">
        <div
          id={qrId}
          className="scanner-view"
          style={{ width: "100%", minHeight: "300px" }}
        ></div>
      </div>
      <div className="scanner-instructions">
        <p className="text-center text-sm text-muted mt-2">
          Placez le QR code de l&apos;invité dans le cadre pour scanner
        </p>
      </div>
    </div>
  )
}

QRScanner.propTypes = {
  onScanSuccess: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
}

export default QRScanner
