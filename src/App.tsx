import { App as AntApp, ConfigProvider } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, IAuthContext } from 'react-oauth2-code-pkce';
import Router from './config/routes';

import { SplashSpinner } from '@components';
import { useBrowserStorage } from '@hooks';
import { AccountRequest } from '@models';
import { AccountService, HomeService } from '@services';

const App: React.FC = () => {
  const { token, tokenData, logIn, error } =
    useContext<IAuthContext>(AuthContext);
  const [isHasHome, setIsHasHome] = useBrowserStorage<boolean>(
    'sh-hashome',
    null,
    'local',
  );
  const [homeId, setHomeId] = useBrowserStorage<number>(
    'sh-current-homeid',
    null,
    'local',
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (error) {
      logIn();
    }
  }, [error]);

  useEffect(() => {
    if (!token) return;
    AccountService.getUserInfo().subscribe({
      next: (account) => {
        setIsHasHome(account.hasHome);
        setLoading(false);
        if (account.hasHome) {
          HomeService.getAllHome().subscribe({
            next: (homes) => {
              if (!homeId && homes.length > 0) {
                setHomeId(homes[0].id);
              }
            },
            error: (error) => {},
          });
        }
      },
      error: (error) => {
        if (error.response.status === 404) {
          // Create new account from token data
          const accountRequest: AccountRequest = {
            username: tokenData.preferred_username,
            firstName: tokenData.given_name,
            lastName: tokenData.family_name,
            email: tokenData.email,
          };
          AccountService.createAccount(accountRequest).subscribe((res) => {}); // No need to handle response
        }
        setLoading(false);
      },
    });
  }, [token, tokenData]);

  // Show a loading screen while we are checking the authentication status.
  if (loading || !tokenData) {
    return <SplashSpinner />;
  } else {
    // If the user is authenticated we render the application.
    return (
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#30D5C8',
            colorLink: '#30D5C8',
            colorLinkHover: '#82E8E0',
            fontFamily: 'Kanit',
          },
        }}
      >
        <AntApp>
          <Router />
        </AntApp>
      </ConfigProvider>
    );
  }
};

export default App;
