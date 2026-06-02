import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        devlink: resolve(__dirname, 'devlink.html'),
        lusion: resolve(__dirname, 'lusion.html'),
        ticketsSandbox: resolve(__dirname, 'tickets-sandbox/index.html'),
      },
    },
  },
});
