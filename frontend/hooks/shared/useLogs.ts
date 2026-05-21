import { logApi } from "@/libs/api/log.api";
import { useQuery } from "@tanstack/react-query";

type ActivityLogFilters = {
  module?: string;
  action?: string;
  userId?: string;
  recordId?: string;
};

export const useActivityLogs = (
  page = 1,
  limit = 10,
  filters: ActivityLogFilters = {}
) => {
  return useQuery({
    queryKey: ["logs", page, limit, filters],
    queryFn: () => logApi.getActivityLogsApi(page, limit, filters),
    staleTime: 60000,
  });
};