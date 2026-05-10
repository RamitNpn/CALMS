"use client";

import { useQuery } from "@tanstack/react-query";
import { UsePaginationParams } from "@/libs/types/shared.types";
import { businessApi } from "@/libs/api/business.api";

export function useAllBusinesses({ page = 1, limit = 10 }: UsePaginationParams) {
  return useQuery({
    queryKey: ["businesses", page, limit],
    queryFn: () => businessApi.getAllBusinessApi(page, limit),
  });
}
