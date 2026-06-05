import { apiClient } from "@/utils/api";

const getAllUserApi = async (page = 1, limit = 10) => {
  const response = await apiClient.get("/user", {
    params: { page, limit },
  });
  return response.data;
};

export const UserApi = {
  getAllUserApi,
};
