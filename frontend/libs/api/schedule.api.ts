import { apiClient } from "@/utils/api";

const createSchedule = async (data: any) => {
  const response = await apiClient.post("/schedules", data);
  return response.data;
};

const getAllSchedulesApi = async (page = 1, limit = 10) => {
  const response = await apiClient.get("/schedules", {
    params: { page, limit },
  });
  return response.data;
};

const getScheduleByIdApi = async (scheduleId: string) => {
  const response = await apiClient.get(`/schedules/${scheduleId}`);
  return response.data;
};

const updateScheduleApi = async (scheduleId: string, data: any) => {
  const response = await apiClient.put(`/schedules/${scheduleId}`, data);
  return response.data;
};

const deleteScheduleApi = async (scheduleId: string) => {
  const response = await apiClient.delete(`/schedules/${scheduleId}`);
  return response.data;
};

export const scheduleApi = {
  createSchedule,
  getAllSchedulesApi,
  getScheduleByIdApi,
  updateScheduleApi,
  deleteScheduleApi,
};
