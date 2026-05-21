import mongoose, { Document } from "mongoose";

export interface IAssetType extends Document {
  business_id: mongoose.Types.ObjectId;
  typeName: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssetTypeSchema = new mongoose.Schema(
  {
    business_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    typeName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

  },
  {
    timestamps: true,
  },
);

const AssetTypeModel = mongoose.model<IAssetType>("AssetType", AssetTypeSchema);

export default AssetTypeModel;
