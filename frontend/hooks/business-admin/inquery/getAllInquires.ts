"use client";

import { useQuery } from "@tanstack/react-query";
import { inquiryApi } from "@/libs/api/inquery.api";

export const useAllInquiries = ({
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
      "inquiries",
      page,
      limit,
      search,
      dateFilter,
    ],

    queryFn: () =>
      inquiryApi.getAllInquiries({
        page,
        limit,
        search,
        dateFilter,
      }),
  });
};