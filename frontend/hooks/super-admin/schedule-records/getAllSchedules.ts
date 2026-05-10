"use client";

import { useQuery } from "@tanstack/react-query";
import { UsePaginationParams } from "@/libs/types/shared.types";
import { scheduleApi } from "@/libs/api/schedule.api";

export function useAllSchedules({ page = 1, limit = 10 }: UsePaginationParams) {
  return useQuery({
    queryKey: ["schedules", page, limit],
    queryFn: () => scheduleApi.getAllSchedulesApi(page, limit),
  });
}
