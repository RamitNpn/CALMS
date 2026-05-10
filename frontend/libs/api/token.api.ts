import { apiClient } from "@/utils/api";

const createToken = async (data: any) => {
  const response = await apiClient.post("/tokens", data);
  return response.data;
};

const getAllTokensApi = async (page = 1, limit = 10) => {
  const response = await apiClient.get("/tokens", {
    params: { page, limit },
  });
  return response.data;
};

const getTokenByIdApi = async (tokenId: string) => {
  const response = await apiClient.get(`/tokens/${tokenId}`);
  return response.data;
};

const updateTokenApi = async (tokenId: string, data: any) => {
  const response = await apiClient.put(`/tokens/${tokenId}`, data);
  return response.data;
};

const deleteTokenApi = async (tokenId: string) => {
  const response = await apiClient.delete(`/tokens/${tokenId}`);
  return response.data;
};

export const tokenApi = {
  createToken,
  getAllTokensApi,
  getTokenByIdApi,
  updateTokenApi,
  deleteTokenApi,
};
