import React from "react";
import { Outlet } from "react-router-dom";

const Food: React.FC = () => {
  return (
    <>
      <div>Breadcrumb</div>
      <Outlet />
    </>
  );
};

export default Food;
