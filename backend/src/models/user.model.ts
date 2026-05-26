import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  business_id: mongoose.Types.ObjectId;
  userName: string;
  userEmail: string;
  userPhone: string;
  userPassword: string;
  gender?: string;
  profile?: string;
  citizenship?: string;
  license?: string;
  certificate?: string;
  role: "staff" | "client";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema(
  {
    business_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    userName: {
      type: String,
      required: true,
      trim: true,
    },

    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    userPhone: {
      type: String,
      required: true,
      trim: true,
    },

    userPassword: {
      type: String,
      required: false,
      default: "",
    },

    gender: {
      type: String,
      trim: true,
    },

    profile: {
      type: String,
    },

    citizenship: {
      type: String,
    },

    license: {
      type: String,
    },

    certificate: {
      type: String,
    },
    role: {
      type: String,
      enum: ["staff", "client"],
      default: "client",
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
