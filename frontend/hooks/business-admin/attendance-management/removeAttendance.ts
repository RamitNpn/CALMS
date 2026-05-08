import { attendanceApi } from "@/libs";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => attendanceApi.deleteAttendanceApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["delete attendance"] });
    }
  });
}
  