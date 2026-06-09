import { apiClient } from "@/utils/api";

const getAllRbacRoles = async () => {
  const response = await apiClient.get("/staff-role");
  return response.data;
};

const getAllRbacPermissions = async () => {
  const response = await apiClient.get("/staff-permissions");
  return response.data;
};

const createRbacRole = async (data: {
  role_name: string;
  description?: string;
  permissionCodes?: string[];
}) => {
  const response = await apiClient.post("/staff-role", data);
  return response.data;
};

const deleteRbacRole = async (roleId: string) => {
  const response = await apiClient.delete(`/staff-role/${roleId}`);
  return response.data;
};

export const rbacApi = {
  getAllRbacRoles,
  getAllRbacPermissions,
  createRbacRole,
  deleteRbacRole,
}
