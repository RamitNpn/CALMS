"use client";

import { serviceApi } from "@/libs/api/service.api";
import { useQuery } from "@tanstack/react-query";

export function useServiceByBusinessId(business_id: string) {
  return useQuery({
    queryKey: ["business-services", business_id],
    queryFn: () => serviceApi.getServiceByBusinessIdApi(business_id),
  });
}