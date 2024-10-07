import { InventoryStatus } from '@enums';

export interface Inventory {
  id: number;
  name: string;
  brand: string;
  quantity: number;
  maxQuantity: number;
  unit: string;
  status: InventoryStatus;
  restockDate: Date;
  updateBy: string;
  updateDate: Date;
}
