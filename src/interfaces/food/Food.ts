import { FoodStatus } from '@enums';

export interface Food {
  id: number;
  name: string;
  brand: string;
  quantity: number;
  unit: string;
  buyDate: Date;
  expiryDate: Date;
  status: FoodStatus;
  updateBy: string;
  updateDate: Date;
}
