import { defineConfig } from 'vite'

// Identificador de build, para poder comprobar desde producción que el
// navegador está ejecutando el código que creemos haber desplegado.
const BUILD_ID = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)

export default defineConfig({
  define: { __BUILD_ID__: JSON.stringify(BUILD_ID) },
  build: {
    target: 'es2020',
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        manualChunks: { gsap: ['gsap'] },
      },
    },
  },
})
