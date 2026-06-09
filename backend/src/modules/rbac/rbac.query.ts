import { AppRouteQueryImplementation } from "@ts-rest/express";
import { rbacContract } from "../../contract/rbac/rbac.contract";
import permissionRepository from "../../repository/permission.repository";
import roleRepository from "../../repository/role.repository";
import rolePermissionRepository from "../../repository/role-permission.repository";

const formatRole = async (role: any) => {
  const permissions = await permissionRepository.getAll();
  const allowedCodes = new Set(await rolePermissionRepository.getAllowedCodes(role._id.toString()));

  return {
    _id: role._id.toString(),
    role_name: role.role_name,
    description: role.description,
    permissions: permissions.map((permission) => ({
      module_name: permission.module_name,
      permission_type: permission.permission_type,
      allowed: allowedCodes.has(permission.code),
    })),
  };
};

export const getAllRoles: AppRouteQueryImplementation<
  typeof rbacContract.getAllRoles
> = async () => {
  const roles = await roleRepository.getAll();
  return {
    status: 200,
    body: await Promise.all(roles.map((role) => formatRole(role))),
  };
};

export const getRoleById: AppRouteQueryImplementation<
  typeof rbacContract.getRoleById
> = async ({ req }) => {
  const { roleId } = req.params;

  const role = await roleRepository.getById(roleId);

  if (!role) {
    return {
      status: 404,
      body: { success: false, error: "Role not found" },
    };
  }

  return {
    status: 200,
    body: await formatRole(role),
  };
};

export const getPermissions: AppRouteQueryImplementation<
  typeof rbacContract.getPermissions
> = async () => {
  const permissions = await permissionRepository.getAll();

  return {
    status: 200,
    body: permissions.map((permission) => ({
      module_name: permission.module_name,
      permission_type: permission.permission_type,
    })),
  };
};

export const rbacQueryHandler = {
  getAllRoles,
  getRoleById,
  getPermissions,
};
