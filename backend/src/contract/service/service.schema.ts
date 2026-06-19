import { z } from "zod";

export const initializeServiceSchema = z.object({
  service_key: z.string(),
  default_name: z.string(),
});

export const getServiceByIDSchema = z.object({
  _id: z.string(),
  service_key: z.string(),
  default_name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const servicePermissionSchema = z.object({
  create: z.boolean(),
  edit: z.boolean(),
  delete: z.boolean(),
  view: z.boolean(),
});

export const ServiceSchema = z.object({
  _id: z.string(),
  service_key: z.string(),
  default_name: z.string(),
  custom_name: z.string().nullable(),
  enabled: z.boolean(),
  permissions: servicePermissionSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const getServiceByBusinessIDSchema = z.array(ServiceSchema);

export const getAllServicesSchema = z.array(
  getServiceByIDSchema
);

export const updateServiceSchema = z.object({
  _id: z.string(),
  service_key: z.string(),
  default_name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const removeServiceSchema = z.object({
  _id: z.string(),
});