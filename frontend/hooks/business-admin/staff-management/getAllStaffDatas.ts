"use client";

import { useQuery } from "@tanstack/react-query";
import { UsePaginationParams } from "@/libs/types/shared.types";
import { staffApi } from "@/libs/api/staff.api";

export function useAllStaff({ page = 1, limit = 10, search, dateFilter }: UsePaginationParams & { search?: string; dateFilter?: string }) {
  return useQuery({
    queryKey: ["staff", page, limit, search, dateFilter],
    queryFn: () => staffApi.getAllStaffApi(page, limit, search, dateFilter),
  });
}