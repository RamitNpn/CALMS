import mongoose, { Document } from "mongoose";

export interface IToken extends Document {
  tenantId: mongoose.Types.ObjectId;

  number: number;

  category: string;

  counter: string;

  status: "WAITING" | "CALLED" | "DONE" | "CANCELLED";

  clientId: mongoose.Types.ObjectId;

  calledAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Token Schema
 */
const TokenSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    number: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
    },

    counter: {
      type: String,
    },

    status: {
      type: String,
      enum: ["WAITING", "CALLED", "DONE", "CANCELLED"],
      default: "WAITING",
    },

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
    },

    calledAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

/**
 * Compound index for queue performance
 */
TokenSchema.index({ tenantId: 1, number: 1 });

const TokenModel = mongoose.model<IToken>("Token", TokenSchema);

export default TokenModel;