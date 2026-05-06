"use client";

import { useQuery } from "@tanstack/react-query";
import { businessApi } from "@/libs/api/business.api";

interface UseBusinessesParams {
  page?: number;
  limit?: number;
}

export function useAllBusinesses({ page = 1, limit = 10 }: UseBusinessesParams) {
  return useQuery({
    queryKey: ["businesses", page, limit],
    queryFn: () => businessApi.getAllBusinessApi(page, limit),
  });
}