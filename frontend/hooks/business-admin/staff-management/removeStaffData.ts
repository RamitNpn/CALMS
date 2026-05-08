import { staffApi } from "@/libs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => staffApi.deleteStaffApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delete staff"] });
    }
  });
}
