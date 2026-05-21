"use client";

import { useQuery } from "@tanstack/react-query";
import { UsePaginationParams } from "@/libs/types/shared.types";
import { assetTypeApi } from "@/libs/api/assetType.api";

export function useAllAssetTypes({ page = 1, limit = 10, business_id }: UsePaginationParams) {
  return useQuery({
    queryKey: ["asset-types", page, limit, business_id],
    queryFn: () => assetTypeApi.getAllAssetTypesApi(page, limit, business_id),
  });
}
