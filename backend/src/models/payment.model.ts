import mongoose, { Document } from "mongoose";

export interface IPayment extends Document {
  business_id: mongoose.Types.ObjectId;
  businessName: string;
  businessEmail: string;
  package: "starter" | "growth" | "enterprise";
  startedAt: Date;
  endAt: Date;
  paidAmount: number;
  dueAmount: number;
  paymentStatus: "paid" | "partial" | "pending";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new mongoose.Schema(
  {
    business_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Business",
        required: true,
    },

    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    businessEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    package: {
      type: String,
      enum: ["starter", "growth", "enterprise"],
      default: "starter",
    },

    startedAt: {
        type: Date,
        required: true,
    },

    endAt: {
        type: Date,
        required: true,
    },

    paidAmount: {
        type: Number,
        required: true,
    },

    dueAmount: {
        type: Number,
        required: true,
    },

    paymentStatus: {
        type: String,
        enum: ["paid", "partial", "pending"],
        default: "pending",
    },

    isActive: {
        type: Boolean,
        default: true,
    },
  },
  {
    timestamps: true,
  },
);

const PaymentModel = mongoose.model<IPayment>("Payment", PaymentSchema);

export default PaymentModel;
