import { apiClient } from "@/utils/api";

export const getAllRbacRoles = async () => {
  const response = await apiClient.get("/staff-role");
  return response.data;
};

export const getAllRbacPermissions = async () => {
  const response = await apiClient.get("/staff-role/permissions");
  return response.data;
};

export const createRbacRole = async (data: {
  role_name: string;
  description?: string;
  permissionCodes?: string[];
}) => {
  const response = await apiClient.post("/staff-role", data);
  return response.data;
};

export const deleteRbacRole = async (roleId: string) => {
  const response = await apiClient.delete(`/staff-role/${roleId}`);
  return response.data;
};
