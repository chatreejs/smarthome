export interface Electricity {
  id: number;
  invoiceNumber: string;
  invoiceDate: string;
  usage: number;
  ftRate: number;
  electricityPrice: number;
  serviceCharge: number;
  ft: number;
  vat: number;
  total: number;
  updateBy: string;
  updateDate: Date;
}
