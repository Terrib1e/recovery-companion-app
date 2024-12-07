import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/recovery-companion-app/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    // Force demo mode in production
    'import.meta.env.VITE_DEMO_MODE': JSON.stringify(true),
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'recharts'],
          ui: [
            '@radix-ui/react-slot',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-toast',
            'lucide-react'
          ]
        }
      }
    }
  },
  server: {
    port: 5173,
    open: true,
    cors: true,
  },
})