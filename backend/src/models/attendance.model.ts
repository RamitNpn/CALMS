import mongoose, { Document } from "mongoose";
export interface IAttendance extends Document {
  business_id: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  clientName: string;
  clientEmail: string;
  userType: string; 
  checkIn?: Date;
  checkOut?: Date;
  method: "QR" | "Manual";
  status?: "Present" | "Absent" | "Leave" | "Late";
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new mongoose.Schema(
  {
    business_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    clientName: {
      type: String,
      required: true,
      trim: true,
    },

    clientEmail: {
      type: String,
      required: true,
      trim: true,
    },

    userType: {
      type: String,
      required: true,
      trim: true,
    },

    checkIn: {
      type: Date,
    },

    checkOut: {
      type: Date,
    },

    method: {
      type: String,
      enum: ["QR", "Manual"],
      default: "Manual",
    },

    status: {
      type: String,
      enum: ["Present", "Absent", "Leave", "Late"],
    },
  },
  {
    timestamps: true,
  }
);

const AttendanceModel = mongoose.model<IAttendance>(
  "Attendance",
  AttendanceSchema
);

export default AttendanceModel;