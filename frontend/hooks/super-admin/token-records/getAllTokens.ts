"use client";

import { useQuery } from "@tanstack/react-query";
import { UsePaginationParams } from "@/libs/types/shared.types";
import { tokenApi } from "@/libs/api/token.api";

export function useAllTokens({ page = 1, limit = 10 }: UsePaginationParams) {
  return useQuery({
    queryKey: ["tokens", page, limit],
    queryFn: () => tokenApi.getAllTokensApi(page, limit),
  });
}
