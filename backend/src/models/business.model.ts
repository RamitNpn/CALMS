import mongoose, { Document } from "mongoose";

export type TeamRole = "admin" | "business" | "staff" | "client";
export type PackageType = "starter" | "growth" | "enterprise";
export type Services = "business_management" | "asset_management" | "client_management" | "staff_management" | "billing_management" | "attendance_management";
export type Branch = {
  name: string;
  location: string;
};

export interface IBusiness extends Document {
  businessName: string;
  operatorName: string;
  operatorEmail: string;
  operatorPassword: string;
  businessType: string;
  role: TeamRole;
  teams: string;
  branch: Branch;
  package: PackageType;
  services: Services[];
  status: boolean;
  payment_status: boolean;
  payment_initiation: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    operatorName: {
      type: String,
      required: true,
      trim: true,
    },

    operatorEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    operatorPassword: {
      type: String,
      required: true,
    },

    businessType: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "business", "staff", "client"],
      default: "business",
    },

    teams: {
      type: String,
      default: "",
    },

    branch: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      location: {
        type: String,
        required: true,
        trim: true,
      },
    },

    package: {
      type: String,
      enum: ["starter", "growth", "enterprise"],
      default: "starter",
    },

    services: {
      type: [String],
      default: [],
    },

    status: {
      type: Boolean,
      default: true,
    },

    payment_status: {
      type: Boolean,
      default: true,
    },

    payment_initiation: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const BusinessModel = mongoose.model<IBusiness>("Business", BusinessSchema);

export default BusinessModel;