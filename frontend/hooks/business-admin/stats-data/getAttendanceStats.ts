"use client";

import { statsApi } from "@/libs";
import { useQuery } from "@tanstack/react-query";

export function useAttendanceStats() {
  return useQuery({
    queryKey: ["attendance-stats"],
    queryFn: () => statsApi.getBusinessAttendanceStatsApi(),
  });
}