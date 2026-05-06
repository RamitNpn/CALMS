import { z } from "zod";

export const tokenSchema = z.object({
  _id: z.string(),
  tenantId: z.string().min(1, "Tenant ID is required"),
  number: z.number().int().positive(),
  category: z.string().optional(),
  counter: z.string().optional(),
  status: z.enum(["WAITING", "CALLED", "DONE", "CANCELLED"]),
  clientId: z.string().optional(),
  calledAt: z.coerce.date().optional(),
  createdAt: z.date(),
});

export const getAllTokensSchema = z.array(tokenSchema);

export const getTokenByIDSchema = tokenSchema;

export const createTokenSchema = z.object({
  tenantId: z.string().min(1),
  number: z.number().int().positive(),
  category: z.string().optional(),
  counter: z.string().optional(),
  status: z.enum(["WAITING", "CALLED", "DONE", "CANCELLED"]).optional(),
  clientId: z.string().optional(),
  calledAt: z.coerce.date().optional(),
});

export const updateTokenSchema = z.object({
  _id: z.string().min(1, "Token ID is required"),
  status: z.enum(["WAITING", "CALLED", "DONE", "CANCELLED"]).optional(),
  counter: z.string().optional(),
  calledAt: z.coerce.date().optional(),
  clientId: z.string().optional(),
});

export const removeTokenSchema = z.object({
  _id: z.string().min(1, "Token ID is required"),
});