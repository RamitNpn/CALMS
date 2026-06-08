import mongoose, { Schema, Document } from "mongoose";

export interface IFinance extends Document {
  business_id: mongoose.Types.ObjectId;
  title: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  relatedTo?: string;
  objectType?: "vehicle" | "student" | "staff" | "office" | "other";
  objectId?: string;
  paymentMethod: "cash" | "bank_transfer" | "esewa" | "khalti" | "card";
  referenceNumber?: string;
  description?: string;
  status: "pending" | "completed" | "cancelled";
  transactionDate: Date;
  createdBy?: mongoose.Types.ObjectId;
}

const FinanceSchema = new Schema(
  {
    business_id: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    relatedTo: {
      type: String,
    },

    objectType: {
      type: String,
      enum: ["vehicle", "student", "staff", "office", "other"],
    },

    objectId: {
      type: String,
    },

    paymentMethod: {
      type: String,
      enum: ["cash", "bank_transfer", "esewa", "khalti", "card"],
      default: "cash",
    },

    referenceNumber: {
      type: String,
    },

    description: {
      type: String,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "completed",
    },

    transactionDate: {
      type: Date,
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

const FinanceModel = mongoose.model("Finance", FinanceSchema);

export default FinanceModel;
