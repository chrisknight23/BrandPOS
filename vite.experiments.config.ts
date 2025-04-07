import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001  // Different port to avoid conflicts
  },
  root: './src/experiments',  // Set experiments as the root
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
  },
}); 