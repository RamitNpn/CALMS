"use client";

import { useQuery } from "@tanstack/react-query";
import { UsePaginationParams } from "@/libs/types/shared.types";
import { billingApi } from "@/libs/api/billing.api";

export function useAllBillings({ page = 1, limit = 10 }: UsePaginationParams) {
  return useQuery({
    queryKey: ["billings", page, limit],
    queryFn: () => billingApi.getAllBillingsApi(page, limit),
  });
}
