import { attendanceApi } from "@/libs";
import { useQuery } from "@tanstack/react-query";

export const useAttendanceByUser = (
  userId: string,
  page: number,
  dateFilter: string,
) => {
  return useQuery({
    queryKey: ["attendance-user", userId, page, dateFilter],

    queryFn: () =>
      attendanceApi.getAttendanceByUserApi(
        userId,
        page,
        dateFilter,
      ),

    enabled: !!userId,
  });
};