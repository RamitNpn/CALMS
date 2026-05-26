"use client";

import { tokenApi } from "@/libs/api/token.api";
import { useQuery } from "@tanstack/react-query";

export function useGetLatestToken(date: string) {
  return useQuery({
    queryKey: ["latest-token", date],
    queryFn: () => tokenApi.getLatestDailyTokenApi(date),
    enabled: !!date,
  });
}
