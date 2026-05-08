import { z } from "zod";

export const packageEnum = z.enum(["starter", "growth", "enterprise"]);

export const branchSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  location: z.string().min(1, "Location is required"),
});

export const createBusinessSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  operatorName: z.string().min(1, "Operator name is required"),
  operatorEmail: z.string().min(1, "Operator email is required"),
  operatorPassword: z
    .string()
    .min(6, "Password must be at least 6 characters"),
  businessType: z.string().min(1, "Business type is required"),
  role: z
    .enum(["admin", "business", "staff", "client"])
    .default("business"),
  teams: z.string().default(""),
  branch: branchSchema,
  package: packageEnum.default("starter"),
  services: z.array(z.string()).min(1, "Select at least one service"),
  payment_initiation: z.coerce.date().optional(),
});

export type TCreateBusinessSchema = z.infer<typeof createBusinessSchema>;

export const getAllBusinessByIdSchema = z.object({
  _id: z.string(),
  businessName: z.string().min(1),
  operatorName: z.string().min(1),
  operatorEmail: z.string().email(),
  businessType: z.string(),
  role: z.enum(["admin", "business", "staff", "client"]),
  teams: z.string().optional(),
  branch: branchSchema,
  package: packageEnum,
  services: z.array(z.string()).min(1, "Select at least one service"),
  status: z.boolean(),
  payment_status: z.boolean(),
  payment_initiation: z.coerce.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TGetAllBusinessByIdSchema = z.infer<typeof getAllBusinessByIdSchema>;

export const getAllBusinessSchema = z.array(getAllBusinessByIdSchema);

export type TGetAllBusinessSchema = z.infer<typeof getAllBusinessSchema>;

export const updateBusinessSchema = z.object({
  _id: z.string(),
  businessName: z.string().optional(),
  operatorName: z.string().optional(),
  operatorEmail: z.string().email().optional(),
  operatorPassword: z.string().min(6).optional(),
  businessType: z.string().optional(),
  role: z.enum(["admin", "business", "staff", "client"]).optional(),
  teams: z.string().optional(),
  branch: branchSchema.optional(),
  package: packageEnum.optional(),
  services: z.array(z.string()).min(1, "Select at least one service"),
  status: z.boolean().optional(),
  payment_status: z.boolean().optional(),
  payment_initiation: z.string().optional(),
});

export type TUpdateBusinessSchema = z.infer<typeof updateBusinessSchema>;

export const deleteBusinessSchema = z.object({
  _id: z.string().min(1, "Business ID is required"),
});

export type TDeleteBusinessSchema = z.infer<typeof deleteBusinessSchema>;