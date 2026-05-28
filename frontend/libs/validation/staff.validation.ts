import { z } from "zod";

export const createStaffSchema = z.object({
  business_id: z.string().min(1, "Business ID is required"),
  userName: z.string().min(1, "Staff name is required"),
  userEmail: z.string().email("Invalid email address"),
  userPhone: z
    .string()
    .min(7, "Phone number is too short")
    .max(15, "Phone number is too long"),
  gender: z.enum(["male", "female", "other"]),
  profile: z.any().optional(),
  role: z.string(),
});

export type TCreateStaffSchema = z.infer<typeof createStaffSchema>;

export const getStaffByIdSchema = z.object({
  _id: z.string().optional(),
  business_id: z.string().min(1, "Business ID is required"),
  userName: z.string().min(1, "Staff name is required"),
  userEmail: z.string().email("Invalid email address"),
  userPhone: z
    .string()
    .min(7, "Phone number is too short")
    .max(15, "Phone number is too long"),
  gender: z.enum(["male", "female", "other"]),
  profile: z.any().optional(), // image URL or file path
  role: z.string(),
  createdAt: z.string(),
});

export type TGetStaffByIdSchema = z.infer<typeof getStaffByIdSchema>;

export const getAllStaffSchema = z.array(getStaffByIdSchema);

export type TGetAllStaffSchema = z.infer<typeof getAllStaffSchema>;

export const updateStaffSchema = z.object({
  _id: z.string("Staff ID is required"),
  business_id: z.string().optional(),
  userName: z.string().optional(),
  userEmail: z.string().email().optional(),
  userPhone: z.string().optional(),
  userPassword: z.string().min(6, "Password must be at least 6 characters").optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  profile: z.any().optional(),
  role: z.string().optional(),
});

export type TUpdateStaffSchema = z.infer<typeof updateStaffSchema>;

export const deleteStaffSchema = z.object({
  _id: z.string(),
});

export type TDeleteStaffSchema = z.infer<typeof deleteStaffSchema>;
