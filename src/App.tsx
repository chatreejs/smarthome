import { App as AntApp, ConfigProvider } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import Router from './config/routes';

import { SplashSpinner } from '@components';
import { AuthContext } from '@context';
import { useBrowserStorage } from '@hooks';
import { AccountRequest } from '@models';
import { AccountService, HomeService } from '@services';

const App: React.FC = () => {
  const authContext = useContext(AuthContext);
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
    if (!authContext.isAuthenticated || !authContext.userProfile) return;
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
          // Create new account from authContext
          const accountRequest: AccountRequest = {
            username: authContext.userProfile.username,
            firstName: authContext.userProfile.firstName,
            lastName: authContext.userProfile.lastName,
            email: authContext.userProfile.email,
          };
          AccountService.createAccount(accountRequest).subscribe((res) => {}); // No need to handle response
        }
        setLoading(false);
      },
    });
  }, [authContext.userProfile]);

  // Show a loading screen while we are checking the authentication status.
  if (loading || !authContext.isAuthenticated) {
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
