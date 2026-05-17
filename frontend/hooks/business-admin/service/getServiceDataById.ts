"use client";

import { serviceApi } from "@/libs/api/service.api";
import { useQuery } from "@tanstack/react-query";

export function useServiceById(serviceId: string) {
  return useQuery({
    queryKey: ["services", serviceId],
    queryFn: () => serviceApi.getServiceByIdApi(serviceId),
  });
}