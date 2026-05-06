"use client";

import { useQuery } from "@tanstack/react-query";
import { UsePaginationParams } from "@/libs/types/shared.types";
import { assetApi } from "@/libs/api/asset.api";

export function useAllAssets({ page = 1, limit = 10 }: UsePaginationParams) {
  return useQuery({
    queryKey: ["assets", page, limit],
    queryFn: () => assetApi.getAllAssetApi(page, limit),
  });
}