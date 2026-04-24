import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    // Warn on chunks > 500KB (default is 500KB anyway, but making it explicit)
    chunkSizeWarningLimit: 500,

    rollupOptions: {
      output: {
        // Manual chunk splitting — keeps vendor libs out of the main app bundle.
        // Each chunk loads in parallel and is individually cacheable by the browser.
        // Vite 8 / Rolldown requires manualChunks as a function
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/react-router-dom'))
            return 'vendor-react';
          if (id.includes('node_modules/framer-motion'))
            return 'vendor-motion';
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/react-icons'))
            return 'vendor-icons';
          if (id.includes('node_modules/@tanstack/react-query'))
            return 'vendor-query';
          if (id.includes('node_modules/@stripe'))
            return 'vendor-auth-payment';
          if (id.includes('node_modules/sweetalert2') || id.includes('node_modules/react-toastify'))
            return 'vendor-ui';
        },
      },
    },
  },

  // Optimise dev server: pre-bundle heavy deps so HMR stays fast
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      '@tanstack/react-query',
    ],
  },
})
