import { businessApi } from "@/libs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => businessApi.deleteBusinessApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delete business"] });
    }
  });
}
