import { attendanceApi } from "@/libs";
import { useQuery } from "@tanstack/react-query";

export const useAttendanceByUser = (
  userId: string,
  page: number,
  limit = 10,
) => {
  return useQuery({
    queryKey: ["attendance-user", userId, page],

    queryFn: () =>
      attendanceApi.getAttendanceByUserApi(
        userId,
        page,
        limit,
      ),

    enabled: !!userId,
  });
};