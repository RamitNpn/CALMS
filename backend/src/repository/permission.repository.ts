import PermissionModel, { PermissionType } from "../models/permission.model";

export const DEFAULT_RBAC_PERMISSIONS: Array<{
  module_name: string;
  permission_type: PermissionType;
}> = [

  // Revenue Management
  { module_name: "revenue_management", permission_type: "view" },
  { module_name: "revenue_management", permission_type: "create" },
  { module_name: "revenue_management", permission_type: "edit" },
  { module_name: "revenue_management", permission_type: "delete" },

  // Asset Management
  { module_name: "asset_management", permission_type: "view" },
  { module_name: "asset_management", permission_type: "create" },
  { module_name: "asset_management", permission_type: "edit" },
  { module_name: "asset_management", permission_type: "delete" },

  // Client Management
  { module_name: "client_management", permission_type: "view" },
  { module_name: "client_management", permission_type: "create" },
  { module_name: "client_management", permission_type: "edit" },
  { module_name: "client_management", permission_type: "delete" },

  // Staff Management
  { module_name: "staff_management", permission_type: "view" },
  { module_name: "staff_management", permission_type: "create" },
  { module_name: "staff_management", permission_type: "edit" },
  { module_name: "staff_management", permission_type: "delete" },

  // Token Management
  { module_name: "token_management", permission_type: "view" },
  { module_name: "token_management", permission_type: "create" },
  { module_name: "token_management", permission_type: "edit" },
  { module_name: "token_management", permission_type: "delete" },

  // Attendance Management
  { module_name: "attendance_management", permission_type: "view" },
  { module_name: "attendance_management", permission_type: "create" },
  { module_name: "attendance_management", permission_type: "edit" },
  { module_name: "attendance_management", permission_type: "delete" },

  // Billing Management
  { module_name: "billing_management", permission_type: "view" },
  { module_name: "billing_management", permission_type: "create" },
  { module_name: "billing_management", permission_type: "edit" },
  { module_name: "billing_management", permission_type: "delete" },

  // Reports (Client Inquiries)
  { module_name: "inquiries_management", permission_type: "view" },

  // Profile Management
  { module_name: "profile_management", permission_type: "view" },
  { module_name: "profile_management", permission_type: "edit" },
];

class PermissionRepository {
  async getAll() {
    const permissions = await PermissionModel.find().sort({
      module_name: 1,
      permission_type: 1,
    });
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
