import mongoose, { Document } from "mongoose";

export interface IBilling extends Document {
  business_id: mongoose.Types.ObjectId;
  clientId: mongoose.Types.ObjectId;
  title: string;
  items: {
    name: string;
    price: number;
    qty: number;
  }[];
  totalAmount: number;
  paidAmount: number;
  status: "pending" | "completed" | "partial";
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BillingSchema = new mongoose.Schema(
  {
    business_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    items: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "partial"],
      default: "pending",
    },

    dueDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const BillingModel = mongoose.model<IBilling>("Billing", BillingSchema);

export default BillingModel;
