import { ConfigProvider, Spin } from 'antd';
import React, { useContext } from 'react';
import Router from './Router';

import { Layout } from '@components';
import { AuthContext } from '@context';

const App: React.FC = () => {
  const authContext = useContext(AuthContext);

  // Show a loading screen while we are checking the authentication status.
  if (!authContext.isAuthenticated) {
    return <Spin spinning={true} tip="Loading ..." fullscreen />;
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
        <Layout>
          <Router />
        </Layout>
      </ConfigProvider>
    );
  }
};

export default App;
