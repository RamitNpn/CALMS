import { z } from "zod";

export const createClientSchema = z.object({
  business_id: z.string().min(1, "Business ID is required"),
  userName: z.string().min(1, "Client name is required"),
  userEmail: z.string().email("Invalid email address"),
  userPhone: z
    .string()
    .min(10, "Invalid Number Format")
    .max(10, "Invalid Number Format"),
  gender: z.enum(["male", "female", "other"]).optional(),
  profile: z.any().optional(),
  citizenship: z.any().optional(),
  license: z.any().optional(),
  certificate: z.any().optional(),
  role: z.string(),
});

export type TCreateClientSchema = z.infer<typeof createClientSchema>;

export const getClientByIdSchema = z.object({
  _id: z.string().optional(),
  business_id: z.string().min(1, "Business ID is required"),
  userName: z.string().min(1, "Client name is required"),
  userEmail: z.string().email("Invalid email address"),
  userPhone: z
    .string()
    .min(10, "Invalid Number Format")
    .max(10, "Invalid Number Format"),
  gender: z.enum(["male", "female", "other"]).optional(),
  profile: z.any().optional(),
  citizenship: z.any().optional(),
  license: z.any().optional(),
  certificate: z.any().optional(),
  role: z.string(),
  createdAt: z.string(),
});

export type TGetClientByIdSchema = z.infer<typeof getClientByIdSchema>;

export const getAllClientSchema = z.array(getClientByIdSchema);

export type TGetAllClientsSchema = z.infer<typeof getAllClientSchema>;

export const updateClientSchema = z.object({
  _id: z.string(),
  business_id: z.string().optional(),
  userName: z.string().optional(),
  userEmail: z.string().email().optional(),
  userPhone: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  profile: z.any().optional(),
  citizenship: z.any().optional(),
  license: z.any().optional(),
  certificate: z.any().optional(),
  role: z.string().optional(),
});

export type TUpdateClientSchema = z.infer<typeof updateClientSchema>;

export const deleteClientSchema = z.object({
  _id: z.string().min(1, "Client ID is required"),
});

export type TDeleteClientSchema = z.infer<typeof deleteClientSchema>;
