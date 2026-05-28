import { apiClient } from "@/utils/api";
import { TCreateAssetTypeSchema, TDeleteAssetTypeSchema, TGetAssetTypeByIdSchema, TUpdateAssetTypeSchema } from "../validation/assetType.validation";


const createAssetType = async (data: TCreateAssetTypeSchema) => {
  const response = await apiClient.post("/atype", data);
  return response.data;
};

const getAllAssetTypesApi = async (  page = 1,
  limit = 10, business_id: string | undefined) => {
  const response = await apiClient.get("/atype", {
    params: { page, limit, business_id }
  });
  return response.data;
};

const getAssetTypeByIdApi = async (
  assetTypeId: TGetAssetTypeByIdSchema["_id"],
) => {
  const response = await apiClient.get(`/atype/${assetTypeId}`);
  return response.data;
};

const updateAssetTypeApi = async (
  assetTypeId: string,
  data: Omit<Partial<TUpdateAssetTypeSchema>, "_id">,
) => {
  const response = await apiClient.put(`/atype/${assetTypeId}`, data);
  return response.data;
};

const deleteAssetTypeApi = async (assetTypeId: TDeleteAssetTypeSchema["_id"]) => {
  const response = await apiClient.delete(`/atype/${assetTypeId}`);
  return response.data;
};

export const assetTypeApi = {
  createAssetType,
  getAllAssetTypesApi,
  getAssetTypeByIdApi,
  updateAssetTypeApi,
  deleteAssetTypeApi,
};
