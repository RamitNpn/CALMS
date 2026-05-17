import { apiClient } from "@/utils/api";
import {
  TDeleteClientSchema,
} from "../validation/client.validation";

const getAllLogApi = async (page = 1, limit = 10) => {
  const response = await apiClient.get("/log", {
    params: { page, limit, },
  });
  return response.data;
};

const deleteLogApi = async (logId: TDeleteClientSchema["_id"]) => {
  const response = await apiClient.delete(`/log/${logId}`);
  return response.data;
};

export const logApi = {
  getAllLogApi,
  deleteLogApi,
};
