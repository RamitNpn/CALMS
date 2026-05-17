import { apiClient } from "@/utils/api";

interface LogResponse {
  success: boolean;
  data: Array<{
    id: string;
    timestamp: string;
    action: string;
    userId: string;
    userName: string;
    recordId?: string;
    recordName?: string;
    module: string;
    description: string;
    ipAddress?: string;
  }>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const getActivityLogs = async (
  module: string,
  page = 1,
  limit = 10,
  filters?: {
    action?: string;
    userId?: string;
    recordId?: string;
  }
) => {
  const params = new URLSearchParams({
    module,
    page: String(page),
    limit: String(limit),
  });

  if (filters?.action) params.append("action", filters.action);
  if (filters?.userId) params.append("userId", filters.userId);
  if (filters?.recordId) params.append("recordId", filters.recordId);

  const response = await apiClient.get<LogResponse>(
    `/logs/activity?${params.toString()}`
  );
  return response.data;
};

const createLog = async (logData: {
  action: string;
  userId: string;
  recordId?: string;
  recordName?: string;
  module: string;
  description: string;
  changes?: Array<{ field: string; oldValue: string; newValue: string }>;
}) => {
  const response = await apiClient.post("/logs/create", logData);
  return response.data;
};

const clearLogs = async (module: string) => {
  const response = await apiClient.delete(`/logs/clear`, {
    data: { module },
  });
  return response.data;
};

const exportLogs = async (
  module: string,
  format: "csv" | "json" = "csv"
) => {
  const response = await apiClient.get(`/logs/export`, {
    params: { module, format },
    responseType: format === "csv" ? "blob" : "json",
  });
  return response.data;
};

export const logApi = {
  getActivityLogs,
  createLog,
  clearLogs,
  exportLogs,
};
