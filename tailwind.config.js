/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Palette de couleurs élégantes pour le mariage
        primary: "#8B5D33", // Doré/Cuivré élégant
        secondary: "#F5EFE6", // Beige crème doux
        accent: "#D4AF37", // Or classique
        highlight: "#FAF3E0", // Champagne léger
        muted: "#6D6875", // Gris-violet subtil
        "primary-dark": "#5E3A1C", // Version foncée du primary
        "primary-light": "#C9A66B", // Version claire du primary
        danger: "#D62828", // Rouge pour validation/annulation
        success: "#4F772D", // Vert élégant
        overlay: "rgba(0, 0, 0, 0.6)", // Pour overlays modaux
        "text-dark": "#2D2926", // Texte principal foncé
        "text-light": "#F9F9F9", // Texte clair
      },
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
        serif: ["Playfair Display", "serif"],
        cursive: ["Great Vibes", "cursive"],
        elegant: ["Cormorant Garamond", "serif"],
      },
      boxShadow: {
        soft: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        medium:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        elegant: "0 6px 16px rgba(139, 93, 51, 0.12)",
        card: "0 0 25px rgba(0, 0, 0, 0.04)",
      },
      backgroundImage: {
        "floral-pattern": "url('/src/assets/images/floral-pattern.svg')",
        "wedding-bg": "url('/src/assets/images/wedding-bg.jpg')",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-slow": "pulse 3s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
    screens: {
      xs: "375px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
}
