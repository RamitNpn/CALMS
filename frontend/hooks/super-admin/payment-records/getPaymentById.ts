"use client";

import { useQuery } from "@tanstack/react-query";
import { paymentApi } from "@/libs/api/payment.api";

export function usePaymentById(paymentId: string) {
  return useQuery({
    queryKey: ["payment by Id"],
    queryFn: () => paymentApi.getPaymentByIdApi(paymentId),
  });
}