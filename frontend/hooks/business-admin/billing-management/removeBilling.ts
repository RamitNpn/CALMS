"use client";

import { billingApi } from "@/libs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";

export function useDeleteBilling() {
  const queryClient = useQueryClient();
  const toast = useToast.getState();

  return useMutation({
    mutationFn: (id: string) => billingApi.deleteBillingApi(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["delete billing"] });
      toast.show({
        message: data?.message || "Billing deleted successfully",
        type: "success",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to delete billing";
      toast.show({
        message: errorMessage,
        type: "error",
      });
    },
  });
}
