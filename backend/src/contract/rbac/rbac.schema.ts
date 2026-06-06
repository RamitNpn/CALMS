import { z } from "zod";

export const permissionType = z.enum(["view", "create", "edit", "delete", "access"]);

export const permissionItem = z.object({
  module_name: z.string().min(1),
  permission_type: permissionType,
});

export const rolePermissionItem = z.object({
  module_name: z.string().min(1),
  permission_type: permissionType,
  allowed: z.boolean(),
});

export const createRoleSchema = z.object({
  role_name: z.string().min(1, "Role name is required"),
  description: z.string().optional(),
  permissionCodes: z.array(z.string()).default([]),
});

export const updateRoleSchema = z.object({
  role_name: z.string().min(1, "Role name is required").optional(),
  description: z.string().optional(),
  permissionCodes: z.array(z.string()).optional(),
});

export const roleSchema = z.object({
  _id: z.string(),
  role_name: z.string(),
  description: z.string().optional(),
  permissions: z.array(rolePermissionItem),
});

export const getAllRolesSchema = z.array(roleSchema);
export const getAllPermissionsSchema = z.array(permissionItem);
