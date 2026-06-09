import { z } from "zod";

export const packageEnum = z.enum(["starter", "growth", "enterprise"]);

export const roleEnum = z.enum(["admin", "business", "staff", "client"]);

export const servicesEnum = z.enum([
  "business_management",
  "asset_management",
  "client_management",
  "staff_management",
  "billing_management",
  "attendance_management",
]);

export const branchSchema = z.object({
  name: z.string().optional(),
  location: z.string().optional(),
});

export const createBusinessSchema = z.object({
  businessName: z.string().min(1, "Must be atlease 3 character long"),
  operatorName: z.string().min(1, "Must be atlease 3 character long"),
  operatorEmail: z.string().email(),
  businessType: z.string().min(1, "Must be atlease 3 character long"),

  role: roleEnum.default("business"),
  teams: z.string().default("").optional(),

  branch: branchSchema,

  package: packageEnum.default("starter"),

  services: z.array(servicesEnum).min(1, "Select at least one service"),

  payment_initiation: z.coerce.date().optional(),
});

export type TCreateBusinessSchema = z.infer<typeof createBusinessSchema>;

export const businessServiceSchema = z.object({
  service_key: z.string(),
  default_name: z.string(),
  custom_name: z.string().nullable().optional(),
  enabled: z.boolean(),
  permissions: z.object({
    create: z.boolean(),
    edit: z.boolean(),
    delete: z.boolean(),
    view: z.boolean(),
  }),
});

export const businessSchema = z.object({
  _id: z.string(),

  businessName: z.string(),
  operatorName: z.string(),
  operatorEmail: z.string().email(),
  businessType: z.string(),

  profile: z.any().optional(),

  role: roleEnum,
  teams: z.string().optional(),

  branch: branchSchema,

  package: packageEnum,

  services: z.array(businessServiceSchema),

  status: z.boolean(),
  payment_status: z.boolean(),
  payment_initiation: z.string().optional(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export const getAllBusinessSchema = z.array(businessSchema);

export type TGetAllBusinessSchema = z.infer<typeof getAllBusinessSchema>;

export const getAllBusinessByIdSchema = businessSchema;

export type TGetAllBusinessByIdSchema = z.infer<
  typeof getAllBusinessByIdSchema
>;

export const updateAdminBusinessSchema = z.object({
  _id: z.string(),

  businessName: z.string().optional(),
  operatorName: z.string().optional(),
  operatorEmail: z.string().email().optional().or(z.literal("")),
  operatorPassword: z.string().optional(),

  businessType: z.string().optional(),
  profile: z.any().optional(),

  role: roleEnum.optional(),
  teams: z.string().optional(),

  branch: branchSchema.optional(),

  package: packageEnum.optional(),
  services: z.array(servicesEnum).optional(),

  status: z.boolean().optional(),
  payment_status: z.boolean().optional(),

  payment_initiation: z.string().optional(),
});

export type TAdminUpdateBusinessSchema = z.infer<
  typeof updateAdminBusinessSchema
>;

export const updateBusinessSchema = z.object({
  businessName: z.string().optional(),
  operatorName: z.string().optional(),
  operatorEmail: z.string().email().optional().or(z.literal("")),
  operatorPassword: z.string().optional(),
  businessType: z.string().optional(),
  profile: z.any().optional(),
  role: roleEnum.optional(),
  teams: z.string().optional(),
  branch: branchSchema.optional(),
  package: packageEnum.optional(),
  status: z.boolean().optional(),
  payment_status: z.boolean().optional(),
  payment_initiation: z.string().optional(),
});

export type TUpdateBusinessSchema = z.infer<typeof updateBusinessSchema>;

export const deleteBusinessSchema = z.object({
  _id: z.string().min(1, "Business ID is required"),
});

export type TDeleteBusinessSchema = z.infer<typeof deleteBusinessSchema>;
