import { ProductType } from '@enums';

export interface Product {
  id: number;
  name: string;
  brand: string | null;
  barcode: string | null;
  unit: string | null;
  maxQuantity: number | null;
  type: ProductType;
}
