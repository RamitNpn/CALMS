"use client";

import { attendanceApi } from "@/libs/api/attendance.api";
import { UsePaginationParams } from "@/libs/types/shared.types";
import { useQuery } from "@tanstack/react-query";

export function useAllAttendances({ page = 1, business_id }: UsePaginationParams) {
  return useQuery({
    queryKey: ["attendances", page],
    queryFn: () => attendanceApi.getAllAttendanceApi({page, business_id}),
    staleTime: 0,
    refetchInterval: 15000,
    refetchIntervalInBackground: false,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}