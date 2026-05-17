"use client";

import { useQuery } from "@tanstack/react-query";
import { serviceApi } from "@/libs/api/service.api";

export function useAllService() {
  return useQuery({
    queryKey: ["services"],
    queryFn: () => serviceApi.getAllServicesApi(),
  });
}