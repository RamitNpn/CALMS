"use client";

import { useQuery } from "@tanstack/react-query";
import { UsePaginationParams } from "@/libs/types/shared.types";
import { attendanceApi } from "@/libs/api/attendance.api";

export function useTodayAttendance({ page = 1, limit = 1000, business_id, search, role }: UsePaginationParams) {
  return useQuery({
    queryKey: ["today-attendance", page, limit, business_id, search, role],
    queryFn: () => attendanceApi.getTodayAttendanceApi({page, limit, business_id, search, role}),
  });
}
