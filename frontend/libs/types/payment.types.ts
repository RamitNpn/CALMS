export interface TPayment {
  _id: string;
  business_id: string;
  businessName: string;
  businessEmail: string;
  package: "starter" | "growth" | "enterprise";
  startedAt: Date;
  endAt: Date;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: "paid" | "partial" | "pending";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TCreatePayment {
  businessName: string;
  businessEmail: string;
  package: "starter" | "growth" | "enterprise";
  startedAt: Date;
  endAt: Date;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: "paid" | "partial" | "pending";
  isActive: boolean;
}
