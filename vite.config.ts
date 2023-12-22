import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import EnvironmentPlugin from 'vite-plugin-environment';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: 'build',
  },
  base: '/smarthome',
  plugins: [react(), EnvironmentPlugin('all'), viteTsconfigPaths()],
  server: {
    port: 3000,
    open: true,
  },
});
