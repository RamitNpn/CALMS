import { clientApi } from "@/libs/api/client.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientApi.deleteClientApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delete client"] });
    }
  });
}
