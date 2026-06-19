"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { staffApi } from "@/libs/api/staff.api";
import { UserCog, X } from "lucide-react";
import { TStaff } from "@/libs/types/staff.types";

import TablePagination from "@/components/shared/Pagination";
import { useRbacRoles } from "@/hooks/business-admin/rbac/getAllRbacRoles";
import { useRbacPermissions } from "@/hooks/business-admin/rbac/getAllPermission";
import { rbacApi } from "@/libs/api/rbac.api";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useDeleteRbac } from "@/hooks/business-admin/rbac/removeRbac";
import { useToast } from "@/components/ui/toast";

const DEFAULT_SIDEBAR_PERMISSIONS = [
  { code: "business_management:view", label: "Dashboard" },
  { code: "reports:view", label: "Client Inquiries" },
  { code: "revenue_management:view", label: "Revenue Management" },
  { code: "asset_management:view", label: "Assets Management" },
  { code: "client_management:view", label: "Clients Management" },
  { code: "staff_management:view", label: "Staff Management" },
  { code: "token_management:view", label: "Token Management" },
  { code: "attendance_management:view", label: "Attendance Management" },
  { code: "billing_management:view", label: "Billing Management" },
  { code: "profile_management:view", label: "Profile Management" },
];

interface StaffTableProps {
  staffs: TStaff[];
  isLoading?: boolean;
  error?: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
export default function StaffRecord({
  staffs,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
}: StaffTableProps) {
  const {
    data: rbacRoles,
    isLoading: rolesLoading,
    isError: rolesError,
  } = useRbacRoles();

  const [itemToRemove, setItemToRemove] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<TStaff | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);
  const [showCreateRoleForm, setShowCreateRoleForm] = useState(false);

  const { data: rbacPermissions } = useRbacPermissions();
  const { mutate: deleteRbac, isPending } = useDeleteRbac();

  const permissionCatalogOptions = useMemo(() => {
    if (!rbacPermissions?.length) return [];

    const unique = new Map<
      string,
      { code: string; label: string; type: string }
    >();

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
      return permissionCatalogOptions.filter(
        (permission) => permission.type === "view",
      );
    }

    return DEFAULT_SIDEBAR_PERMISSIONS;
  }, [permissionCatalogOptions]);

  const queryClient = useQueryClient();
  const toast = useToast.getState();

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
      formData.append(
        "staffPermissions",
        JSON.stringify(staffPermissions || []),
      );
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
      return rbacApi.createRbacRole({
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

  const confirmRemove = () => {
    if (!itemToRemove) return;

    console.log(itemToRemove);

    deleteRbac(itemToRemove, {
      onSuccess: () => {
        toast.show({
          message: "Staff deleted successfully",
          type: "success",
        });

        setItemToRemove(null);
      },
    });
  };

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

  if (isLoading) {
    return <p className="p-4">Loading...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  return (
    <div className="space-y-6 p-2 w-full">
      <div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex flex-col gap-2 mb-4">
            <div className="w-full flex items-start justify-between">
              <h4 className="text-base font-semibold">Role definitions</h4>
              <button
                type="button"
                onClick={() => setShowCreateRoleForm((current) => !current)}
                className="inline-flex items-center rounded bg-indigo-600 px-4 py-2 text-[12px] text-white hover:bg-indigo-700"
              >
                {showCreateRoleForm ? "Hide create role" : "Create new role"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Allowed permissions count is the number of RBAC permissions this
              role grants. If it shows 0, the role has no permissions assigned
              yet.
            </p>
          </div>

          {showCreateRoleForm && (
            <div className="mb-6 rounded-lg border border-dashed border-indigo-200 bg-indigo-50 p-4">
              <h5 className="text-sm font-semibold text-indigo-900">
                New role details
              </h5>
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
                    onChange={(event) =>
                      setNewRoleDescription(event.target.value)
                    }
                    className="mt-2 w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    placeholder="Optional role description"
                  />
                </label>
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Permissions for this role
                  </p>
                  <p className="text-xs text-slate-500 mb-3">
                    Choose the sidebar access rules this role should grant.
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {sidebarPermissionOptions.length > 0 ? (
                      sidebarPermissionOptions.map((permission) => {
                        const checked = newRolePermissions.includes(
                          permission.code,
                        );
                        return (
                          <label
                            key={permission.code}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-700"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                setNewRolePermissions((current) =>
                                  current.includes(permission.code)
                                    ? current.filter(
                                        (item) => item !== permission.code,
                                      )
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
                      <p className="text-sm text-gray-500">
                        Permission list is loading or unavailable.
                      </p>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => createRoleMutation.mutate()}
                  disabled={
                    !newRoleName.trim() ||
                    createRoleMutation.status === "pending"
                  }
                  className="inline-flex items-center justify-center rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
                >
                  {createRoleMutation.status === "pending"
                    ? "Creating role..."
                    : "Create role"}
                </button>
              </div>
            </div>
          )}

          {rolesLoading ? (
            <p className="text-sm text-gray-500">Loading roles...</p>
          ) : rolesError ? (
            <p className="text-sm text-red-500">Failed to load roles.</p>
          ) : rbacRoles?.length ? (
            <div className="space-y-4 grid grid-cols-2 gap-4">
              {rbacRoles.map((role: any) => {
                const allowed = role.permissions.filter(
                  (permission: any) => permission.allowed,
                );
                return (
                  <div
                    key={role._id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {role.role_name}
                        </p>
                        <p className="text-sm text-slate-600">
                          {role.description || "No description provided."}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                          {allowed.length} allowed
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (true) {
                              setItemToRemove(role._id);
                            }
                          }}
                          disabled={isPending}
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
                              .map(
                                (permission: any) =>
                                  `${permission.module_name}:${permission.permission_type}`,
                              )
                              .join(", ")
                          : "None"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              No role definitions available yet.
            </p>
          )}
        </div>

        {/* <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h4 className="text-base font-semibold mb-4">
                Permission catalog
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                This catalog lists the RBAC permissions available for roles and
                direct staff access. View permissions control sidebar menu
                visibility.
              </p>
              {permissionsLoading ? (
                <p className="text-sm text-gray-500">
                  Loading permission catalog...
                </p>
              ) : (
                <>
                  {permissionsError && (
                    <p className="text-sm text-red-500 mb-3">
                      Failed to load permission catalog. Showing default sidebar
                      permissions instead.
                    </p>
                  )}
                  {permissionCatalogOptions.length ? (
                    <div className="space-y-3">
                      {permissionCatalogOptions.map((permission) => (
                        <div
                          key={permission.code}
                          className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                        >
                          <p className="font-medium text-slate-900">
                            {permission.label}
                          </p>
                          <p className="mt-1 text-xs text-slate-600">
                            {permission.type}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {DEFAULT_SIDEBAR_PERMISSIONS.map((permission) => (
                        <div
                          key={permission.code}
                          className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                        >
                          <p className="font-medium text-slate-900">
                            {permission.label}
                          </p>
                          <p className="mt-1 text-xs text-slate-600">view</p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div> */}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h4 className="text-base font-semibold">
              Staff permission assignments
            </h4>
            <p className="text-sm text-gray-500">
              Select a staff member and manage their role plus sidebar menu
              permissions directly.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Current Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Permissions
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Assign
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staffs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    No staff members available.
                  </td>
                </tr>
              ) : (
                staffs.map((staff: TStaff) => {
                  const assignedRole = rbacRoles?.find(
                    (role: any) => role._id === staff.staffRoleId,
                  );
                  const directPermissions = staff.staffPermissions ?? [];
                  const rolePermissionCodes = assignedRole
                    ? assignedRole.permissions
                        .filter((permission: any) => permission.allowed)
                        .map(
                          (permission: any) =>
                            `${permission.module_name}:${permission.permission_type}`,
                        )
                    : [];
                  const effectivePermissionCount = new Set([
                    ...rolePermissionCodes,
                    ...directPermissions,
                  ]).size;

                  return (
                    <tr key={staff._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-900 capitalize">
                        {staff.userName}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {staff.userEmail || "-"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {assignedRole ? assignedRole.role_name : "Unassigned"}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {effectivePermissionCount}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => openAssignRole(staff)}
                          className="inline-flex items-center rounded bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                          <UserCog size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="mt-4">
            <TablePagination
              page={page}
              totalPages={totalPages || 1}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>

      {isAssignOpen && selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 ">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl h-[95vh] overflow-y-scroll">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-xl font-semibold">
                  Manage permissions for {selectedStaff.userName}
                </h4>
                <p className="text-sm text-gray-500">
                  Grant sidebar access and menu permissions per staff member.
                  Role permissions and direct menu permissions are merged.
                </p>
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
                <label className="block text-sm font-medium text-gray-700">
                  Assign role
                </label>
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
                      No RBAC roles are defined yet. Create a role first so it
                      can be assigned to staff.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block text-sm text-gray-600">
                        Role name
                        <input
                          value={newRoleName}
                          onChange={(event) =>
                            setNewRoleName(event.target.value)
                          }
                          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                          placeholder="e.g. Sales Staff"
                        />
                      </label>
                      <label className="block text-sm text-gray-600">
                        Description
                        <input
                          value={newRoleDescription}
                          onChange={(event) =>
                            setNewRoleDescription(event.target.value)
                          }
                          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                          placeholder="Optional role description"
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => createRoleMutation.mutate()}
                      disabled={
                        !newRoleName.trim() ||
                        createRoleMutation.status === "pending"
                      }
                      className="inline-flex items-center rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
                    >
                      {createRoleMutation.status === "pending"
                        ? "Creating role..."
                        : "Create role"}
                    </button>
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-gray-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Sidebar menu permissions
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Select which business sidebar items this staff member can
                  access.
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {sidebarPermissionOptions.length > 0 ? (
                    sidebarPermissionOptions.map((permission) => {
                      const isChecked = selectedPermissions.includes(
                        permission.code,
                      );

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
                                  ? current.filter(
                                      (item) => item !== permission.code,
                                    )
                                  : [...current, permission.code];
                              });
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className="capitalize">{permission.label}</span>
                        </label>
                      );
                    })
                  ) : (
                    <div className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-gray-500">
                      No sidebar menu permissions are available yet. Please seed
                      RBAC permissions or ensure the permission catalog is
                      loaded.
                    </div>
                  )}
                </div>
              </div>

              {selectedRoleId && (
                <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 text-sm text-indigo-700">
                  Role permissions will still apply in addition to these direct
                  menu selections.
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
                {updateStaffRoleMutation.status === "pending"
                  ? "Saving..."
                  : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={itemToRemove !== null}
        title="Remove Staff"
        message="Are you sure you want to remove this staff member?"
        onConfirm={confirmRemove}
        isPending={isPending}
        onCancel={() => setItemToRemove(null)}
      />
    </div>
  );
}
