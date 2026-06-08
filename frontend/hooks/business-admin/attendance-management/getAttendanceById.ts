"use client";

import { attendanceApi } from "@/libs/api/attendance.api";
import { useQuery } from "@tanstack/react-query";

export function useAttendanceById(attendanceId: string) {
  return useQuery({
    queryKey: ["attendance by Id", attendanceId],
    queryFn: () => attendanceApi.getAttendanceByIdApi(attendanceId),
  });
}
