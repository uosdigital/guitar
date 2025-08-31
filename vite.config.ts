import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for Electron
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    __APP_TITLE__: JSON.stringify('Corduroy'),
  },
});
