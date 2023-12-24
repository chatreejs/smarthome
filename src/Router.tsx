import { Navigate, Route, Routes } from 'react-router-dom';

import { AuthContext } from '@context';
import {
  Dashboard,
  Farm,
  FarmDashboard,
  Food,
  FoodDetail,
  FoodTable,
  Inventory,
  InventoryTable,
  Warranty,
  WarrantyDetail,
  WarrantyTable,
} from '@views';
import { useContext } from 'react';
import PageResult from './components/page-result/PageResult';

const Router = () => {
  const authContext = useContext(AuthContext);

  return (
    <Routes>
      <Route index element={<Navigate to="dashboard" />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="food" element={<Food />}>
        <Route index element={<FoodTable />} />
        <Route path="new" element={<FoodDetail />} />
        <Route path=":foodId" element={<FoodDetail />} />
      </Route>
      <Route path="inventory" element={<Inventory />}>
        <Route index element={<InventoryTable />} />
      </Route>
      <Route path="warranty" element={<Warranty />}>
        <Route index element={<WarrantyTable />} />
        <Route path="new" element={<WarrantyDetail />} />
        <Route path=":warrantyId" element={<WarrantyDetail />} />
      </Route>
      <Route path="smartfarm" element={<Farm />}>
        <Route index element={<FarmDashboard />} />
      </Route>
      <Route
        path="setting"
        element={
          authContext.hasRole('admin') ? (
            <Dashboard />
          ) : (
            <PageResult status="403" />
          )
        }
      />
    </Routes>
  );
};

export default Router;
