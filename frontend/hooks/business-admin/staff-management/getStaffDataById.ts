"use client";

import { staffApi } from "@/libs";
import { useQuery } from "@tanstack/react-query";

export function useStaffById(staffId: string) {
  return useQuery({
    queryKey: ["staff by Id"],
    queryFn: () => staffApi.getStaffByIdApi(staffId),
  });
}