type typeName = "cash" | "bank_transfer" | "esewa" | "khalti" | "card"
export interface TAssetType {
  _id: string;
  business_id: string;
  typeName: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TCreateAssetType {
  business_id: string;
  typeName: typeName;
  description: string;
}
