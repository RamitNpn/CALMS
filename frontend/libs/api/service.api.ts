import { apiClient } from "@/utils/api";
import { TDeleteServiceSchema, TGetServiceByIdSchema, TUpdateServiceSchema } from "../validation/service.validation";

const getAllServicesApi = async () => {
  const response = await apiClient.get("/services");
  return response.data;
};

const getServiceByIdApi = async (serviceId: TGetServiceByIdSchema["_id"]) => {
  const response = await apiClient.get(`/services/${serviceId}`);
  return response.data;
};


const updateServiceApi = async (serviceId: string, data: TUpdateServiceSchema) => {
  const response = await apiClient.put(`/services/${serviceId}`, data);
  return response.data;
};

const deleteServiceApi = async (serviceId: TDeleteServiceSchema["_id"]) => {
  const response = await apiClient.delete(`/services/${serviceId}`);
  return response.data;
};

export const serviceApi = {
  getAllServicesApi,
  getServiceByIdApi,
  updateServiceApi,
  deleteServiceApi,
};
