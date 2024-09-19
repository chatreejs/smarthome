import { App as AntApp, ConfigProvider } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext, IAuthContext } from 'react-oauth2-code-pkce';
import Router from './config/routes';

import { SplashSpinner } from '@components';
import { useBrowserStorage } from '@hooks';
import { AccountRequest } from '@models';
import { AccountService, HomeService } from '@services';
import { AxiosError } from 'axios';

const App: React.FC = () => {
  const { token, tokenData } = useContext<IAuthContext>(AuthContext);
  const [isHasHome, setIsHasHome] = useBrowserStorage<boolean | undefined>(
    'sh-hashome',
    undefined,
    'local',
  );
  const [homeId, setHomeId] = useBrowserStorage<number | undefined>(
    'sh-current-homeid',
    undefined,
    'local',
  );
  const [loading, setLoading] = useState(true);

  const fetchUserInfo = useCallback(() => {
    if (!token && !tokenData) return;
    AccountService.getUserInfo().subscribe({
      next: (account) => {
        setIsHasHome(account.hasHome);
        setLoading(false);
        if (account.hasHome || isHasHome) {
          HomeService.getAllHome().subscribe({
            next: (homes) => {
              if (!homeId && homes.length > 0) {
                setHomeId(homes[0].id);
              }
            },
            error: () => {
              console.error('Error when get all home');
            },
          });
        }
      },
      error: (error: AxiosError<unknown>) => {
        if (error.response?.status === 404) {
          // Create new account from token data
          const accountRequest: AccountRequest = {
            username: tokenData!.preferred_username as string,
            firstName: tokenData!.given_name as string,
            lastName: tokenData!.family_name as string,
            email: tokenData!.email as string,
          };
          AccountService.createAccount(accountRequest).subscribe(); // No need to handle response
        }
        setLoading(false);
      },
    });
  }, [token, tokenData, isHasHome, homeId, setHomeId, setIsHasHome]);

  useEffect(() => {
    fetchUserInfo();
  }, [fetchUserInfo]);

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
            fontFamily: 'Sarabun',
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
