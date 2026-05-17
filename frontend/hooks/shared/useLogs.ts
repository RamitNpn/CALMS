import { useQuery, useMutation } from "@tanstack/react-query";
import { logApi } from "@/libs/api/logs.api";

export const useActivityLogs = (
  module: string,
  page = 1,
  limit = 10,
  filters?: {
    action?: string;
    userId?: string;
    recordId?: string;
  }
) => {
  return useQuery({
    queryKey: ["logs", module, page, limit, filters],
    queryFn: () => logApi.getActivityLogs(module, page, limit, filters),
    staleTime: 60000, // 1 minute
  });
};

export const useCreateLog = () => {
  return useMutation({
    mutationFn: (logData: Parameters<typeof logApi.createLog>[0]) =>
      logApi.createLog(logData),
  });
};

export const useClearLogs = () => {
  return useMutation({
    mutationFn: (module: string) => logApi.clearLogs(module),
  });
};

export const useExportLogs = () => {
  return useMutation({
    mutationFn: ({
      module,
      format = "csv" as const,
    }: {
      module: string;
      format?: "csv" | "json";
    }) => logApi.exportLogs(module, format),
  });
};
