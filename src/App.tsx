import { Layout } from '@components';
import { ConfigProvider } from 'antd';
import React from 'react';
import Router from './Router';

const App: React.FC = () => {
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
};

export default App;
