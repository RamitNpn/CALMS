import { z } from "zod";

export const createAssetTypeSchema = z.object({
  business_id: z.string().min(1, "Business ID is required"),
  typeName: z.string().min(2, "Type name is required").max(100),
  description: z.string().max(200).optional(),
});

export type TCreateAssetTypeSchema = z.infer<typeof createAssetTypeSchema>;

export const getAssetTypeByIdSchema = z.object({
  _id: z.string().min(1, "Asset Type ID is required"),
  business_id: z.string().min(1, "Business ID is required"),
  typeName: z.string().min(2, "Type name is required").max(100),
  description: z.string().max(200).optional(),
});

export type TGetAssetTypeByIdSchema = z.infer<typeof getAssetTypeByIdSchema>;

export const getAllAssetTypesSchema = z.array(getAssetTypeByIdSchema);

export type TGetAllAssetTypesSchema = z.infer<typeof getAllAssetTypesSchema>;

export const updateAssetTypeSchema = z.object({
  typeName: z.string().min(2, "Type name is required").max(100).optional(),
  description: z.string().max(200).optional(),
});

export type TUpdateAssetTypeSchema = z.infer<typeof updateAssetTypeSchema>;

export const deleteAssetTypeSchema = z.object({
  _id: z.string().min(1, "Asset Type ID is required"),
});

export type TDeleteAssetTypeSchema = z.infer<typeof deleteAssetTypeSchema>;
