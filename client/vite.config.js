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
    // Target modern browsers but ensure compatibility
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
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
        // Optimize chunk file names - ensure proper format for deployment
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[ext]/[name]-[hash][extname]`;
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Disable source maps for production (smaller builds)
    sourcemap: false,
    // Improve build performance
    reportCompressedSize: true,
    // Reduce asset inline threshold (smaller assets will be inlined)
    assetsInlineLimit: 4096,
    // Ensure proper output directory structure
    outDir: 'dist',
    emptyOutDir: true,
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios'],
    // Only force in development to avoid deployment issues
    force: process.env.NODE_ENV === 'development',
  }
})
