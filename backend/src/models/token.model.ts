import mongoose, { Schema, Document } from "mongoose";

export type TokenStatus =
  | "pending"
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "failed";

export type VehicleCategory =
  | "bike"
  | "scooter"
  | "car"
  | "jeep"
  | "bus"
  | "truck"
  | "other";

export interface IToken extends Document {
  businessId?: string;
  tokenNumber: string;
  roundNumber: number;
  perRoundCharge: number;
  totalAmount: number;
  participationDate: Date;

  fullName: string;
  email?: string;
  phone: string;

  vehicleCategory: VehicleCategory;
  trainingPackage?: string;
  preferredShift?: "morning" | "day" | "evening";

  status: TokenStatus;
  remarks?: string;

  createdAt: Date;
  updatedAt: Date;
}

const tokenSchema = new Schema<IToken>(
  {
    businessId: {
      type: mongoose.Types.ObjectId,
      ref: "Business",
      trim: true,
    },
    tokenNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    roundNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    perRoundCharge: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    participationDate: {
      type: Date,
      required: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },

    vehicleCategory: {
      type: String,
      enum: ["bike", "scooter", "car", "jeep", "bus", "truck", "other"],
      required: true,
    },
    preferredShift: {
      type: String,
      enum: ["morning", "day", "evening"],
    },

    status: {
      type: String,
      enum: [
        "pending",
        "scheduled",
        "in_progress",
        "completed",
        "cancelled",
        "failed",
      ],
      default: "pending",
    },
    remarks: {
      type: String,
      trim: true,
    }
  },
  {
    timestamps: true,
  },
);

export const TokenModel = mongoose.model<IToken>(
  "Token",
  tokenSchema,
);
