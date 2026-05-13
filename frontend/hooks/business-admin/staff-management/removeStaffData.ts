"use client";

import { staffApi } from "@/libs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";

export function useDeleteStaff() {
  const queryClient = useQueryClient();
  const toast = useToast.getState();

  return useMutation({
    mutationFn: (id: string) => staffApi.deleteStaffApi(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["delete staff"] });
      toast.show({
        message: data?.message || "Staff deleted successfully",
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
