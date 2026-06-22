import '@fontsource/noto-sans-thai';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import weekday from 'dayjs/plugin/weekday';
import ReactDOM from 'react-dom/client';
import {
  AuthProvider,
  TAuthConfig,
  TRefreshTokenExpiredEvent,
} from 'react-oauth2-code-pkce';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { Config, store } from '@config';
import App from './App';
import './assets/styles/global.css';

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

const authConfig: TAuthConfig = {
  clientId: `${Config.oauth2ClientId}`,
  authorizationEndpoint: `${Config.oauth2Url}/protocol/openid-connect/auth`,
  tokenEndpoint: `${Config.oauth2Url}/protocol/openid-connect/token`,
  redirectUri: `${Config.baseUrl}`,
  logoutEndpoint: `${Config.oauth2Url}/protocol/openid-connect/logout`,
  scope: 'openid',
  onRefreshTokenExpire: (event: TRefreshTokenExpiredEvent) =>
    event.logIn(undefined, undefined, 'popup'),
  storageKeyPrefix: 'sh-',
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider authConfig={authConfig}>
    <BrowserRouter basename="/smarthome">
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </AuthProvider>,
);
