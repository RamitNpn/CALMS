import { paymentApi } from "@/libs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => paymentApi.deletePaymentApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delete payment"] });
    }
  });
}
