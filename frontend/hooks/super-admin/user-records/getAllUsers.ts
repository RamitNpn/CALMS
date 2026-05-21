"use client";

import { useQuery } from "@tanstack/react-query";
import { UsePaginationParams } from "@/libs/types/shared.types";
import { apiClient } from "@/utils/api";

async function getAllUsersApi(page = 1, limit = 10) {
  const response = await apiClient.get("/user", {
    params: { page, limit },
  });
  return response.data;
}

export function useAllUsers({ page = 1, limit = 10 }: UsePaginationParams) {
  return useQuery({
    queryKey: ["users", page, limit],
    queryFn: () => getAllUsersApi(page, limit),
  });
}
