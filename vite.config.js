import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimisation du build
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Séparation des chunks pour optimiser le chargement
          vendor: ["react", "react-dom"],
        },
      },
    },
    // Génération de sourcemaps pour production
    sourcemap: false,
    // Configuration pour le déploiement
    outDir: "dist",
    assetsDir: "assets",
    // Assurer que les dépendances sont correctement bundlées
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  server: {
    // Optimisation du serveur de développement
    hmr: true,
    port: 5173, // Port par défaut pour Vite
    host: true, // Nécessaire pour les plateformes de déploiement
  },
})
