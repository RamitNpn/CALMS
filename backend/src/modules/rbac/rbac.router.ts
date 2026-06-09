import { initServer } from "@ts-rest/express";
import { rbacContract } from "../../contract/rbac/rbac.contract";
import { rbacQueryHandler } from "./rbac.query";
import { rbacMutationHandler } from "./rbac.mutation";

const s = initServer();

export const rbacRouter = s.router(rbacContract, {
  createRole: rbacMutationHandler.createRole,
  getAllRoles: rbacQueryHandler.getAllRoles,
  getRoleById: rbacQueryHandler.getRoleById,
  updateRole: rbacMutationHandler.updateRole,
  deleteRole: rbacMutationHandler.deleteRole,
  getPermissions: rbacQueryHandler.getPermissions,
});
