"use client";

import { statsApi } from "@/libs";
import { useQuery } from "@tanstack/react-query";

export function useAssetStats() {
  return useQuery({
    queryKey: ["asset-stats"],
    queryFn: () => statsApi.getBusinessAssetStatsApi(),
  });
}