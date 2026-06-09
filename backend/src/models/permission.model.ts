import mongoose, { Document } from "mongoose";

export type PermissionType =
  | "view"
  | "create"
  | "edit"
  | "delete"
  | "access";

export interface IPermission extends Document {
  module_name: string;
  permission_type: PermissionType;
  code: string;
}

const PermissionSchema = new mongoose.Schema(
  {
    module_name: {
      type: String,
      required: true,
      trim: true,
    },
    permission_type: {
      type: String,
      required: true,
      enum: ["view", "create", "edit", "delete", "access"],
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const PermissionModel = mongoose.model<IPermission>(
  "Permission",
  PermissionSchema,
);

export default PermissionModel;
