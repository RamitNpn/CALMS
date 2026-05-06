import { apiClient } from "@/utils/api";

export const createStaff = async (data: TCreateStaffSchema) => {
  const res = await apiClient.post("/api/staff", data);
  return res.data;
};

const getAllStaffApi = async (filters?: Partial<TGetAllStaffSchema>) => {
  const response = await apiClient.get("/staff/admin", { params: filters });
  return response.data;
};

const getStaffByIdApi = async (StaffId: TGetAllStaffByIdSchema["_id"]) => {
  const response = await apiClient.get(`/staff/admin/${StaffId}`);
  return response.data;
};

const updateStaffApi = async (StaffId: string, data: Partial<TUpdateStaffSchema>) => {
    const response = await apiClient.put(`/staff/admin/${StaffId}`, data);
    return response.data;
};

const deleteStaffApi = async (StaffId: TDeleteStaffSchema["_id"]) => {
    const response = await apiClient.delete(`/staff/admin/${StaffId}`);
    return response.data;
};

export const StaffApi = {
  createStaff,
  getAllStaffApi,
  getStaffByIdApi,
  updateStaffApi,
  deleteStaffApi
};