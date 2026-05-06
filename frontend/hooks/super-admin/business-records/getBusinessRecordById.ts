"use client";

import { useQuery } from "@tanstack/react-query";
import { businessApi } from "@/libs/api/business.api";

export function useBusinessById(businessId: string) {
  return useQuery({
    queryKey: ["business by Id"],
    queryFn: () => businessApi.getBusinessByIdApi(businessId),
  });
}