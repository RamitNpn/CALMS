import { z } from "zod";

export const servicePermissionSchema = z.object({
  create: z.boolean(),
  edit: z.boolean(),
  delete: z.boolean(),
  view: z.boolean(),
});

export const businessServiceSchema = z.object({
  service_key: z.string(),
  default_name: z.string(),
  custom_name: z.string().nullable().optional(),
  enabled: z.boolean(),
  permissions: servicePermissionSchema,
});

export const teamRoleEnum = z.enum(["admin", "business", "staff", "client"]);

export const packageEnum = z.enum(["starter", "growth", "enterprise"]);

export const servicesEnum = z.enum([
  "business_management",
  "asset_management",
  "client_management",
  "staff_management",
  "billing_management",
  "attendance_management",
]);

export const branchSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  location: z.string().min(1, "Location is required"),
});

export const createBusinessSchema = z.object({
  businessName: z.string().min(1),
  operatorName: z.string().min(1),
  operatorEmail: z.string().email(),
  businessType: z.string().min(1),
  role: teamRoleEnum.optional(),
  teams: z.string().optional(),
  branch: branchSchema,
  package: packageEnum.optional(),
  services: z.array(servicesEnum).default([]),
  payment_initiation: z.coerce.date().optional(),
});

export const businessSchema = z.object({
  _id: z.string(),
  businessName: z.string(),
  operatorName: z.string(),
  operatorEmail: z.string().email(),
  businessType: z.string(),
  profile: z.string().optional(),
  role: teamRoleEnum,
  teams: z.string().optional(),
  branch: branchSchema,
  package: packageEnum,
  services: z.array(businessServiceSchema),
  status: z.boolean(),
  payment_status: z.boolean(),
  payment_initiation: z.coerce.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const getAllBusinessesSchema = z.array(businessSchema);
export const getBusinessByIdSchema = businessSchema;

export const updateBusinessSchema = z.object({
  _id: z.string().min(1),
  businessName: z.string().optional(),
  operatorName: z.string().optional(),
  operatorEmail: z.string().email().optional(),
  operatorPassword: z.string().min(6).optional(),
  businessType: z.string().optional(),
  profile: z.string().optional(),
  role: teamRoleEnum.optional(),
  teams: z.string().optional(),
  branch: z.preprocess((val) => {
    if (typeof val === "string") return JSON.parse(val);
    return val;
  }, branchSchema),
  package: packageEnum.optional(),
  services: z.preprocess((val) => {
    if (typeof val === "string") return JSON.parse(val);
    return val;
  }, z.array(servicesEnum)),
  status: z.preprocess((val) => val === "true" || val === true, z.boolean()),
  payment_status: z.preprocess(
    (val) => val === "true" || val === true,
    z.boolean(),
  ),
  payment_initiation: z.coerce.date().optional(),
});


export const deleteBusinessSchema = z.object({
  _id: z.string().min(1, "Business ID is required"),
});
