"use client";

import { useQuery } from "@tanstack/react-query";
import { UsePaginationParams } from "@/libs/types/shared.types";
import { StaffApi } from "@/libs";

export function useAllStaff({ page = 1, limit = 10 }: UsePaginationParams) {
  return useQuery({
    queryKey: ["staff", page, limit],
    queryFn: () => StaffApi.getAllStaffApi(page, limit),
  });
}