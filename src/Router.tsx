import { Navigate, Route, Routes } from 'react-router-dom';

import Dashboard from './views/dashboard/Dashboard';
import Farm from './views/farm/Farm';
import FarmDashboard from './views/farm/components/farm-dashboard/FarmDashboard';
import Food from './views/food/Food';
import FoodDetail from './views/food/components/food-detail/FoodDetail';
import FoodTable from './views/food/components/food-table/FoodTable';
import Inventory from './views/inventory/Inventory';
import InventoryTable from './views/inventory/components/inventory-table/InventoryTable';
import Warranty from './views/warranty/Warranty';
import WarrantyDetail from './views/warranty/components/warranty-detail/WarrantyDetail';
import WarrantyTable from './views/warranty/components/warranty-table/WarrantyTable';

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
      <Route path="farm" element={<Farm />}>
        <Route index element={<FarmDashboard />} />
      </Route>
    </Routes>
  );
};

export default Router;
