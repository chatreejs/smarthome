import React from 'react';
import Router from './Router';
import Layout from './components/layout/Layout';

const App: React.FC = () => {
  return (
    <Layout>
      <Router />
    </Layout>
  );
};

export default App;
