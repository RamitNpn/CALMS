export type Gender = "male" | "female" | "other";

export interface TClient {
  _id: string;
  business_id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  gender?: Gender;
  profile?: FileList;
  citizenship?: FileList;
  license?: FileList;
  certificate?: FileList;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TCreateClient {
  business_id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userPassword: string;
  gender?: Gender;
  profile?: FileList;
  citizenship?: FileList;
  license?: FileList;
  certificate?: FileList;
  role: string;
}