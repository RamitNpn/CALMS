import { apiClient } from "@/utils/api";
import {
  TCreateStaffSchema,
  TDeleteStaffSchema,
  TGetStaffByIdSchema,
  TUpdateStaffSchema,
} from "../validation/staff.validation";

export const createStaff = async (data: TCreateStaffSchema) => {
  const res = await apiClient.post("/user", data);
  return res.data;
};

const getAllStaffApi = async (page = 1, limit = 10) => {
  const response = await apiClient.get("/user", {
    params: { page, limit, role: "staff" },
  });
  return response.data;
};

const getStaffByIdApi = async (StaffId: TGetStaffByIdSchema["_id"]) => {
  const response = await apiClient.get(`/user/${StaffId}`);
  return response.data;
};

const updateStaffApi = async (
  StaffId: string,
  data: Partial<TUpdateStaffSchema>,
) => {
  const response = await apiClient.put(`/user/${StaffId}`, data);
  return response.data;
};

const deleteStaffApi = async (StaffId: TDeleteStaffSchema["_id"]) => {
  const response = await apiClient.delete(`/user/${StaffId}`);
  return response.data;
};

export const StaffApi = {
  createStaff,
  getAllStaffApi,
  getStaffByIdApi,
  updateStaffApi,
  deleteStaffApi,
};
