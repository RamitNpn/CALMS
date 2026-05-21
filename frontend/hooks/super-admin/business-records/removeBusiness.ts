"use client";

import { businessApi } from "@/libs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";

export function useDeleteBusiness() {
  const queryClient = useQueryClient();
  const toast = useToast.getState();

  return useMutation({
    mutationFn: (id: string) => businessApi.deleteBusinessApi(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["delete business"] });
      toast.show({
        message: data?.message || "Business deleted successfully",
        type: "success",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to delete business";
      toast.show({
        message: errorMessage,
        type: "error",
      });
    },
  });
}
