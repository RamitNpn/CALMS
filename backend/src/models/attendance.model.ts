import mongoose, { Document } from "mongoose";
export interface IAttendance extends Document {
  business_id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  checkIn?: Date;
  checkOut?: Date;
  method: "QR" | "Manual";
  status?: "Present" | "Absent" | "Leave" | "Late";
  date: Date;
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

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

AttendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

const AttendanceModel = mongoose.model<IAttendance>(
  "Attendance",
  AttendanceSchema,
);

export default AttendanceModel;
