import { z } from "zod";

export const genderEnum = z.enum(["male", "female", "other"]).optional();
export const role = z.enum(["staff", "client"]).optional();

export const createUserSchema = z.object({
  business_id: z.string(),
  userName: z.string().min(1, "User name is required"),
  userEmail: z.string().email("Invalid email").optional(),
  userPhone: z.string().optional(),
  gender: genderEnum,
  profile: z.any().optional(),
  citizenship: z.any().optional(),
  license: z.any().optional(),
  certificate: z.any().optional(),
  role: role,
});

export const userSchema = z.object({
  _id: z.string(),
  business_id: z.string(),
  userName: z.string(),
  userEmail: z.string().optional(),
  userPhone: z.string().optional(),
  gender: z.string().optional(),
  profile: z.any().optional(),
  citizenship: z.any().optional(),
  license: z.any().optional(),
  certificate: z.any().optional(),
  role: role,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const getAllUsersSchema = z.array(userSchema);

export const getUserByIDSchema = userSchema;

export const updateUserSchema = z.object({
  _id: z.string().min(1, "User ID is required"),
  userName: z.string().optional(),
  userEmail: z.string().email().optional(),
  userPhone: z.string().optional(),
  userPassword: z.string().optional(),
  gender: z.string().optional(),
  profile: z.any().optional(),
  citizenship: z.any().optional(),
  license: z.any().optional(),
  certificate: z.any().optional(),
  role: role,
});

export const removeUserSchema = z.object({
  _id: z.string(),
});
