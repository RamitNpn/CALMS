"use client";

import { useQuery } from "@tanstack/react-query";
import { assetApi, UsePaginationParams } from "@/libs";

export const useAllAssets = ({
  page,
  limit,
  search,
  dateFilter,
}: UsePaginationParams) => {
  return useQuery({
    queryKey: [
      "assets",
      page,
      limit,
      search,
      dateFilter,
    ],

    queryFn: () =>
      assetApi.getAllAssetApi({
        page,
        limit,
        search,
        dateFilter,
      }),
  });
};