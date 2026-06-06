import { initContract } from "@ts-rest/core";
import z from "zod";
import {
  createRoleSchema,
  getAllPermissionsSchema,
  getAllRolesSchema,
  roleSchema,
  updateRoleSchema,
} from "./rbac.schema";
import { errorSchema } from "../common.schema";

const c = initContract();

export const rbacContract = c.router({
  createRole: {
    method: "POST",
    path: "/staff-role",
    body: createRoleSchema,
    responses: {
      201: roleSchema,
      400: errorSchema,
      500: errorSchema,
    },
  },
  getAllRoles: {
    method: "GET",
    path: "/staff-role",
    responses: {
      200: getAllRolesSchema,
      500: errorSchema,
    },
  },
  getRoleById: {
    method: "GET",
    path: "/staff-role/:roleId",
    pathParams: z.object({ roleId: z.string().min(1) }),
    responses: {
      200: roleSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
  updateRole: {
    method: "PUT",
    path: "/staff-role/:roleId",
    pathParams: z.object({ roleId: z.string().min(1) }),
    body: updateRoleSchema,
    responses: {
      200: roleSchema,
      400: errorSchema,
      404: errorSchema,
      500: errorSchema,
    },
  },
  deleteRole: {
    method: "DELETE",
    path: "/staff-role/:roleId",
    pathParams: z.object({ roleId: z.string().min(1) }),
    responses: {
      200: z.object({ success: z.literal(true) }),
      404: errorSchema,
      500: errorSchema,
    },
  },
  getPermissions: {
    method: "GET",
    path: "/staff-role/permissions",
    responses: {
      200: getAllPermissionsSchema,
      500: errorSchema,
    },
  },
});
