import { z } from "zod";

export const getServiceByIDSchema = z.object({
  _id: z.string(),
  service_name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TGetServiceByIdSchema = z.infer<typeof getServiceByIDSchema>;

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