import mongoose, { Schema, Document } from "mongoose";

export interface IDrivingInquiry extends Document {
  fullName: string;
  email?: string;
  phone: string;
  age?: number;
  gender?: string;
  state: string;
  district: string;
  street: string;
  occupation?: string;
  inquiryType:
    | "new_admission"
    | "license_trial"
    | "vehicle_training"
    | "renewal";
  licenseType: "bike" | "car" | "scooter" | "jeep" | "bus" | "truck";
  preferredVehicle?: string;
  packageType?: "basic" | "standard" | "premium";
  preferredSchedule?: string;
  trainingShift?: "morning" | "day" | "evening";
  experienceLevel?: "beginner" | "intermediate" | "experienced";
  referredBy?: string;
  message?: string;
  emergencyContact: {
    name?: string;
    phone?: string;
    relation?: string;
  };
  document?: string;
  documentType?: string;
  agreeTerms: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DrivingInquirySchema = new Schema<IDrivingInquiry>(
  {
    fullName: {
      type: String,
      required: true,
      minlength: 2,
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

    age: {
      type: Number,
    },

    gender: {
      type: String,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    district: {
      type: String,
      required: true,
      trim: true,
    },

    street: {
      type: String,
      required: true,
      minlength: 2,
      trim: true,
    },

    occupation: {
      type: String,
    },

    inquiryType: {
      type: String,
      enum: ["new_admission", "license_trial", "vehicle_training", "renewal"],
      required: true,
    },

    licenseType: {
      type: String,
      enum: ["bike", "car", "scooter", "jeep", "bus", "truck"],
      required: true,
    },

    preferredVehicle: {
      type: String,
    },

    packageType: {
      type: String,
      enum: ["basic", "standard", "premium"],
    },

    preferredSchedule: {
      type: String,
    },

    trainingShift: {
      type: String,
      enum: ["morning", "day", "evening"],
    },

    experienceLevel: {
      type: String,
      enum: ["beginner", "intermediate", "experienced"],
    },

    referredBy: {
      type: String,
    },

    message: {
      type: String,
    },

    emergencyContact: {
      name: { type: String },
      phone: { type: String },
      relation: { type: String },
    },

    document: {
      type: String,
    },

    documentType: {
      type: String,
    },

    agreeTerms: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const DrivingInquiryModel = mongoose.model<IDrivingInquiry>(
  "DrivingInquiry",
  DrivingInquirySchema,
);
