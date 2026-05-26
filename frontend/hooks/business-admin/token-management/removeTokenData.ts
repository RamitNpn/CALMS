"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";
import { tokenApi } from "@/libs/api/token.api";

export function useDeleteToken() {
  const queryClient = useQueryClient();
  const toast = useToast.getState();

  return useMutation({
    mutationFn: (id: string) => tokenApi.deleteTokenApi(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["delete token"] });
      toast.show({
        message: data?.message || "Token deleted successfully",
        type: "success",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to delete token";
      toast.show({
        message: errorMessage,
        type: "error",
      });
    },
  });
}
