import mongoose, { Document } from "mongoose";

export interface IRolePermission extends Document {
  role_id: mongoose.Types.ObjectId;
  permission_id: mongoose.Types.ObjectId;
  allowed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RolePermissionSchema = new mongoose.Schema(
  {
    role_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    permission_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission",
      required: true,
    },
    allowed: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

RolePermissionSchema.index({ role_id: 1, permission_id: 1 }, { unique: true });

const RolePermissionModel = mongoose.model<IRolePermission>(
  "RolePermission",
  RolePermissionSchema,
);

export default RolePermissionModel;
