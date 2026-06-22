// Local dev config — served at /config.js by the Vite dev server for `yarn start`.
// DEV ONLY: this file is never included in the production build (deploy injects its own config.js).
globalThis.__CONFIG__ = {
  env: 'local',
  baseUrl: 'http://localhost:3000',
  baseApiUrl: 'http://localhost:8080',
  oauth2Url: 'https://example.com/oauth2',
  oauth2ClientId: 'your-client-id',
};
