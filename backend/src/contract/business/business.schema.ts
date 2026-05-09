import { z } from "zod";

export const teamRoleEnum = z.enum(["admin", "business", "staff", "client"]);
export const packageEnum = z.enum(["starter", "growth", "enterprise"]);

export const branchSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  location: z.string().min(1, "Location is required"),
});

export const servicesEnum = z.enum([
  "business_management",
  "asset_management",
  "client_management",
  "staff_management",
  "billing_management",
  "attendance_management",
]);

export const createBusinessSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  operatorName: z.string().min(1, "Operator name is required"),
  operatorEmail: z
    .string()
    .email("Invalid email")
    .min(1, "Operator email is required"),
  operatorPassword: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  businessType: z.string().min(1, "Business type is required"),
  role: teamRoleEnum.optional(),
  teams: z.string().optional(),
  branch: branchSchema,
  package: packageEnum.optional(),
  services: z.array(servicesEnum).min(1, "At least one service is required"),
  payment_initiation: z.coerce.date().optional(),
});

export const businessSchema = z.object({
  _id: z.string(),
  businessName: z.string().min(1),
  operatorName: z.string().min(1),
  operatorEmail: z.string().email(),
  businessType: z.string(),
  profilePicture: z.any().optional(),
  role: teamRoleEnum,
  teams: z.string().optional(),
  branch: branchSchema,
  package: packageEnum,
  services: z.array(servicesEnum).min(1, "At least one service is required"),
  status: z.boolean(),
  payment_status: z.boolean(),
  payment_initiation: z.coerce.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const getAllBusinessesSchema = z.array(businessSchema);

export const getBusinessByIdSchema = businessSchema;

export const updateBusinessSchema = z.object({
  _id: z.string().min(1, "Business ID is required"),
  businessName: z.string().optional(),
  operatorName: z.string().optional(),
  operatorEmail: z.string().email().optional(),
  operatorPassword: z.string().min(6).optional(),
  businessType: z.string().optional(),
  profilePicture: z.any().optional(),
  role: teamRoleEnum.optional(),
  teams: z.string().optional(),
  branch: branchSchema.optional(),
  package: packageEnum.optional(),
  services: z.array(servicesEnum).optional(),
  status: z.boolean().optional(),
  payment_status: z.boolean().optional(),
  payment_initiation: z.coerce.date().optional(),
});

export const removeBusinessSchema = z.object({
  _id: z.string().min(1, "Business ID is required"),
});