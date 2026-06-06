"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAllStaff } from "@/hooks/business-admin/staff-management/getAllStaffDatas";
import { useRbacPermissions, useRbacRoles } from "@/hooks/business-admin/staff-management/useRbacData";
import { createRbacRole, deleteRbacRole } from "@/libs/api/rbac.api";
import { staffApi } from "@/libs/api/staff.api";
import StaffRecord from "@/components/business-admin/staff/StaffRecord";
import TabNavigation from "@/components/shared/TabNavigation";
import LogDetails from "@/components/shared/LogDetails";
import CustomizeSection from "@/components/shared/CustomizeSection";
import {
  BarChart3,
  Settings,
  ActivitySquare,
  Wrench,
  FileText,
  X,
} from "lucide-react";
import StaffStats from "@/components/business-admin/staff/StaffStats";
import { TStaff } from "@/libs/types/staff.types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useBusinessAnalytics } from "@/hooks/business-admin/analysis/useBusinessAnalytics";

const DEFAULT_SIDEBAR_PERMISSIONS = [
  { code: "business_management:view", label: "Dashboard" },
  { code: "reports:view", label: "Analysis" },
  { code: "asset_management:view", label: "Asset Management" },
  { code: "client_management:view", label: "Client Management" },
  { code: "staff_management:view", label: "Staff Management" },
  { code: "token_management:view", label: "Token Management" },
  { code: "attendance_management:view", label: "Attendance Management" },
  { code: "billing_management:view", label: "Billing and Payments" },
];

export default function StaffPage() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("inventory");

  const {
    data: staffData,
    isLoading,
    isError,
  } = useAllStaff({ page, limit: 10 });

  const { summary } = useBusinessAnalytics();

  const staffs = staffData?.data ?? staffData ?? [];
  const pagination = staffData?.pagination;

  const staffGenderData = useMemo(() => {
    const counts: Record<string, number> = staffs.reduce(
      (acc: Record<string, number>, staff: TStaff) => {
      const key = staff.gender || "other";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
      },
      {},
    );

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [staffs]);

  const staffGrowth = useMemo(() => {
    const monthly: Record<string, number> = staffs.reduce(
      (acc: Record<string, number>, staff: TStaff) => {
      const createdAt = new Date(staff.createdAt);
      if (Number.isNaN(createdAt.getTime())) return acc;

      const key = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, "0")}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
      },
      {},
    );

    return Object.entries(monthly)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => {
        const [year, month] = key.split("-").map(Number);
        return {
          label: new Date(year, month - 1, 1).toLocaleDateString("en-US", {
            month: "short",
            year: "2-digit",
          }),
          value,
        };
      });
  }, [staffs]);

  const { data: rbacRoles, isLoading: rolesLoading, isError: rolesError } = useRbacRoles();
  const {
    data: rbacPermissions,
    isLoading: permissionsLoading,
    isError: permissionsError,
  } = useRbacPermissions();

  const permissionCatalogOptions = useMemo(() => {
    if (!rbacPermissions?.length) return [];

    const unique = new Map<string, { code: string; label: string; type: string }>();

    rbacPermissions.forEach((permission: any) => {
      const moduleName = String(permission.module_name || "").trim();
      const permissionType = String(permission.permission_type || "").trim();
      if (!moduleName || !permissionType) return;

      const code = `${moduleName}:${permissionType}`;
      if (unique.has(code)) return;

      const label = moduleName
        .split("_")
        .map((part) => part[0]?.toUpperCase() + part.slice(1).toLowerCase())
        .join(" ");

      unique.set(code, {
        code,
        label,
        type: permissionType,
      });
    });

    return Array.from(unique.values());
  }, [rbacPermissions]);

  const sidebarPermissionOptions = useMemo(() => {
    if (permissionCatalogOptions.length > 0) {
      return permissionCatalogOptions.filter((permission) => permission.type === "view");
    }

    return DEFAULT_SIDEBAR_PERMISSIONS;
  }, [permissionCatalogOptions]);

  const totalStaff = summary?.users.totalStaff ?? staffs.length;
  const activeStaff = summary?.users.totalActiveStaff ?? staffs.length;
  const inactiveStaff = summary?.users.totalInactiveStaff ?? 0;
  const activeRate = totalStaff > 0 ? (activeStaff / totalStaff) * 100 : 0;

  const [selectedStaff, setSelectedStaff] = useState<TStaff | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);
  const [showCreateRoleForm, setShowCreateRoleForm] = useState(false);

  const queryClient = useQueryClient();

  const updateStaffRoleMutation = useMutation({
    mutationFn: async ({
      staffId,
      staffRoleId,
      staffPermissions,
    }: {
      staffId: string;
      staffRoleId?: string;
      staffPermissions?: string[];
    }) => {
      const formData = new FormData();
      if (staffRoleId) {
        formData.append("staffRoleId", staffRoleId);
      }
      formData.append("staffPermissions", JSON.stringify(staffPermissions || []));
      return staffApi.updateStaffApi(staffId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      queryClient.invalidateQueries({ queryKey: ["staff", page, 10] });
      setSelectedStaff(null);
      setIsAssignOpen(false);
      setSelectedPermissions([]);
      setNewRoleName("");
      setNewRoleDescription("");
    },
  });

  const createRoleMutation = useMutation({
    mutationFn: async () => {
      return createRbacRole({
        role_name: newRoleName,
        description: newRoleDescription,
        permissionCodes: newRolePermissions,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rbac", "roles"] });
      setNewRoleName("");
      setNewRoleDescription("");
      setNewRolePermissions([]);
      setShowCreateRoleForm(false);
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: async (roleId: string) => {
      return deleteRbacRole(roleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rbac", "roles"] });
    },
  });

  const tabs = [
    { id: "inventory", label: "Inventory", icon: <FileText size={16} /> },
    { id: "permission", label: "Permission", icon: <Wrench size={16} /> },
    { id: "analysis", label: "Analysis", icon: <BarChart3 size={16} /> },
    { id: "customize", label: "Customize", icon: <Settings size={16} /> },
    { id: "logs", label: "Log Details", icon: <ActivitySquare size={16} /> },
  ];

  const openAssignRole = (staff: TStaff) => {
    setSelectedStaff(staff);
    setSelectedRoleId(staff.staffRoleId || "");
    setSelectedPermissions(staff.staffPermissions ?? []);
    setIsAssignOpen(true);
  };

  const handleAssignRole = async () => {
    if (!selectedStaff) return;
    await updateStaffRoleMutation.mutateAsync({
      staffId: selectedStaff._id,
      staffRoleId: selectedRoleId || undefined,
      staffPermissions: selectedPermissions,
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Business Staff Records
          </h2>
          <p className="text-sm text-gray-500">
            Manage all business staffs in the system
          </p>
        </div>
      </div>

      <StaffStats
        totalStaff={totalStaff}
        totalActiveStaff={activeStaff}
        totalInactiveStaff={inactiveStaff}
        activeRate={activeRate}
      />

      {/* TAB NAVIGATION */}
      <TabNavigation
        activeTab={activeTab}
        tabs={tabs}
        onTabChange={setActiveTab}
      />

      {/* TAB CONTENT */}
      {activeTab === "inventory" && (
        <StaffRecord
          staffs={staffs}
          isLoading={isLoading}
          error={isError ? "Failed to load staff records" : null}
          page={page}
          totalPages={pagination?.totalPages || 1}
          onPageChange={setPage}
          onManagePermissions={openAssignRole}
        />
      )}

      {activeTab === "permission" && (
        <div className="space-y-6 p-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Role-Based Access Control</h3>
            <p className="text-sm text-gray-500">
              Assign roles to staff members so business admins control which menu items and actions each staff can access.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h4 className="text-base font-semibold">Role definitions</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Allowed permissions count is the number of RBAC permissions this role grants. If it shows 0, the role has no permissions assigned yet.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateRoleForm((current) => !current)}
                  className="inline-flex items-center rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  {showCreateRoleForm ? "Hide create role" : "Create new role"}
                </button>
              </div>

              {showCreateRoleForm && (
                <div className="mb-6 rounded-lg border border-dashed border-indigo-200 bg-indigo-50 p-4">
                  <h5 className="text-sm font-semibold text-indigo-900">New role details</h5>
                  <div className="grid gap-4 mt-4">
                    <label className="block text-sm text-slate-700">
                      Role name
                      <input
                        value={newRoleName}
                        onChange={(event) => setNewRoleName(event.target.value)}
                        className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        placeholder="e.g. Sales Staff"
                      />
                    </label>
                    <label className="block text-sm text-slate-700">
                      Description
                      <input
                        value={newRoleDescription}
                        onChange={(event) => setNewRoleDescription(event.target.value)}
                        className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        placeholder="Optional role description"
                      />
                    </label>
                    <div>
                      <p className="text-sm font-medium text-slate-800">Permissions for this role</p>
                      <p className="text-xs text-slate-500 mb-3">Choose the sidebar access rules this role should grant.</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {sidebarPermissionOptions.length > 0 ? (
                          sidebarPermissionOptions.map((permission) => {
                            const checked = newRolePermissions.includes(permission.code);
                            return (
                              <label key={permission.code} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => {
                                    setNewRolePermissions((current) =>
                                      current.includes(permission.code)
                                        ? current.filter((item) => item !== permission.code)
                                        : [...current, permission.code],
                                    );
                                  }}
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span>{permission.label}</span>
                              </label>
                            );
                          })
                        ) : (
                          <p className="text-sm text-gray-500">Permission list is loading or unavailable.</p>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => createRoleMutation.mutate()}
                      disabled={!newRoleName.trim() || createRoleMutation.status === "pending"}
                      className="inline-flex items-center justify-center rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
                    >
                      {createRoleMutation.status === "pending" ? "Creating role..." : "Create role"}
                    </button>
                  </div>
                </div>
              )}

              {rolesLoading ? (
                <p className="text-sm text-gray-500">Loading roles...</p>
              ) : rolesError ? (
                <p className="text-sm text-red-500">Failed to load roles.</p>
              ) : rbacRoles?.length ? (
                <div className="space-y-4">
                  {rbacRoles.map((role: any) => {
                    const allowed = role.permissions.filter((permission: any) => permission.allowed);
                    return (
                      <div key={role._id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{role.role_name}</p>
                            <p className="text-sm text-slate-600">{role.description || "No description provided."}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                              {allowed.length} allowed
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete role ${role.role_name}?`)) {
                                  deleteRoleMutation.mutate(role._id);
                                }
                              }}
                              disabled={deleteRoleMutation.status === "pending"}
                              className="rounded border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                        <div className="mt-3 text-sm text-slate-700">
                          <p className="font-medium">Allowed permissions</p>
                          <p className="mt-2 text-xs text-slate-600">
                            {allowed.length > 0
                              ? allowed
                                  .map((permission: any) => `${permission.module_name}:${permission.permission_type}`)
                                  .join(", ")
                              : "None"}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No role definitions available yet.</p>
              )}
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h4 className="text-base font-semibold mb-4">Permission catalog</h4>
              <p className="text-sm text-gray-500 mb-4">
                This catalog lists the RBAC permissions available for roles and direct staff access. View permissions control sidebar menu visibility.
              </p>
              {permissionsLoading ? (
                <p className="text-sm text-gray-500">Loading permission catalog...</p>
              ) : (
                <>
                  {permissionsError && (
                    <p className="text-sm text-red-500 mb-3">Failed to load permission catalog. Showing default sidebar permissions instead.</p>
                  )}
                  {permissionCatalogOptions.length ? (
                    <div className="space-y-3">
                      {permissionCatalogOptions.map((permission) => (
                        <div key={permission.code} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                          <p className="font-medium text-slate-900">{permission.label}</p>
                          <p className="mt-1 text-xs text-slate-600">{permission.type}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {DEFAULT_SIDEBAR_PERMISSIONS.map((permission) => (
                        <div key={permission.code} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                          <p className="font-medium text-slate-900">{permission.label}</p>
                          <p className="mt-1 text-xs text-slate-600">view</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h4 className="text-base font-semibold">Staff permission assignments</h4>
                <p className="text-sm text-gray-500">
                  Select a staff member and manage their role plus sidebar menu permissions directly.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Current Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">Permissions</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {staffs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">
                        No staff members available.
                      </td>
                    </tr>
                  ) : (
                    staffs.map((staff: TStaff) => {
                      const assignedRole = rbacRoles?.find((role: any) => role._id === staff.staffRoleId);
                      const directPermissions = staff.staffPermissions ?? [];
                      const rolePermissionCodes = assignedRole
                        ? assignedRole.permissions
                            .filter((permission: any) => permission.allowed)
                            .map((permission: any) => `${permission.module_name}:${permission.permission_type}`)
                        : [];
                      const effectivePermissionCount = new Set([
                        ...rolePermissionCodes,
                        ...directPermissions,
                      ]).size;

                      return (
                        <tr key={staff._id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm text-gray-900">{staff.userName}</td>
                          <td className="px-4 py-4 text-sm text-gray-500">{staff.userEmail || "-"}</td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {assignedRole ? assignedRole.role_name : "Unassigned"}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">{effectivePermissionCount}</td>
                          <td className="px-4 py-4 text-right">
                            <button
                              type="button"
                              onClick={() => openAssignRole(staff)}
                              className="inline-flex items-center rounded bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                            >
                              Permissions
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {isAssignOpen && selectedStaff && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-xl font-semibold">Manage permissions for {selectedStaff.userName}</h4>
                    <p className="text-sm text-gray-500">Grant sidebar access and menu permissions per staff member. Role permissions and direct menu permissions are merged.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAssignOpen(false)}
                    className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-6 space-y-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Assign role</label>
                    <select
                      value={selectedRoleId}
                      onChange={(event) => setSelectedRoleId(event.target.value)}
                      className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    >
                      <option value="">No role assigned</option>
                      {rbacRoles?.map((role: any) => (
                        <option key={role._id} value={role._id}>
                          {role.role_name}
                        </option>
                      ))}
                    </select>
                    {!rolesLoading && !rolesError && !rbacRoles?.length && (
                      <div className="mt-4 space-y-4 rounded-lg border border-dashed border-gray-300 bg-white p-4">
                        <p className="text-sm text-gray-700">
                          No RBAC roles are defined yet. Create a role first so it can be assigned to staff.
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block text-sm text-gray-600">
                            Role name
                            <input
                              value={newRoleName}
                              onChange={(event) => setNewRoleName(event.target.value)}
                              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                              placeholder="e.g. Sales Staff"
                            />
                          </label>
                          <label className="block text-sm text-gray-600">
                            Description
                            <input
                              value={newRoleDescription}
                              onChange={(event) => setNewRoleDescription(event.target.value)}
                              className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                              placeholder="Optional role description"
                            />
                          </label>
                        </div>
                        <button
                          type="button"
                          onClick={() => createRoleMutation.mutate()}
                          disabled={!newRoleName.trim() || createRoleMutation.status === "pending"}
                          className="inline-flex items-center rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
                        >
                          {createRoleMutation.status === "pending" ? "Creating role..." : "Create role"}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">Sidebar menu permissions</p>
                    <p className="mt-1 text-sm text-slate-600">Select which business sidebar items this staff member can access.</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {sidebarPermissionOptions.length > 0 ? (
                          sidebarPermissionOptions.map((permission) => {
                            const isChecked = selectedPermissions.includes(permission.code);

                            return (
                              <label
                                key={permission.code}
                                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-slate-700"
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => {
                                    setSelectedPermissions((current) => {
                                      return current.includes(permission.code)
                                        ? current.filter((item) => item !== permission.code)
                                        : [...current, permission.code];
                                    });
                                  }}
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="capitalize">
                                  {permission.label}
                                </span>
                              </label>
                            );
                          })
                        ) : (
                          <div className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-gray-500">
                            No sidebar menu permissions are available yet. Please seed RBAC permissions or ensure the permission catalog is loaded.
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedRoleId && (
                      <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-700">
                        Role permissions will still apply in addition to these direct menu selections.
                      </div>
                    )}
                </div>

                <div className="mt-6 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAssignOpen(false)}
                    className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAssignRole}
                    disabled={updateStaffRoleMutation.status === "pending"}
                    className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
                  >
                    {updateStaffRoleMutation.status === "pending" ? "Saving..." : "Save permissions"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "analysis" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Staff Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={staffGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={staffGenderData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip />
                <Bar dataKey="value" fill="var(--secondary)">
                  {staffGenderData.map((entry, index) => (
                    <Cell
                      key={`staff-gender-${entry.name}-${index}`}
                      fill={index % 2 === 0 ? "#2563eb" : "#10b981"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-6 lg:col-span-2 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Staff Overview</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={[
                  { name: "Active", value: activeStaff },
                  { name: "Inactive", value: inactiveStaff },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip />
                <Bar dataKey="value" fill="var(--primary)">
                  <Cell fill="#22c55e" />
                  <Cell fill="#ef4444" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeTab === "customize" && (
        <CustomizeSection
          module="Staff"
          onSave={(options) => {
            console.log("Staff customization saved:", options);
          }}
        />
      )}

      {activeTab === "logs" && (
        <LogDetails
          userId={staffs?.[0]?.business_id ?? ""}
          module="Staff"
          onClearLogs={() => {
            console.log("Clearing staff logs");
          }}
        />
      )}
    </div>
  );
}
