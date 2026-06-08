import { apiClient } from "@/utils/api";
import {
  TCreateAttendanceSchema,
  TDeleteAttendanceSchema,
  TGetAttendanceByIdSchema,
  TUpdateAttendanceSchema,
} from "../validation/attendance.validation";
import { UsePaginationParams } from "../types/shared.types";

const createAttendance = async (data: TCreateAttendanceSchema) => {
  const response = await apiClient.post("/attendance", data);
  return response.data;
};

const getTodayAttendanceApi = async (params: UsePaginationParams) => {
  const response = await apiClient.get(`/today`, {
    params,
  });
  console.log(params);
  return response.data;
};

const getAllAttendanceApi = async (params: UsePaginationParams) => {
  const response = await apiClient.get("/attendance", {
    params,
  });
  return response.data;
};

const getAttendanceByIdApi = async (
  attendanceId: TGetAttendanceByIdSchema["_id"],
) => {
  const response = await apiClient.get(`/attendance/${attendanceId}`);
  return response.data;
};

const getAttendanceByUserApi = async (userId: string, page = 1, dateFilter: string) => {
  const response = await apiClient.get(`/attendance/user/${userId}`, {
    params: {
      page,
      dateFilter,
    },
  });

  return response.data;
};

const updateAttendanceApi = async (
  attendanceId: string,
  data: Partial<TUpdateAttendanceSchema>,
) => {
  const response = await apiClient.put(`/attendance/${attendanceId}`, data);
  return response.data;
};

const deleteAttendanceApi = async (
  attendanceId: TDeleteAttendanceSchema["_id"],
) => {
  const response = await apiClient.delete(`/attendance/${attendanceId}`);
  return response.data;
};

export const attendanceApi = {
  createAttendance,
  getTodayAttendanceApi,
  getAllAttendanceApi,
  getAttendanceByIdApi,
  updateAttendanceApi,
  deleteAttendanceApi,
  getAttendanceByUserApi,
};
