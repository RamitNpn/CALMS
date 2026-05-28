import { apiClient } from "@/utils/api";
import {
  TCreateBusinessSchema,
  TDeleteBusinessSchema,
  TGetAllBusinessByIdSchema,
  TAdminUpdateBusinessSchema,
} from "../validation/business.validation";

const createBusiness = async (data: TCreateBusinessSchema) => {
  const res = await apiClient.post("/business", data);
  return res.data;
};

const getAllBusinessApi = async (page = 1, limit = 10) => {
  const response = await apiClient.get("/business", {
    params: { page, limit },
  });
  return response.data;
};

const getBusinessByIdApi = async (
  businessId: TGetAllBusinessByIdSchema["_id"],
) => {
  const response = await apiClient.get(`/business/${businessId}`);
  return response.data;
};

const updateBusinessApi = async (
  businessId: string,
  data: TAdminUpdateBusinessSchema,
) => {
  const response = await apiClient.put(`/business/${businessId}`, data);
  return response.data;
};

const deleteBusinessApi = async (businessId: TDeleteBusinessSchema["_id"]) => {
  const response = await apiClient.delete(`/business/${businessId}`);
  return response.data;
};

export const businessApi = {
  createBusiness,
  getAllBusinessApi,
  getBusinessByIdApi,
  updateBusinessApi,
  deleteBusinessApi,
};
