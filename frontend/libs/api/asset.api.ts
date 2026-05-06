import { apiClient } from "@/utils/api";
import { TCreateAssetSchema, TDeleteAssetSchema, TGetAssetByIdSchema, TUpdateAssetSchema } from "../validation/asset.validation";


export const createAsset = async (data: TCreateAssetSchema) => {
  const response = await apiClient.post("/assets", data);
  return response.data;
};

const getAllAssetApi = async (  page = 1,
  limit = 10) => {
  const response = await apiClient.get("/assets", {
    params: { page, limit }
  });
  return response.data;
};

const getAssetByIdApi = async (
  assetId: TGetAssetByIdSchema["_id"],
) => {
  const response = await apiClient.get(`/assets/${assetId}`);
  return response.data;
};

const updateAssetApi = async (
  assetId: string,
  data: Partial<TUpdateAssetSchema>,
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
