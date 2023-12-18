import { Navigate, Route, Routes } from 'react-router-dom';

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

const Router = () => {
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
    </Routes>
  );
};

export default Router;
