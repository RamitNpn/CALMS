type Gender = "male" | "female" | "other";
export interface TUser {
  _id: string;
  business_id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  gender?: Gender;
  userType: "staff" | "client";
  profile?: FileList;
  citizenship?: FileList;
  license?: FileList;
  certificate?: FileList;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}