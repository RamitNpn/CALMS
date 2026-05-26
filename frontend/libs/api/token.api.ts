import { apiClient } from "@/utils/api";
import {
  TCreateTokenSchema,
  TGetTokenByIdSchema,
  TUpdateTokenSchema,
} from "../validation/token.validation";

export const createToken = async (data: TCreateTokenSchema) => {
  const res = await apiClient.post("/token", data);
  return res.data;
};

const getAllTokensApi = async (page = 1, limit = 10) => {
  const response = await apiClient.get("/token", {
    params: { page, limit, role: "staff" },
  });
  return response.data;
};

const getTokenByIdApi = async (tokenId: TGetTokenByIdSchema["_id"]) => {
  const response = await apiClient.get(`/token/${tokenId}`);
  return response.data;
};

const getLatestDailyTokenApi = async (date: string) => {
  const response = await apiClient.get(
    `/token?date=${date}`,
  );
  return response.data;
};

const updateTokenApi = async (tokenId: string, data: TUpdateTokenSchema) => {
  const response = await apiClient.put(`/token/${tokenId}`, data);
  return response.data;
};

const deleteTokenApi = async (tokenId: TGetTokenByIdSchema["_id"]) => {
  const response = await apiClient.delete(`/token/${tokenId}`);
  return response.data;
};

export const tokenApi = {
  createToken,
  getAllTokensApi,
  getTokenByIdApi,
  getLatestDailyTokenApi,
  updateTokenApi,
  deleteTokenApi,
};
