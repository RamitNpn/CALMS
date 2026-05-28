"use client";

import { staffApi } from "@/libs/api/staff.api";
import { useQuery } from "@tanstack/react-query";

export function useStaffById(staffId: string) {
  return useQuery({
    queryKey: ["staff by Id", staffId],
    queryFn: () => staffApi.getStaffByIdApi(staffId),
  });
}