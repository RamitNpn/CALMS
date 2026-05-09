import { billingApi } from "@/libs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteBilling() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => billingApi.deleteBillingApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delete billing"] });
    }
  });
}
