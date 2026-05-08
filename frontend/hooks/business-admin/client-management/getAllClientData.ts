"use client";

import { clientApi } from "@/libs/api/client.api";
import { UsePaginationParams } from "@/libs/types/shared.types";
import { useQuery } from "@tanstack/react-query";

export function useAllClients({ page = 1, limit = 10 }: UsePaginationParams) {
  return useQuery({
    queryKey: ["clients", page, limit],
    queryFn: () => clientApi.getAllClientApi(page, limit),
  });
}