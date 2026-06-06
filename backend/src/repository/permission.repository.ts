import PermissionModel, { IPermission, PermissionType } from "../models/permission.model";

export const DEFAULT_RBAC_PERMISSIONS: Array<{ module_name: string; permission_type: PermissionType }> = [
  { module_name: "property_management", permission_type: "view" },
  { module_name: "property_management", permission_type: "create" },
  { module_name: "property_management", permission_type: "edit" },
  { module_name: "property_management", permission_type: "delete" },
  { module_name: "staff_management", permission_type: "view" },
  { module_name: "staff_management", permission_type: "create" },
  { module_name: "staff_management", permission_type: "edit" },
  { module_name: "staff_management", permission_type: "delete" },
  { module_name: "reports", permission_type: "view" },
  { module_name: "settings", permission_type: "access" },
  { module_name: "business_management", permission_type: "view" },
  { module_name: "business_management", permission_type: "create" },
  { module_name: "business_management", permission_type: "edit" },
  { module_name: "business_management", permission_type: "delete" },
  { module_name: "asset_management", permission_type: "view" },
  { module_name: "asset_management", permission_type: "create" },
  { module_name: "asset_management", permission_type: "edit" },
  { module_name: "asset_management", permission_type: "delete" },
  { module_name: "client_management", permission_type: "view" },
  { module_name: "client_management", permission_type: "create" },
  { module_name: "client_management", permission_type: "edit" },
  { module_name: "client_management", permission_type: "delete" },
  { module_name: "billing_management", permission_type: "view" },
  { module_name: "billing_management", permission_type: "create" },
  { module_name: "billing_management", permission_type: "edit" },
  { module_name: "billing_management", permission_type: "delete" },
  { module_name: "attendance_management", permission_type: "view" },
  { module_name: "attendance_management", permission_type: "create" },
  { module_name: "attendance_management", permission_type: "edit" },
  { module_name: "attendance_management", permission_type: "delete" },
  { module_name: "token_management", permission_type: "view" },
  { module_name: "token_management", permission_type: "create" },
  { module_name: "token_management", permission_type: "edit" },
  { module_name: "token_management", permission_type: "delete" },
];

class PermissionRepository {
  async getAll() {
    const permissions = await PermissionModel.find().sort({ module_name: 1, permission_type: 1 });
    if (permissions.length > 0) return permissions;

    const created = await PermissionModel.insertMany(
      DEFAULT_RBAC_PERMISSIONS.map(({ module_name, permission_type }) => ({
        module_name,
        permission_type,
        code: `${module_name}:${permission_type}`,
      })),
      { ordered: false },
    );

    return created;
  }

  async getByCode(code: string) {
    return PermissionModel.findOne({ code });
  }

  async getByCodes(codes: string[]) {
    return PermissionModel.find({ code: { $in: codes } });
  }

  async getAllCodes() {
    const permissions = await this.getAll();
    return permissions.map((permission) => permission.code);
  }
}

export default new PermissionRepository();
