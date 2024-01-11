import { FoodStatus } from '@models';

export interface Food {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  buyDate: Date;
  expiryDate: Date;
  status: FoodStatus;
}
