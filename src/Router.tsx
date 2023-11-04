import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './views/dashboard/Dashboard';
import Farm from './views/farm/Farm';
import Food from './views/food/Food';
import FoodDetail from './views/food/components/food-detail/FoodDetail';
import FoodTable from './views/food/components/food-table/FoodTable';
import Inventory from './views/inventory/Inventory';
import InventoryTable from './views/inventory/components/inventory-table/InventoryTable';

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
      <Route path="farm" element={<Farm />} />
    </Routes>
  );
};

export default Router;
