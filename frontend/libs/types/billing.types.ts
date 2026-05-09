type PaymentMethod = "cash" | "online";
type BillingStatus = "pending" | "paid" | "partial";

export interface TBilling {
  _id: string;
  business_id: string;
  clientName: string;
  clientEmail: string;
  title: string;
  items: {
    name: string;
    price: number;
    qty: number;
  }[];
  totalAmount: number;
  paidAmount: number;
  paymentMethod?: PaymentMethod;
  recipt?: FileList;
  status?: BillingStatus;
  dueDate?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TCreateBilling {
  business_id: string;
  clientName: string;
  clientEmail: string;
  title: string;
  items: {
    name: string;
    price: number;
    qty: number;
  }[];
  totalAmount: number;
  paidAmount: number;
  paymentMethod?: PaymentMethod;
  recipt?: FileList;
  status?: BillingStatus;
  dueDate?: string;
}