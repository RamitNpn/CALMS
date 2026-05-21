"use client";

import { clientApi } from "@/libs/api/client.api";
import { useQuery } from "@tanstack/react-query";

export function useClientById(clientId: string) {
  return useQuery({
    queryKey: ["client by Id"],
    queryFn: () => clientApi.getClientByIdApi(clientId),
  });
}