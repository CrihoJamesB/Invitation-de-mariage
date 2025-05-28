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
  const [success, setSuccess] = useState(false)

  /**
   * Génère le PDF des tables et le télécharge
   */
  const handleGeneratePdf = async () => {
    setGenerating(true)
    setError(null)
    setSuccess(false)

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

      // Afficher un message de succès
      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
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
        <div className="bg-white/50 p-4 rounded-lg border border-primary/20 shadow-soft transition-all hover:shadow-medium">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-primary/10 p-2.5 rounded-full">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-elegant text-lg text-primary-dark">
                Plan de tables avec QR codes
              </h3>
              <p className="text-xs text-muted">
                {invitationInfo.tables.length} tables | Format PDF | A4 Paysage
              </p>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-primary/70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-muted">Contenu du PDF:</p>
            </div>
            <ul className="text-xs text-muted list-disc ml-6 space-y-1">
              <li>Une page par table ({invitationInfo.tables.length} pages)</li>
              <li>Nom de la table en grand et en couleur (Police taille 60)</li>
              <li>QR code unique scannable avec appareil photo</li>
              <li>Liste des invités pour chaque table</li>
              <li>Design personnalisé aux couleurs des tables</li>
            </ul>
          </div>

          <Button
            variant="primary"
            onClick={handleGeneratePdf}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 py-2.5 font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98]"
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
                <span>Génération en cours...</span>
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
                <span>Générer et télécharger le PDF</span>
              </>
            )}
          </Button>

          {error && (
            <div className="mt-3 bg-danger/10 text-danger text-sm p-3 rounded-md flex items-start">
              <svg
                className="w-5 h-5 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}

          {success && (
            <div className="mt-3 bg-success/10 text-success text-sm p-3 rounded-md flex items-start animate-fade-in">
              <svg
                className="w-5 h-5 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              PDF généré avec succès! Le téléchargement a démarré.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

TablesPdfGenerator.propTypes = {
  className: PropTypes.string,
}

export default TablesPdfGenerator
