"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";
import { inquiryApi } from "@/libs/api/inquery.api";

export function useDeleteInquiry() {
  const queryClient = useQueryClient();
  const toast = useToast.getState();

  return useMutation({
    mutationFn: (id: string) => inquiryApi.deleteInquiry(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["delete inquiry"] });
      toast.show({
        message: data?.message || "Inquiry deleted successfully",
        type: "success",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to delete inquiry";
      toast.show({
        message: errorMessage,
        type: "error",
      });
    },
  });
}
