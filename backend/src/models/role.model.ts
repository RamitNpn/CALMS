import mongoose, { Document } from "mongoose";

export interface IRole extends Document {
  role_name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RoleSchema = new mongoose.Schema(
  {
    role_name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const RoleModel = mongoose.model<IRole>("Role", RoleSchema);

export default RoleModel;
