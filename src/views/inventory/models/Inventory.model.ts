import { InventoryStatus } from '..';

export class Inventory {
  key: React.Key;
  id: number;
  name: string;
  quantity: number;
  maxQuantity: number;
  unit: string;
  status: InventoryStatus;

  constructor(
    id: number,
    name: string,
    quantity: number,
    maxQuantity: number,
    unit: string,
    status: InventoryStatus,
  ) {
    this.key = id;
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.maxQuantity = maxQuantity;
    this.unit = unit;
    this.status = status;
  }
}
