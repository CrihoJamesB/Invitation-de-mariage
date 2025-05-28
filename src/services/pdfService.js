import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { invitationInfo } from "../data/invitationInfo"
import qrCodeGenerator from "../utils/qrCodeGenerator"

/**
 * Service pour la génération de PDF des tables avec QR codes
 */
const pdfService = {
  /**
   * Génère un PDF contenant une page par table avec QR code et liste des invités
   * @returns {Promise<Blob>} Le fichier PDF généré
   */
  async generateTablesPDF() {
    try {
      // Créer un nouveau document PDF en orientation paysage
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      })

      // Dimensions de la page A4 en paysage
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      // Parcourir toutes les tables
      for (let i = 0; i < invitationInfo.tables.length; i++) {
        // Ajouter une nouvelle page sauf pour la première table
        if (i > 0) {
          pdf.addPage()
        }

        const table = invitationInfo.tables[i]

        // Générer le contenu HTML pour la page
        const content = await this.renderTablePage(table, i)

        // Convertir le contenu HTML en canvas
        const canvas = await html2canvas(content, {
          scale: 2, // Meilleure qualité
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        })

        // Ajouter l'image du canvas au PDF
        const imgData = canvas.toDataURL("image/png")
        pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight)

        // Supprimer l'élément du DOM après l'avoir capturé
        document.body.removeChild(content)
      }

      // Retourner le PDF sous forme de Blob
      return pdf.output("blob")
    } catch (error) {
      console.error("Erreur lors de la génération du PDF:", error)
      throw error
    }
  },

  /**
   * Rend le contenu HTML d'une page de table
   * @param {Object} table Les informations de la table
   * @param {Number} index L'index de la table
   * @returns {HTMLElement} L'élément HTML contenant la page
   */
  async renderTablePage(table, index) {
    // Créer un conteneur pour la page
    const container = document.createElement("div")
    container.id = `table-page-${index}`
    container.style.width = "297mm" // Largeur A4 paysage
    container.style.height = "210mm" // Hauteur A4 paysage
    container.style.position = "absolute"
    container.style.left = "-9999px" // Hors écran
    container.style.backgroundColor = "#ffffff"
    container.style.fontFamily = "'Montserrat', sans-serif"
    document.body.appendChild(container)

    // Contenu du QR code: URL vers la page dédiée à la table
    const qrCodeContent = `${window.location.origin}/table/${table.name
      .toLowerCase()
      .replace(/\s+/g, "-")}`

    try {
      // Générer le QR code en tant que Data URL
      const qrCodeDataURL = await qrCodeGenerator.generateQRCodeDataURL(
        qrCodeContent,
        {
          color: {
            dark: table.color,
            light: "#FFFFFF",
          },
        }
      )

      // Créer le contenu de la page avec l'image du QR code
      container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20mm;">
          <!-- Titre de la table -->
          <h1 style="font-size: 60px; color: ${
            table.color
          }; margin-bottom: 15mm; font-weight: bold; text-align: center;">Table ${
        table.name
      }</h1>
          
          <!-- QR Code -->
          <div style="margin-bottom: 15mm; padding: 10px; background-color: white; border-radius: 10px; border: 4px solid ${
            table.color
          };">
            <img src="${qrCodeDataURL}" alt="QR Code Table ${
        table.name
      }" style="width: 200px; height: 200px;" />
          </div>
          
          <!-- Liste des invités -->
          <div style="color: ${
            table.color
          }; font-size: 16px; text-align: center;">
            <p style="margin-bottom: 5mm; font-size: 18px; font-weight: bold;">Invités à cette table:</p>
            <ul style="list-style: none; padding: 0; margin: 0; columns: 2;">
              ${table.invites
                .map(
                  (invite) =>
                    `<li style="margin-bottom: 3mm;">${invite.name} (${invite.count})</li>`
                )
                .join("")}
            </ul>
          </div>
        </div>
      `
    } catch (error) {
      console.error("Erreur lors de la génération du QR code:", error)

      // Version de fallback sans QR code
      container.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20mm;">
          <!-- Titre de la table -->
          <h1 style="font-size: 60px; color: ${
            table.color
          }; margin-bottom: 15mm; font-weight: bold; text-align: center;">Table ${
        table.name
      }</h1>
          
          <!-- Fallback au lieu du QR Code -->
          <div style="margin-bottom: 15mm; padding: 10px; background-color: white; border-radius: 10px; border: 4px solid ${
            table.color
          };">
            <div style="width: 200px; height: 200px; display: flex; align-items: center; justify-content: center; background-color: #f8f8f8; color: ${
              table.color
            }; font-size: 14px; text-align: center;">
              <p>QR Code non disponible</p>
            </div>
          </div>
          
          <!-- Liste des invités -->
          <div style="color: ${
            table.color
          }; font-size: 16px; text-align: center;">
            <p style="margin-bottom: 5mm; font-size: 18px; font-weight: bold;">Invités à cette table:</p>
            <ul style="list-style: none; padding: 0; margin: 0; columns: 2;">
              ${table.invites
                .map(
                  (invite) =>
                    `<li style="margin-bottom: 3mm;">${invite.name} (${invite.count})</li>`
                )
                .join("")}
            </ul>
          </div>
        </div>
      `
    }

    // Attendre que tout soit rendu
    await new Promise((resolve) => setTimeout(resolve, 500))

    return container
  },
}

export default pdfService
