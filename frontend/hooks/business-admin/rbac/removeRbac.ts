"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";
import { rbacApi } from "@/libs/api/rbac.api";

export function useDeleteRbac() {
  const queryClient = useQueryClient();
  const toast = useToast.getState();

  return useMutation({
    mutationFn: (id: string) => rbacApi.deleteRbacRole(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["delete rbac"] });
      toast.show({
        message: data?.message || "Role deleted successfully",
        type: "success",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to delete staff";
      toast.show({
        message: errorMessage,
        type: "error",
      });
    },
  });
}
