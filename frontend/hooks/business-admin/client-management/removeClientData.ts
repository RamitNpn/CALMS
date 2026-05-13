"use client";

import { clientApi } from "@/libs/api/client.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";

export function useDeleteClient() {
  const queryClient = useQueryClient();
  const toast = useToast.getState();

  return useMutation({
    mutationFn: (id: string) => clientApi.deleteClientApi(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["delete client"] });
      toast.show({
        message: data?.message || "Client deleted successfully",
        type: "success",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to delete client";
      toast.show({
        message: errorMessage,
        type: "error",
      });
    },
  });
}
