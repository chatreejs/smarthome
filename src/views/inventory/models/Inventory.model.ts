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
  ) {
    this.key = id;
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.maxQuantity = maxQuantity;
    this.unit = unit;
    this.status = this.getInventoryStatus(this.quantity, this.maxQuantity);
  }

  private getInventoryStatus(
    quantity: number,
    maxQuantity: number,
  ): InventoryStatus {
    if (quantity == 0) {
      return InventoryStatus.OUT_OF_STOCK;
    }
    if (quantity <= maxQuantity * 0.3) {
      return InventoryStatus.LOW_STOCK;
    }
    return InventoryStatus.IN_STOCK;
  }
}
