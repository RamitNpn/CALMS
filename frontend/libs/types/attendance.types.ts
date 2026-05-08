type GetMethod = "QR" | "Manual";

export interface TAttendance {
  _id: string;
  business_id: string;
  clientName: string;
  clientEmail: string;
  userType: string;
  checkIn?: Date;
  checkOut?: Date;
  method: GetMethod;
  createdAt: Date;
  updatedAt: Date;
}

export interface TCreateAttendance {
  business_id: string;
  clientName: string;
  clientEmail: string;
  userType: string;
  checkIn?: Date;
  checkOut?: Date;
  method: GetMethod;
}
