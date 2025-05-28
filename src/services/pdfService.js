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

      // Créer des nuances de couleur pour le design
      const tableColorRGB = this.hexToRgb(table.color)
      const lightColor = `rgba(${tableColorRGB.r}, ${tableColorRGB.g}, ${tableColorRGB.b}, 0.1)`
      const mediumColor = `rgba(${tableColorRGB.r}, ${tableColorRGB.g}, ${tableColorRGB.b}, 0.3)`

      // Créer le contenu de la page avec l'image du QR code et un design amélioré
      container.innerHTML = `
        <div style="position: relative; overflow: hidden; width: 100%; height: 100%; background-color: #ffffff;">
          <!-- Motif décoratif en arrière-plan -->
          <div style="position: absolute; top: 0; right: 0; width: 40%; height: 30%; background-color: ${lightColor}; border-bottom-left-radius: 100%;"></div>
          <div style="position: absolute; bottom: 0; left: 0; width: 40%; height: 30%; background-color: ${lightColor}; border-top-right-radius: 100%;"></div>
          
          <!-- Contenu principal -->
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 25mm 20mm; position: relative; z-index: 1;">
            <!-- En-tête avec noms des mariés -->
            <div style="text-align: center; margin-bottom: 15mm;">
              <p style="margin: 0; font-size: 16px; color: #8B5D33; font-weight: light;">Mariage de</p>
              <p style="margin: 0; font-size: 20px; color: #5E3A1C; font-weight: bold;">${
                invitationInfo.couple.groom
              } & ${invitationInfo.couple.bride}</p>
              <p style="margin: 0; font-size: 14px; color: #8B5D33;">${
                invitationInfo.event.date
              }</p>
            </div>
            
            <!-- Titre de la table avec design élégant -->
            <div style="text-align: center; margin-bottom: 15mm; position: relative;">
              <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 140%; height: 0.5mm; background-color: ${mediumColor};"></div>
              <h1 style="font-size: 60px; color: ${
                table.color
              }; margin: 0; font-weight: bold; text-align: center; position: relative; display: inline-block; background-color: white; padding: 0 15mm;">Table ${
        table.name
      }</h1>
            </div>
            
            <!-- QR Code avec design amélioré -->
            <div style="margin-bottom: 15mm; padding: 10px; background-color: white; border-radius: 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: 4px solid ${
              table.color
            };">
              <div style="position: relative;">
                <img src="${qrCodeDataURL}" alt="QR Code Table ${
        table.name
      }" style="width: 200px; height: 200px; display: block;" />
                <div style="position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); background-color: ${
                  table.color
                }; color: white; font-size: 12px; padding: 2px 10px; border-radius: 10px; white-space: nowrap;">Scannez-moi</div>
              </div>
            </div>
            
            <!-- Liste des invités avec design amélioré -->
            <div style="color: ${
              table.color
            }; font-size: 16px; text-align: center; width: 100%;">
              <p style="margin-bottom: 8mm; font-size: 20px; font-weight: bold; position: relative; display: inline-block;">
                <span style="position: relative; z-index: 1;">Invités à cette table</span>
                <span style="position: absolute; bottom: -3px; left: 0; width: 100%; height: 0.8mm; background-color: ${mediumColor}; z-index: 0;"></span>
              </p>
              
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 5mm; max-width: 90%; margin: 0 auto;">
                ${table.invites
                  .map(
                    (invite) => `
                  <div style="background-color: ${lightColor}; padding: 8px 12px; border-radius: 8px; text-align: left; border-left: 3px solid ${
                      table.color
                    };">
                    <p style="margin: 0; font-weight: bold; color: #5E3A1C;">${
                      invite.name
                    }</p>
                    <p style="margin: 0; font-size: 14px; color: #6D6875;">${
                      invite.count > 1
                        ? `${invite.count} personnes`
                        : "1 personne"
                    }</p>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
            
            <!-- Pied de page -->
            <div style="position: absolute; bottom: 15mm; left: 0; width: 100%; text-align: center;">
              <p style="font-size: 12px; color: #6D6875;">
                Nous vous remercions de votre présence pour célébrer notre union
              </p>
            </div>
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
  
  /**
   * Convertit une couleur hexadécimale en valeurs RGB
   * @param {string} hex Code hexadécimal de la couleur (ex: #FF0000)
   * @returns {Object} Objet contenant les valeurs r, g, b
   */
  hexToRgb(hex) {
    // Supprimer le # si présent
    hex = hex.replace(/^#/, '');
    
    // Convertir en valeurs RGB
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    
    return { r, g, b };
  }
}

export default pdfService
