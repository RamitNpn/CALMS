"use client";

import { financeApi } from "@/libs/api/finance.api";
import { UsePaginationParams } from "@/libs/types/shared.types";
import { useQuery } from "@tanstack/react-query";

export function useAllFinance({ page = 1, limit = 10 }: UsePaginationParams) {
  return useQuery({
    queryKey: ["finance", page, limit],
    queryFn: () => financeApi.getAllFinancesApi(page, limit),
  });
}