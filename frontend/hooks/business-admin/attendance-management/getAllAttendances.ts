"use client";

import { attendanceApi, UsePaginationParams } from "@/libs";
import { useQuery } from "@tanstack/react-query";

export function useAllAttendances({ page = 1, limit = 10 }: UsePaginationParams) {
  return useQuery({
    queryKey: ["attendances", page, limit],
    queryFn: () => attendanceApi.getAllAttendanceApi(page, limit),
  });
}