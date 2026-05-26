"use client";

import { useQuery } from "@tanstack/react-query";
import { UsePaginationParams } from "@/libs/types/shared.types";
import { inquiryApi } from "@/libs/api/inquery.api";

export function useAllInquiries({ page = 1, limit = 10 }: UsePaginationParams) {
  return useQuery({
    queryKey: ["inquiries", page, limit],
    queryFn: () => inquiryApi.getAllInquiries(page, limit),
  });
}