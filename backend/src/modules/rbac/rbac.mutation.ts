import { AppRouteMutationImplementation } from "@ts-rest/express";
import { rbacContract } from "../../contract/rbac/rbac.contract";
import roleRepository from "../../repository/role.repository";
import permissionRepository from "../../repository/permission.repository";
import rolePermissionRepository from "../../repository/role-permission.repository";

const buildRoleResponse = async (role: any) => {
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

export const createRole: AppRouteMutationImplementation<
  typeof rbacContract.createRole
> = async ({ req }) => {
  const { role_name, description = "", permissionCodes = [] } = req.body;

  try {
    await permissionRepository.getAll();

    const role = await roleRepository.create({ role_name, description });
    await rolePermissionRepository.setPermissions(role._id.toString(), permissionCodes);

    return {
      status: 201,
      body: await buildRoleResponse(role),
    };
  } catch (error: any) {
    return {
      status: 500,
      body: { success: false, error: error.message || "Failed to create role" },
    };
  }
};

export const updateRole: AppRouteMutationImplementation<
  typeof rbacContract.updateRole
> = async ({ req }) => {
  const { roleId } = req.params;
  const { role_name, description, permissionCodes } = req.body;

  const existingRole = await roleRepository.getById(roleId);
  if (!existingRole) {
    return {
      status: 404,
      body: { success: false, error: "Role not found" },
    };
  }

  try {
    const updated = await roleRepository.update(roleId, {
      role_name,
      description,
    });

    if (permissionCodes) {
      await rolePermissionRepository.setPermissions(roleId, permissionCodes);
    }

    if (!updated) {
      return {
        status: 404,
        body: { success: false, error: "Role not found" },
      };
    }

    return {
      status: 200,
      body: await buildRoleResponse(updated),
    };
  } catch (error: any) {
    return {
      status: 500,
      body: { success: false, error: error.message || "Failed to update role" },
    };
  }
};

export const deleteRole: AppRouteMutationImplementation<
  typeof rbacContract.deleteRole
> = async ({ req }) => {
  const { roleId } = req.params;

  const deleted = await roleRepository.delete(roleId);

  if (!deleted) {
    return {
      status: 404,
      body: { success: false, error: "Role not found" },
    };
  }

  await rolePermissionRepository.deleteByRoleId(roleId);

  return {
    status: 200,
    body: { success: true },
  };
};

export const rbacMutationHandler = {
  createRole,
  updateRole,
  deleteRole,
};
