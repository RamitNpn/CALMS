"use client";

import { useQuery } from "@tanstack/react-query";
import { financeApi } from "@/libs/api/finance.api";

export const useAllFinance = ({
  page,
  limit,
  search,
  dateFilter,
}: {
  page: number;
  limit: number;
  search?: string;
  dateFilter?: string;
}) => {
  return useQuery({
    queryKey: [
      "finance",
      page,
      limit,
      search,
      dateFilter,
    ],

    queryFn: () =>
      financeApi.getAllFinancesApi({
        page,
        limit,
        search,
        dateFilter,
      }),
  });
};