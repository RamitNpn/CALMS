export type PackageType = "starter" | "growth" | "enterprise";
export type Branch = {
  name: string;
  location: string;
};

export interface TBusiness {
  _id: string;
  businessName: string;
  operatorName: string;
  operatorEmail: string;
  businessType: string;
  role: "business";
  teams: string;
  branch: Branch;
  package: PackageType;
  services: string;
  status: boolean;
  payment_status: boolean;
  payment_initiation: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TBusinessCreate {
  businessName: string;
  operatorName: string;
  operatorEmail: string;
  businessType: string;
  role: "business";
  teams: string;
  branch: Branch;
  package: PackageType;
  payment_status: boolean;
  payment_initiation: Date;
}