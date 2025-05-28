import { useState } from "react"
import Button from "../common/Button"
import pdfService from "../../services/pdfService"
import { invitationInfo } from "../../data/invitationInfo"
import PropTypes from "prop-types"

/**
 * Composant permettant de générer un PDF contenant les tables avec QR codes
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.className - Classes CSS additionnelles
 */
const TablesPdfGenerator = ({ className = "" }) => {
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Génère le PDF des tables et le télécharge
   */
  const handleGeneratePdf = async () => {
    setGenerating(true)
    setError(null)

    try {
      // Générer le PDF avec le service
      const pdfBlob = await pdfService.generateTablesPDF()

      // Créer un URL pour le téléchargement
      const pdfUrl = URL.createObjectURL(pdfBlob)

      // Créer un lien de téléchargement et le déclencher
      const downloadLink = document.createElement("a")
      downloadLink.href = pdfUrl
      downloadLink.download = `tables-mariage-${
        invitationInfo.couple.groom.split(" ")[0]
      }-${invitationInfo.couple.bride.split(" ")[0]}.pdf`
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)

      // Libérer l'URL
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 100)
    } catch (err) {
      console.error("Erreur lors de la génération du PDF:", err)
      setError(
        "Une erreur est survenue lors de la génération du PDF. Veuillez réessayer."
      )
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className={className}>
      <div className="flex flex-col gap-3">
        <Button
          variant="primary"
          onClick={handleGeneratePdf}
          disabled={generating}
          className="flex items-center justify-center gap-2"
        >
          {generating ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Génération en cours...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
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
              Générer PDF des tables avec QR codes
            </>
          )}
        </Button>

        {error && <div className="text-danger text-sm mt-1">{error}</div>}

        <div className="text-sm text-muted">
          <p>
            Ce PDF contient {invitationInfo.tables.length} pages, une pour
            chaque table.
          </p>
          <p>
            Chaque page comprend le nom de la table, un QR code unique et la
            liste des invités.
          </p>
        </div>
      </div>
    </div>
  )
}

TablesPdfGenerator.propTypes = {
  className: PropTypes.string,
}

export default TablesPdfGenerator
