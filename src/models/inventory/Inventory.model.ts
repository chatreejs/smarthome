import { InventoryStatus } from '@models';

export interface Inventory {
  id: number;
  name: string;
  brand: string;
  quantity: number;
  maxQuantity: number;
  unit: string;
  status: InventoryStatus;
  restockDate: Date;
}
