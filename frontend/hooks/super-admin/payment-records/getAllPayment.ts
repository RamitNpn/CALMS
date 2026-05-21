"use client";

import { useQuery } from "@tanstack/react-query";
import { UsePaginationParams } from "@/libs/types/shared.types";
import { paymentApi } from "@/libs/api/payment.api";

export function useAllPayments({ page = 1, limit = 10 }: UsePaginationParams) {
  return useQuery({
    queryKey: ["payments", page, limit],
    queryFn: () => paymentApi.getAllPaymentsApi(page, limit),
  });
}