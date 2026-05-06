import { z } from "zod";

export const createStaffSchema = z.object({
  id: z.string().optional(),
  business_id: z.string().min(1, "Business ID is required"),
  staffName: z.string().min(1, "Staff name is required"),
  staffEmail: z.string().email("Invalid email address"),
  staffPhone: z
    .string()
    .min(7, "Phone number is too short")
    .max(15, "Phone number is too long"),
  gender: z.enum(["male", "female", "other"]),
  profile: z.string().optional(), // image URL or file path
  citizenship: z.string().optional(),
  liscence: z.string().optional(),
  certificate: z.string().optional(),
  role: z.string().min(1, "Role is required"),
});

export type TCreateStaffSchema = z.infer<typeof createStaffSchema>;

export const getStaffByIdSchema = z.object({
  id: z.string().optional(),
  business_id: z.string().min(1, "Business ID is required"),
  staffName: z.string().min(1, "Staff name is required"),
  staffEmail: z.string().email("Invalid email address"),
  staffPhone: z
    .string()
    .min(7, "Phone number is too short")
    .max(15, "Phone number is too long"),
  gender: z.enum(["male", "female", "other"]),
  profile: z.string().optional(), // image URL or file path
  citizenship: z.string().optional(),
  liscence: z.string().optional(),
  certificate: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  createdAt: z.string(),
});

export type GetStaffById = z.infer<typeof getStaffByIdSchema>;

export const getAllStaffSchema = z.array(getStaffByIdSchema);

export type GetAllStaffQuery = z.infer<typeof getAllStaffSchema>;

export const updateStaffSchema = z.object({
  id: z.string().min(1, "Staff ID is required"),
  business_id: z.string().optional(),
  staffName: z.string().optional(),
  staffEmail: z.string().email().optional(),
  staffPhone: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  profile: z.string().optional(),
  citizenship: z.string().optional(),
  liscence: z.string().optional(),
  certificate: z.string().optional(),
  role: z.string().optional(),
});

export type TUpdateStaffSchema = z.infer<typeof updateStaffSchema>;

export const deleteStaffSchema = z.object({
  id: z.string().min(1, "Staff ID is required"),
});

export type DeleteStaffInput = z.infer<typeof deleteStaffSchema>;
