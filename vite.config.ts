import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import EnvironmentPlugin from 'vite-plugin-environment';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';
import viteTsconfigPaths from 'vite-tsconfig-paths';

const manifestForPlugin: Partial<VitePWAOptions> = {
  registerType: 'prompt',
  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
  manifest: {
    name: 'Smarthome App',
    short_name: 'smarthome',
    description: 'I am a simple vite app',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'favicon',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'favicon',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'apple touch icon',
      },
      {
        src: '/maskable_icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
    theme_color: '#30D5C8',
    background_color: '#f0e7db',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    orientation: 'portrait',
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'build',
  },
  base: '/smarthome',
  plugins: [
    react(),
    EnvironmentPlugin('all'),
    viteTsconfigPaths(),
    VitePWA(manifestForPlugin),
  ],
  server: {
    port: 3000,
    open: true,
  },
});
