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
        manualChunks: {
          // React runtime — changes very rarely, perfect for long-term caching
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],

          // Animation — large library, only needed on animated pages
          'vendor-motion': ['framer-motion'],

          // Icons — split from core so changing icons doesn't bust the react cache
          'vendor-icons': ['lucide-react', 'react-icons'],

          // Data fetching + state
          'vendor-query': ['@tanstack/react-query'],

          // Auth + payments
          'vendor-auth-payment': ['@stripe/react-stripe-js', '@stripe/stripe-js'],

          // UI utilities
          'vendor-ui': ['sweetalert2', 'react-toastify'],
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
