import mongoose, { Document } from "mongoose";

export interface ISchedule extends Document {
  tenantId: mongoose.Types.ObjectId;
  title: string;
  staffId: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  createdAt: Date;
  updatedAt: Date;
}

const ScheduleSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
    },

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

const ScheduleModel = mongoose.model<ISchedule>("Schedule", ScheduleSchema);

export default ScheduleModel;