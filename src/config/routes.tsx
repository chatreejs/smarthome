import { Navigate, Route, Routes } from 'react-router-dom';

import { Layout, PageResult } from '@components';
import {
  Dashboard,
  Electricity,
  Food,
  FoodDetail,
  FoodTable,
  HomeSetup,
  Inventory,
  InventoryDetail,
  InventoryTable,
  Setting,
  Warranty,
  WarrantyDetail,
  WarrantyTable,
  Waterworks,
  WaterworksDetail,
  WaterworksSummary,
} from '@views';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="electricity" element={<Electricity />} />
        <Route path="waterworks" element={<Waterworks />}>
          <Route index element={<WaterworksSummary />} />
          <Route path="new" element={<WaterworksDetail />} />
          <Route path=":waterworksId" element={<WaterworksDetail />} />
        </Route>
        <Route path="food" element={<Food />}>
          <Route index element={<FoodTable />} />
          <Route path="new" element={<FoodDetail />} />
          <Route path=":foodId" element={<FoodDetail />} />
        </Route>
        <Route path="inventory" element={<Inventory />}>
          <Route index element={<InventoryTable />} />
          <Route path="new" element={<InventoryDetail />} />
          <Route path=":inventoryId" element={<InventoryDetail />} />
        </Route>
        <Route path="electric-appliances" element={<Warranty />}>
          <Route index element={<WarrantyTable />} />
          <Route path="new" element={<WarrantyDetail />} />
          <Route path=":electricApplianceId" element={<WarrantyDetail />} />
        </Route>
        <Route path="setting" element={<Setting />}>
          <Route index element={<Setting />} />
        </Route>
        <Route path="*" element={<PageResult status="500" />} />
      </Route>
      <Route path="initial-setup" element={<HomeSetup />} />
      <Route path="*" element={<Navigate to="initial-setup" />} />
    </Routes>
  );
};

export default AppRoutes;
