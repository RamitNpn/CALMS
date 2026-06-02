
export interface TFinance {
  _id: string;
  business_id: string;
  title: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  relatedTo?: string;
  objectType?: "vehicle" | "student" | "staff" | "office" | "other";
  objectId?: string;
  paymentMethod: "cash" | "bank_transfer" | "esewa" | "khalti" | "card";
  referenceNumber?: string;
  description?: string;
  status: "pending" | "completed" | "cancelled";
  transactionDate: Date;
  createdBy?: string;
}

export interface ICreateFinance {
  business_id: string;
  title: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  relatedTo?: string;
  objectType?: "vehicle" | "student" | "staff" | "office" | "other";
  objectId?: string;
  paymentMethod: "cash" | "bank_transfer" | "esewa" | "khalti" | "card";
  referenceNumber?: string;
  description?: string;
  status: "pending" | "completed" | "cancelled";
  transactionDate: Date;
  createdBy?: string;
}