"use client";

import { useQuery } from "@tanstack/react-query";
import { UsePaginationParams } from "@/libs/types/shared.types";
import { staffApi } from "@/libs/api/staff.api";

export function useAllStaff({ page = 1, limit = 10 }: UsePaginationParams) {
  return useQuery({
    queryKey: ["staff", page, limit],
    queryFn: () => staffApi.getAllStaffApi(page, limit),
  });
}