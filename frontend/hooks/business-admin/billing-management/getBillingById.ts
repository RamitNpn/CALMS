"use client";

import { billingApi } from "@/libs/api/billing.api";
import { useQuery } from "@tanstack/react-query";

export function useBillingById(billingId: string) {
  return useQuery({
    queryKey: ["billing by Id", billingId],
    queryFn: () => billingApi.getBillingByIdApi(billingId),
  });
}