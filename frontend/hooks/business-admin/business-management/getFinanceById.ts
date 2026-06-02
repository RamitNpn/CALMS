"use client";

import { financeApi } from "@/libs/api/finance.api";
import { useQuery } from "@tanstack/react-query";

export function useFinanceById(financeId: string) {
  return useQuery({
    queryKey: ["finance by Id"],
    queryFn: () => financeApi.getFinanceByIdApi(financeId),
  });
}