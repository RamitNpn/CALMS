import mongoose, { Document } from "mongoose";

export interface IAsset extends Document {
  business_id: mongoose.Types.ObjectId;
  name: string;
  type: string;
  customFields: Record<string, string>;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssetSchema = new mongoose.Schema(
  {
    business_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      trim: true,
    },

    customFields: {
      type: Map,
      of: String,
      default: {},
    },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const AssetModel = mongoose.model<IAsset>("Asset", AssetSchema);

export default AssetModel;