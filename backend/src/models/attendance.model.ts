import mongoose, { Document } from "mongoose";

export interface IAttendance extends Document {
  business_id: mongoose.Types.ObjectId;

  clientId: mongoose.Types.ObjectId;

  userType: string; 

  checkIn?: Date;
  checkOut?: Date;

  method: "QR" | "Manual";

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
      required: true,
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
  },
  {
    timestamps: true,
  }
);

AttendanceSchema.index({ business_id: 1, clientId: 1 });
AttendanceSchema.index({ business_id: 1, createdAt: -1 });

const AttendanceModel = mongoose.model<IAttendance>(
  "Attendance",
  AttendanceSchema
);

export default AttendanceModel;