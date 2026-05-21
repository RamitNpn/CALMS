import { apiClient } from "@/utils/api";
import { TDeleteClientSchema } from "../validation/client.validation";

type ActivityLogFilters = {
  module?: string;
  action?: string;
  userId?: string;
  recordId?: string;
};

const getActivityLogsApi = async (
  page = 1,
  limit = 10,
  filters: ActivityLogFilters = {}
) => {
  const response = await apiClient.get("/logs", {
    params: {
      page: Number(page),
      limit: Number(limit),
      ...filters,
    },
  });

  return response.data;
};

const deleteLogApi = async (logId: TDeleteClientSchema["_id"]) => {
  const response = await apiClient.delete(`/logs/${logId}`);
  return response.data;
};

export const logApi = {
  getActivityLogsApi,
  deleteLogApi,
};