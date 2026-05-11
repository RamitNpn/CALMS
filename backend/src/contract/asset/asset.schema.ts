import { z } from "zod";

export const customFieldsSchema = z.record(
  z.string(),
  z.string()
);

export const createAssetSchema = z.object({
  business_id: z.string().min(1, "Business ID is required"),
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  customFields: customFieldsSchema.optional(),
  status: z.string().optional(),
});

export const getAssetByIDSchema = z.object({
  _id: z.string(),
  business_id: z.string(),
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  customFields: customFieldsSchema.optional(),
  status: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const getAllAssetsSchema = z.array(getAssetByIDSchema);

export const updateAssetSchema = z.object({
  _id: z.string().min(1, "Asset ID is required"),
  name: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  customFields: customFieldsSchema.optional(),
  status: z.string().optional(),
});

export const updateAssetBodySchema = z.object({
  name: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  customFields: customFieldsSchema.optional(),
  status: z.string().optional(),
});

export const removeAssetSchema = z.object({
  _id: z.string(),
});