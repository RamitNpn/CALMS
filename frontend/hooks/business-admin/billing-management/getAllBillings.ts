"use client";

import { useQuery } from "@tanstack/react-query";
import { billingApi } from "@/libs/api/billing.api";
import { UsePaginationParams } from "@/libs/types/shared.types";

export function useAllBillings({ page = 1, limit = 10, search, dateFilter }: UsePaginationParams & { search?: string; dateFilter?: string }) {
  return useQuery({
    queryKey: ["billings", page, limit, search, dateFilter],
    queryFn: () => billingApi.getAllBillingsApi(page, limit, search, dateFilter),
  });
}