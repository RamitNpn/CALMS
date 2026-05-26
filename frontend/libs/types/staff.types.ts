export type Gender = "male" | "female" | "other";
export interface TStaff {
  _id: string;
  business_id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  gender: Gender;
  profile?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TCreateStaff {
  business_id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  gender: Gender;
  profile?: FileList;
  role:string;
}
