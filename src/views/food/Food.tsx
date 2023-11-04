import React from 'react';
import { Outlet } from 'react-router-dom';

const Food: React.FC = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default Food;
