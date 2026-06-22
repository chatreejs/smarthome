import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import EnvironmentPlugin from 'vite-plugin-environment';
import { VitePWA } from 'vite-plugin-pwa';
import viteTsconfigPaths from 'vite-tsconfig-paths';

// Dev-only: serve /config.js from config/web/config.<mode>.js so the runtime config can be
// swapped per command without shipping any of these files in the production build:
//   yarn start          -> mode "development" -> falls back to config/web/config.local.js
//   yarn start:develop  -> mode "develop"     -> config/web/config.develop.js
// In deployed environments config.js is injected at runtime (not built), so this plugin
// only applies to `serve` and is never part of `vite build`.
function localConfigPlugin(mode: string): Plugin {
  return {
    name: 'local-config',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = (req.url ?? '').split('?')[0];
        if (!path.endsWith('/config.js')) return next();

        const candidates = [
          `config/web/config.${mode}.js`,
          'config/web/config.local.js',
        ];
        for (const rel of candidates) {
          try {
            const body = readFileSync(resolve(process.cwd(), rel));
            res.setHeader('Content-Type', 'application/javascript');
            res.setHeader('Cache-Control', 'no-store');
            res.end(body);
            return;
          } catch {
            // file missing — try the next candidate
          }
        }
        return next();
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    outDir: 'build',
  },
  base: '/smarthome/',
  plugins: [
    react(),
    EnvironmentPlugin('all'),
    viteTsconfigPaths(),
    VitePWA(),
    localConfigPlugin(mode),
  ],
  server: {
    port: 3000,
    open: true,
  },
}));
