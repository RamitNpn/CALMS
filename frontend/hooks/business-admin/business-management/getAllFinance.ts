"use client";

import { useQuery } from "@tanstack/react-query";
import { financeApi } from "@/libs/api/finance.api";
import { UsePaginationParams } from "@/libs";

export const useAllFinance = ({
  page,
  limit,
  search,
  dateFilter,
}: UsePaginationParams) => {
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