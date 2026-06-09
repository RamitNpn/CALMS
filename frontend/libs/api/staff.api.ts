import { apiClient } from "@/utils/api";
import {
  TCreateStaffSchema,
  TDeleteStaffSchema,
  TGetStaffByIdSchema,
} from "../validation/staff.validation";

export const createStaff = async (data: TCreateStaffSchema) => {
  const res = await apiClient.post("/user", data);
  return res.data;
};

const getAllStaffApi = async (page = 1, limit = 10, search?: string, dateFilter?: string) => {
  const params: any = { page, limit, role: "staff" };
  if (search) params.search = search;
  if (dateFilter) params.dateFilter = dateFilter;

  const response = await apiClient.get("/user", {
    params,
  });
  return response.data;
};

const getStaffByIdApi = async (staffId: TGetStaffByIdSchema["_id"]) => {
  const response = await apiClient.get(`/user/${staffId}`);
  return response.data;
};


const updateStaffApi = async (staffId: string, formData: FormData) => {
  const response = await apiClient.put(`/user/${staffId}`, formData, {
  });

  return response.data;
};

const deleteStaffApi = async (staffId: TDeleteStaffSchema["_id"]) => {
  const response = await apiClient.delete(`/user/${staffId}`);
  return response.data;
};

export const staffApi = {
  createStaff,
  getAllStaffApi,
  getStaffByIdApi,
  updateStaffApi,
  deleteStaffApi,
};
