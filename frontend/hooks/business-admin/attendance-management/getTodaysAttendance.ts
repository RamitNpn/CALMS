"use client";

import { useQuery } from "@tanstack/react-query";
import { UsePaginationParams } from "@/libs/types/shared.types";
import { attendanceApi } from "@/libs/api/attendance.api";

export function useTodayAttendance({ page = 1, limit = 10, business_id }: UsePaginationParams & { business_id: string }) {
  return useQuery({
    queryKey: ["today-attendance", page, limit, business_id],
    queryFn: () => attendanceApi.getTodayAttendanceApi(page, limit, business_id),
  });
}
