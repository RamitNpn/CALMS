import mongoose, { Document } from "mongoose";

export interface IActivityLog extends Document {
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "VIEW" | "EDIT";
  userId: mongoose.Types.ObjectId;
  userName: string;
  module: string;
  description: string;
  changes?: Array<{
    field: string;
    oldValue: string;
    newValue: string;
  }>;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ActivityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: ["CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "VIEW", "EDIT"],
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
      index: true,
    },
    module: {
      type: String,
      required: true,
      index: true,
    },
    description: String,
    changes: [
      {
        field: String,
        oldValue: String,
        newValue: String,
      },
    ],
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const ActivityLogModel = mongoose.model<IActivityLog>(
  "ActivityLog",
  ActivityLogSchema
);

export default ActivityLogModel;
