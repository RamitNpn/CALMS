type GetMethod = "QR" | "Manual";

export interface TAttendance {
  _id: string;
  business_id: string;
  userId?: string;
  userName: string;
  userEmail: string;
  userType: string;
  checkIn?: Date;
  checkOut?: Date;
  status: "Present" | "Absent" | "Leave" | "Late";
  method: GetMethod;
  createdAt: Date;
  updatedAt: Date;
}

export interface TCreateAttendance {
  userIds: string[];
  business_id: string;
  userName: string;
  userEmail: string;
  checkIn?: Date;
  checkOut?: Date;
  status: "Present" | "Absent" | "Leave" | "Late";
  method: GetMethod;
  date?: Date;
}
