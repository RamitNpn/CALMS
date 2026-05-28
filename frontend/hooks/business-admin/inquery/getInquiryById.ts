"use client";

import { inquiryApi } from "@/libs/api/inquery.api";
import { useQuery } from "@tanstack/react-query";

export function useInquiryById(inquiryId: string) {
  return useQuery({
    queryKey: ["inquiry by Id"],
    queryFn: () => inquiryApi.getInquiryById(inquiryId),
  });
}