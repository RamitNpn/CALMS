import { apiClient } from "@/utils/api";
import { UsePaginationParams } from "../types/shared.types";

const getAllUserApi = async (params: UsePaginationParams) => {
  const response = await apiClient.get("/user", {
    params,
  });
  return response.data;
};

export const UserApi = {
  getAllUserApi,
};
