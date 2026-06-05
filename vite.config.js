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
        devlink2: resolve(__dirname, 'devlink-2.html'),
        lusion: resolve(__dirname, 'lusion.html'),
        ticketsSandbox: resolve(__dirname, 'tickets-sandbox/index.html'),
        overwhelming: resolve(__dirname, 'overwhelming.html'),
      },
    },
  },
});
