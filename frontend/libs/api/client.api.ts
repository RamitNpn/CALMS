import { apiClient } from "@/utils/api";
import {
  TCreateClientSchema,
  TDeleteClientSchema,
  TGetClientByIdSchema,
} from "../validation/client.validation";

export const createClient = async (data: TCreateClientSchema) => {
  const res = await apiClient.post("/user", data, {});
  return res.data;
};

const getAllClientApi = async (page = 1, limit = 10) => {
  const response = await apiClient.get("/user", {
    params: { page, limit, role: "client" },
  });
  return response.data;
};

const getClientByIdApi = async (ClientId: TGetClientByIdSchema["_id"]) => {
  const response = await apiClient.get(`/user/${ClientId}`);
  return response.data;
};

const updateClientApi = async (ClientId: string, formData: FormData) => {
  const response = await apiClient.put(`/user/${ClientId}`, formData, {
  });

  return response.data;
};

const deleteClientApi = async (ClientId: TDeleteClientSchema["_id"]) => {
  const response = await apiClient.delete(`/user/${ClientId}`);
  return response.data;
};

export const clientApi = {
  createClient,
  getAllClientApi,
  getClientByIdApi,
  updateClientApi,
  deleteClientApi,
};
