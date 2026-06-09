"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";
import { financeApi } from "@/libs/api/finance.api";

export function useDeleteFinance() {
  const queryClient = useQueryClient();
  const toast = useToast.getState();

  return useMutation({
    mutationFn: (id: string) => financeApi.deleteFinanceApi(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["delete finance"] });
      toast.show({
        message: data?.message || "Finance deleted successfully",
        type: "success",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to delete finance";
      toast.show({
        message: errorMessage,
        type: "error",
      });
    },
  });
}
