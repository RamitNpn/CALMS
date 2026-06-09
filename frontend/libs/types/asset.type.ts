export interface TAsset {
  _id: string;
  business_id: string;
  name: string;
  type: string;
  price: number;
  image: string;
  customFields: Record<string, string>;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TCreateAsset {
  business_id: string;
  name: string;
  type: string;
  price: number;
  image: FileList;
  customFields: Record<string, string>;
  status: string;
}
