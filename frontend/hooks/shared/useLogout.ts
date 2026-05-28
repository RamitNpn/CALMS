"use client";

import { userLogoutApi } from "@/libs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";

export function useLogout() {
  const queryClient = useQueryClient();
  const toast = useToast.getState();

  return useMutation({
    mutationFn: (id: string) => userLogoutApi(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["logout"] });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to logout user";
      toast.show({
        message: errorMessage,
        type: "error",
      });
    },
  });
}
