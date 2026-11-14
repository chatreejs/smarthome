export interface WaterworksRequest {
  invoiceNumber: string;
  invoiceDate: string;
  rawWaterUsage: number;
  waterUsage: number;
  serviceCharge: number;
  vat: number;
  total: number;
}
