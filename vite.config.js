import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/noticeboard-client',
  server: {
    port: 5173,
  },
});
