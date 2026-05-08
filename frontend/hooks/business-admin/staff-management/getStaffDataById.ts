"use client";

import { StaffApi } from "@/libs";
import { useQuery } from "@tanstack/react-query";

export function useStaffById(staffId: string) {
  return useQuery({
    queryKey: ["staff by Id"],
    queryFn: () => StaffApi.getStaffByIdApi(staffId),
  });
}