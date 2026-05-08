export interface TStaff {
    _id: string;
  business_id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  gender?: string;
  profile?: string;
  role: "staff" | "client";
  createdAt: Date;
  updatedAt: Date;
}

export interface TCreateStaff {
  business_id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userPassword: string;
  gender?: string;
  profile?: string;
  role: "staff" | "client";
}