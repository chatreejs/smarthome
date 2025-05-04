export interface Waterworks {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
  rawWaterUsage: number;
  waterUsage: number;
  serviceCharge: number;
  vat: number;
  total: number;
  updateBy: string;
  updateDate: Date;
}
