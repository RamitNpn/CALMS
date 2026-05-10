"use client";

import { useQuery } from "@tanstack/react-query";
import { UsePaginationParams } from "@/libs/types/shared.types";
import { attendanceApi } from "@/libs/api/attendance.api";

export function useAllAttendance({ page = 1, limit = 10 }: UsePaginationParams) {
  return useQuery({
    queryKey: ["attendance", page, limit],
    queryFn: () => attendanceApi.getAllAttendanceApi(page, limit),
  });
}
