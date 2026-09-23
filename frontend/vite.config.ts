import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Frontend snakker aldri med AI-gatewayen direkte — alt går via backend.
      '/api': 'http://localhost:4000',
    },
  },
});
