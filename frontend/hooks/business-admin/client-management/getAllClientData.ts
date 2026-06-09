"use client";

import { clientApi } from "@/libs/api/client.api";
import { UsePaginationParams } from "@/libs/types/shared.types";
import { useQuery } from "@tanstack/react-query";

export function useAllClients({ page = 1, limit = 10, search, dateFilter }: UsePaginationParams & { search?: string; dateFilter?: string }) {
  return useQuery({
    queryKey: ["clients", page, limit, search, dateFilter],
    queryFn: () => clientApi.getAllClientApi(page, limit, search, dateFilter),
  });
}