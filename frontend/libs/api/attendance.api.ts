import { apiClient } from "@/utils/api";
import { TCreateAttendanceSchema, TDeleteAttendanceSchema, TGetAttendanceByIdSchema, TUpdateAttendanceSchema } from "../validation/attendance.validation";


const createAttendance = async (data: TCreateAttendanceSchema) => {
  const response = await apiClient.post("/attendance", data);
  return response.data;
};

const getAllAttendanceApi = async (  page = 1,
  limit = 10) => {
  const response = await apiClient.get("/attendance", {
    params: { page, limit }
  });
  return response.data;
};

const getAttendanceByIdApi = async (
  attendanceId: TGetAttendanceByIdSchema["_id"],
) => {
  const response = await apiClient.get(`/attendance/${attendanceId}`);
  return response.data;
};

const updateAttendanceApi = async (
  attendanceId: string,
  data: Partial<TUpdateAttendanceSchema>,
) => {
  const response = await apiClient.put(`/attendance/${attendanceId}`, data);
  return response.data;
};

const deleteAttendanceApi = async (attendanceId: TDeleteAttendanceSchema["_id"]) => {
  const response = await apiClient.delete(`/attendance/${attendanceId}`);
  return response.data;
};

export const attendanceApi = {
  createAttendance,
  getAllAttendanceApi,
  getAttendanceByIdApi,
  updateAttendanceApi,
  deleteAttendanceApi,
};
