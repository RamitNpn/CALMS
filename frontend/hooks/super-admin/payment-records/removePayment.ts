"use client";

import { paymentApi } from "@/libs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";

export function useDeletePayment() {
  const queryClient = useQueryClient();
  const toast = useToast.getState();

  return useMutation({
    mutationFn: (id: string) => paymentApi.deletePaymentApi(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["delete payment"] });
      toast.show({
        message: data?.message || "Payment deleted successfully",
        type: "success",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to delete payment";
      toast.show({
        message: errorMessage,
        type: "error",
      });
    },
  });
}
