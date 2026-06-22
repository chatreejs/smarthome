export interface AppConfig {
  env: string;
  baseUrl: string;
  baseApiUrl: string;
  oauth2Url: string;
  oauth2ClientId: string;
}

declare global {
  // eslint-disable-next-line no-var
  var __CONFIG__: AppConfig;
}

const Config: AppConfig = globalThis.__CONFIG__;

export default Config;
