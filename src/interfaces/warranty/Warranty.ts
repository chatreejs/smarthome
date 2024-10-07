import { WarrantyStatus } from '@enums';

export interface Warranty {
  id: number;
  brand: string;
  productName: string;
  productNumber: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyDate: string;
  status: WarrantyStatus;
}
