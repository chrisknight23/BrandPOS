import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/BrandPOS/', // GitHub Pages deployment path
  server: {
    port: 3000,
    allowedHosts: [
      'a746-136-24-91-134.ngrok-free.app',
    ],
  },
  resolve: {
    alias: {
      '@components': '/src/components'
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
      },
    },
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
  },
}); 