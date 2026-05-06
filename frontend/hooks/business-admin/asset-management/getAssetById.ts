"use client";

import { assetApi } from "@/libs/api/asset.api";
import { useQuery } from "@tanstack/react-query";

export function useAssetById(assetId: string) {
  return useQuery({
    queryKey: ["asset by Id"],
    queryFn: () => assetApi.getAssetByIdApi(assetId),
  });
}