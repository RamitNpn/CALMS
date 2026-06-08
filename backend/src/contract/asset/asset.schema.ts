import { z } from "zod";

export const customFieldsSchema = z.record(z.string(), z.string());

export const createAssetSchema = z.object({
  business_id: z.string().min(1, "Business ID is required"),
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  price: z.coerce.number().min(1).optional(),
  image: z.any().optional(),
  customFields: z.preprocess((value) => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return {};
      }
    }
    return value;
  }, customFieldsSchema.optional()),

  status: z.string().optional(),
});

export const getAssetByIDSchema = z.object({
  _id: z.string(),
  business_id: z.string(),
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  price: z.number().optional(),
  image: z.string().optional(),
  customFields: customFieldsSchema.optional(),
  status: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const getAllAssetsSchema = z.array(getAssetByIDSchema);

export const updateAssetBodySchema = z.object({
  name: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  price: z.coerce.number().min(1).optional(),
  image: z.any().optional(),
  customFields: z.preprocess((value) => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return {};
      }
    }
    return value;
  }, customFieldsSchema.optional()),
  status: z.string().optional(),
});

export const removeAssetSchema = z.object({
  _id: z.string(),
});
