import { StaffApi } from "@/libs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => StaffApi.deleteStaffApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delete staff"] });
    }
  });
}
