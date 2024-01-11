import { App as AntApp, ConfigProvider } from 'antd';
import React, { useContext } from 'react';
import Router from './config/routes';

import { SplashSpinner } from '@components';
import { AuthContext } from '@context';

const App: React.FC = () => {
  const authContext = useContext(AuthContext);

  // Show a loading screen while we are checking the authentication status.
  if (!authContext.isAuthenticated) {
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
