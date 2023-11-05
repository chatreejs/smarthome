import { Layout } from '@components';
import React from 'react';
import Router from './Router';

const App: React.FC = () => {
  return (
    <Layout>
      <Router />
    </Layout>
  );
};

export default App;
