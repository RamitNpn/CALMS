import RolePermissionModel, { IRolePermission } from "../models/role-permission.model";
import permissionRepository from "./permission.repository";

class RolePermissionRepository {
  async getByRoleId(roleId: string) {
    return RolePermissionModel.find({ role_id: roleId }).populate("permission_id");
  }

  async setPermissions(roleId: string, codes: string[]) {
    const permissions = await permissionRepository.getByCodes(codes);
    const permissionIds = permissions.map((permission) => permission._id.toString());

    await RolePermissionModel.deleteMany({ role_id: roleId });

    if (permissionIds.length === 0) {
      return [];
    }

    const records = permissionIds.map((permission_id) => ({
      role_id: roleId,
      permission_id,
      allowed: true,
    }));

    return await RolePermissionModel.insertMany(records);
  }

  async getAllowedCodes(roleId: string) {
    const records = await this.getByRoleId(roleId);
    return records
      .filter((record) => record.allowed)
      .map((record) => (record.permission_id as any)?.code)
      .filter(Boolean) as string[];
  }

  async deleteByRoleId(roleId: string) {
    return RolePermissionModel.deleteMany({ role_id: roleId });
  }
}

export default new RolePermissionRepository();
