"use client";

import { useQuery } from "@tanstack/react-query";
import { billingApi, UsePaginationParams } from "@/libs";

export function useAllBillings({ page = 1, limit = 10 }: UsePaginationParams) {
  return useQuery({
    queryKey: ["billings", page, limit],
    queryFn: () => billingApi.getAllBillingsApi(page, limit),
  });
}