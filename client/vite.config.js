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
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
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
    // Exclude from pre-bundling to reduce initial load
    exclude: [],
  },
  // Enable experimental features for better performance
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      // Use CDN for assets in production if available
      if (hostType === 'js' && process.env.VITE_CDN_URL) {
        return `${process.env.VITE_CDN_URL}/${filename}`;
      }
      return { relative: true };
    }
  }
})
