import { WarrantyStatus } from './WarrantyStatus.enum';

export class Warranty {
  key: React.Key;
  id: number;
  brand: string;
  productName: string;
  productNumber: string;
  model: string;
  serialNumber: string;
  purchaseDate: Date;
  warrantyDate: Date;
  status: WarrantyStatus;

  constructor(
    id: number,
    brand: string,
    productName: string,
    productNumber: string,
    model: string,
    serialNumber: string,
    purchaseDate: Date,
    warrantyDate: Date,
    status: WarrantyStatus,
  ) {
    this.key = id;
    this.id = id;
    this.brand = brand;
    this.productName = productName;
    this.productNumber = productNumber;
    this.model = model;
    this.serialNumber = serialNumber;
    this.purchaseDate = purchaseDate;
    this.warrantyDate = warrantyDate;
    this.status = status;
  }
}
