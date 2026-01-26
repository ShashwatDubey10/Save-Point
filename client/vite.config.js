import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh optimizations
      fastRefresh: true,
    }),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
    hmr: {
      clientPort: 5173,
    },
  },
  resolve: {
    // Ensure single React instance - deduplicate React and React-DOM
    dedupe: ['react', 'react-dom'],
  },
  build: {
    // Enable minification with esbuild (faster than terser)
    minify: 'esbuild',
    // Target modern browsers for smaller bundles
    target: 'esnext',
    // Chunk splitting strategy
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split vendor libraries into separate chunks
          // IMPORTANT: Keep React and React-DOM together to avoid multiple instances
          if (id.includes('node_modules')) {
            // React and React-DOM must be in the same chunk
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            // React Router can be separate but will use the same React instance
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            if (id.includes('@dnd-kit')) {
              return 'dnd-vendor';
            }
            if (id.includes('react-hot-toast') || id.includes('axios')) {
              return 'ui-vendor';
            }
            // Other node_modules go into vendor chunk
            return 'vendor';
          }
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Enable source maps for production debugging (optional, can disable for smaller builds)
    sourcemap: false,
    // Improve build performance
    reportCompressedSize: true,
    // Reduce asset inline threshold (smaller assets will be inlined)
    assetsInlineLimit: 4096,
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios'],
    // Force React to be pre-bundled to avoid multiple instances
    force: true,
  }
})
