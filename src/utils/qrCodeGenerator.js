import QRCode from "qrcode";

/**
 * Utilitaire pour générer des QR codes
 */
const qrCodeGenerator = {
  /**
   * Génère un QR code et le retourne sous forme de Data URL
   * @param {string} text - Le texte à encoder dans le QR code
   * @param {Object} options - Options de génération du QR code
   * @returns {Promise<string>} Data URL de l'image du QR code
   */
  async generateQRCodeDataURL(text, options = {}) {
    try {
      // Options par défaut
      const defaultOptions = {
        width: 200,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: "H",
      };

      // Fusionner les options par défaut avec les options fournies
      const mergedOptions = { ...defaultOptions, ...options };

      // Générer le QR code en tant que Data URL
      return await QRCode.toDataURL(text, mergedOptions);
    } catch (error) {
      console.error("Erreur lors de la génération du QR code:", error);
      throw error;
    }
  }
};

export default qrCodeGenerator; 