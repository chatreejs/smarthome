import { FoodStatus } from '..';

export class Food {
  key: React.Key;
  id: number;
  name: string;
  quantity: number;
  unit: string;
  buyDate: Date;
  expiryDate: Date;
  status: FoodStatus;

  constructor(
    id: number,
    name: string,
    quantity: number,
    unit: string,
    buyDate: Date,
    expiryDate: Date,
    status: FoodStatus,
  ) {
    this.key = id;
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.unit = unit;
    this.buyDate = new Date(buyDate);
    this.expiryDate = new Date(expiryDate);
    this.status = status;
  }
}
