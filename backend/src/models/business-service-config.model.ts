import mongoose, { Document, Schema } from "mongoose";

export interface IServicePermission {
  create: boolean;
  edit: boolean;
  delete: boolean;
  view: boolean;
}

export interface IBusinessService {
  service_key: string;
  default_name: string;
  custom_name?: string | null;
  enabled: boolean;
  permissions: IServicePermission;
}

export interface IBusinessServiceConfig extends Document {
  business_id: mongoose.Types.ObjectId;
  services: IBusinessService[];
  createdAt: Date;
  updatedAt: Date;
}

const PermissionSchema = new Schema(
  {
    create: {
      type: Boolean,
      default: true,
    },

    edit: {
      type: Boolean,
      default: true,
    },

    delete: {
      type: Boolean,
      default: false,
    },

    view: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  },
);

const BusinessServiceSchema = new Schema(
  {
    service_key: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    default_name: {
      type: String,
      required: true,
      trim: true,
    },

    custom_name: {
      type: String,
      default: null,
      trim: true,
    },

    enabled: {
      type: Boolean,
      default: true,
    },

    permissions: {
      type: PermissionSchema,
      default: () => ({}),
    },
  },
  {
    _id: false,
  },
);

const BusinessServiceConfigSchema = new Schema(
  {
    business_id: {
      type: Schema.Types.ObjectId,
      ref: "Business",
      required: true,
      unique: true,
    },
    services: {
      type: [BusinessServiceSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const BusinessServiceConfigModel = mongoose.model<IBusinessServiceConfig>(
  "BusinessServiceConfig",
  BusinessServiceConfigSchema,
);

export default BusinessServiceConfigModel;
