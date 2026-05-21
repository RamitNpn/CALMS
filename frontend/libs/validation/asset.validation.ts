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

export type TCreateAssetSchema = z.infer<typeof createAssetSchema>;

export const assetByIdSchema = z.object({
  _id: z.string(),
  business_id: z.string(),
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  customFields: customFieldsSchema.optional(),
  status: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TGetAssetByIdSchema = z.infer<typeof assetByIdSchema>;

export const getAllAssetsSchema = z.array(assetByIdSchema);

export type TGetAllAssetSchema = z.infer<typeof getAllAssetsSchema>;

export const updateAssetSchema = z.object({
  _id: z.string().min(1, "Asset ID is required"),
  name: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  customFields: customFieldsSchema.optional(),
  status: z.string().optional(),
});

export type TUpdateAssetSchema = z.infer<typeof updateAssetSchema>;

export const removeAssetSchema = z.object({
  _id: z.string().min(1, "Asset ID is required"),
});

export type TDeleteAssetSchema = z.infer<typeof removeAssetSchema>;

export const updateAssetFormSchema = z.object({
  _id: z.string().min(1, "Asset ID is required"),
  name: z.string().min(1, "Asset name is required"),
  type: z.string().min(1, "Asset type is required"),
  customFieldsArray: z.array(
    z.object({
      key: z.string(),
      value: z.string(),
    })
  ).optional(),
  status: z.string().optional(),
});

export type TUpdateAssetFormSchema = z.infer<typeof updateAssetFormSchema>;