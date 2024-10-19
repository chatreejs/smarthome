import { App as AntApp, ConfigProvider } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { AuthContext, IAuthContext } from 'react-oauth2-code-pkce';
import { useDispatch } from 'react-redux';

import { SplashSpinner } from '@components';
import { AppRoutes as Router } from '@config';
import { AccountRequest } from '@interfaces';
import { AccountService, HomeService } from '@services';
import { setHomeConfig, setHomeId, setHomeName, setIsHasHome } from '@slices';
import { AxiosError } from 'axios';

const App: React.FC = () => {
  const { tokenData } = useContext<IAuthContext>(AuthContext);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const fetchUserInfo = useCallback(() => {
    if (tokenData) {
      AccountService.getUserInfo().subscribe({
        next: (account) => {
          dispatch(setIsHasHome(account.hasHome));
          if (account.hasHome) {
            HomeService.getAllHome().subscribe({
              next: (homes) => {
                if (homes.length > 0) {
                  setLoading(false);
                  // TODO: Implement default home selection
                  dispatch(setHomeId(homes[0].id));
                  dispatch(setHomeName(homes[0].name));
                  dispatch(
                    setHomeConfig({
                      weatherApiEndpoint:
                        process.env.VITE_APP_WEATHER_API_ENDPOINT,
                    }),
                  );
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
              username: tokenData.preferred_username as string,
              firstName: tokenData.given_name as string,
              lastName: tokenData.family_name as string,
              email: tokenData.email as string,
            };
            AccountService.createAccount(accountRequest).subscribe(); // No need to handle response
          }
          setLoading(false);
        },
      });
    }
  }, [tokenData, dispatch]);

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
