import { WarrantyStatus } from '@models';

export interface Warranty {
  id: number;
  brand: string;
  productName: string;
  productNumber: string;
  model: string;
  serialNumber: string;
  purchaseDate: Date;
  warrantyDate: Date;
  status: WarrantyStatus;
}
