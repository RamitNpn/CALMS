"use client";

import { billingApi } from "@/libs";
import { useQuery } from "@tanstack/react-query";

export function useBillingById(billingId: string) {
  return useQuery({
    queryKey: ["billing by Id"],
    queryFn: () => billingApi.getBillingByIdApi(billingId),
  });
}