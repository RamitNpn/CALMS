import { z } from "zod";

export const getServiceByIDSchema = z.object({
  _id: z.string(),
  service_name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TGetServiceByIdSchema = z.infer<typeof getServiceByIDSchema>;

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

export type TGetServiceByBusinessIDSchema = z.infer<typeof getServiceByBusinessIDSchema>;

export const getAllServicesSchema = z.array(getServiceByIDSchema);

export type TGetAllServicesSchema = z.infer<typeof getAllServicesSchema>;

export const updateServiceSchema = z.object({
  _id: z.string(),
  service_name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TUpdateServiceSchema = z.infer<typeof updateServiceSchema>;

export const removeServiceSchema = z.object({
  _id: z.string(),
});

export type TDeleteServiceSchema = z.infer<typeof removeServiceSchema>;