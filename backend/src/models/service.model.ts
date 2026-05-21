import mongoose, { Document } from "mongoose";

export interface IService extends Document {
  service_key: string;
  default_name: string;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new mongoose.Schema(
  {
    service_key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    default_name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const ServiceModel = mongoose.model<IService>("Service", ServiceSchema);

export default ServiceModel;
