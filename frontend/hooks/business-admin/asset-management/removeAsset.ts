import { assetApi } from "@/libs/api/asset.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteAsset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assetApi.deleteAssetApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delete asset"] });
    }
  });
}
