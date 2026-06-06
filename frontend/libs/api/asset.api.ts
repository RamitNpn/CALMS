import { apiClient } from "@/utils/api";
import {
  TCreateAssetSchema,
  TDeleteAssetSchema,
  TGetAssetByIdSchema,
  TUpdateAssetSchema,
} from "../validation/asset.validation";
import { UsePaginationParams } from "../types/shared.types";

const createAsset = async (data: TCreateAssetSchema) => {
  const response = await apiClient.post("/assets", data);
  return response.data;
};

const getAllAssetApi = async (params: UsePaginationParams) => {
  const response = await apiClient.get("/assets", {
    params,
  });
  return response.data;
};

const getAssetByIdApi = async (assetId: TGetAssetByIdSchema["_id"]) => {
  const response = await apiClient.get(`/assets/${assetId}`);
  return response.data;
};

const updateAssetApi = async (
  assetId: string,
  data: Omit<Partial<TUpdateAssetSchema>, "_id">,
) => {
  const response = await apiClient.put(`/assets/${assetId}`, data);
  return response.data;
};

const deleteAssetApi = async (assetId: TDeleteAssetSchema["_id"]) => {
  const response = await apiClient.delete(`/assets/${assetId}`);
  return response.data;
};

export const assetApi = {
  createAsset,
  getAllAssetApi,
  getAssetByIdApi,
  updateAssetApi,
  deleteAssetApi,
};
