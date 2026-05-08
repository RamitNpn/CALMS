"use client";

import { attendanceApi } from "@/libs";
import { useQuery } from "@tanstack/react-query";

export function useAttendanceById(attendanceId: string) {
  return useQuery({
    queryKey: ["attendance by Id"],
    queryFn: () => attendanceApi.getAttendanceByIdApi(attendanceId),
  });
}
