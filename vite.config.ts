import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ['v-list-recognize-title'].includes(tag)
        }
      }
    }),
    vuetify({
      autoImport: true
    })
  ],
  resolve: {
    alias: {
      '@': '/src', // Alias pour le répertoire src
      '@images': '/assets/images', // Alias pour le répertoire des images
      'vue-i18n': 'vue-i18n/dist/vue-i18n.esm-bundler.js'
    }
  },
  css: {
    preprocessorOptions: {
      scss: {} // Options de préprocesseur SCSS
    }
  },
  build: {
    assetsInlineLimit: 0, // Augmentez cette limite si vous souhaitez inclure de plus grandes images dans le bundle
    chunkSizeWarningLimit: 1024 * 1024 // Limite de taille des chunks à 1 Mo
  },
  server: {
    // Ne spécifiez pas de chemin de surveillance pour les fichiers statiques, car ils sont déjà pris en charge par défaut
  },
  optimizeDeps: {
    exclude: ['vuetify'], // Exclure Vuetify de l'optimisation des dépendances
    entries: ['./src/**/*.vue'] // Entrées à optimiser (fichiers Vue)
  }
});
