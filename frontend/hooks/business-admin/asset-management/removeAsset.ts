"use client";

import { assetApi } from "@/libs/api/asset.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";

export function useDeleteAsset() {
  const queryClient = useQueryClient();
  const toast = useToast.getState();

  return useMutation({
    mutationFn: (id: string,) => assetApi.deleteAssetApi(id),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["delete asset"] });
      toast.show({
        message: data?.message || "Asset deleted successfully",
        type: "success",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to delete asset";
      toast.show({
        message: errorMessage,
        type: "error",
      });
    },
  });
}
