"use client";

import { useState } from "react";
import { useAllStaff } from "@/hooks/business-admin/staff-management/getAllStaffDatas";
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
} from "lucide-react";

const mockStaffData = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@techflow.com',
    position: 'Senior Engineer',
    department: 'Engineering',
    salary: 95000,
    joinDate: '2022-01-15',
    status: 'active',
    phone: '+1-555-0101',
    address: '123 Main St, NYC',
    role: 'manager',
    permissions: {
      canView: true,
      canEdit: true,
      canDelete: false,
      canCreate: true,
      customFields: true,
      moduleAccess: ['staff', 'attendance', 'payroll'],
    },
  },
];

export default function StaffPage() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("inventory");

  const {
    data: staffData,
    isLoading,
    isError,
  } = useAllStaff({ page, limit: 10 });

  const staffs = staffData?.data ?? staffData ?? [];
  const pagination = staffData?.pagination;

  const tabs = [
    { id: "inventory", label: "Inventory", icon: <FileText size={16} /> },
    { id: "permission", label: "Permission", icon: <Wrench size={16} /> },
    { id: "analysis", label: "Analysis", icon: <BarChart3 size={16} /> },
    { id: "customize", label: "Customize", icon: <Settings size={16} /> },
    { id: "logs", label: "Log Details", icon: <ActivitySquare size={16} /> },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Business Staff Records</h2>
          <p className="text-sm text-gray-500">
            Manage all business staffs in the system
          </p>
        </div>
      </div>

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
        />
      )}

      {activeTab === "permission" && (
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Role-Based Access Control</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Name</th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">View</th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">Edit</th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">Delete</th>
                  <th className="text-center py-3 px-4 font-semibold text-foreground">Create</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Module Access</th>
                </tr>
              </thead>
              <tbody>
                {mockStaffData.map((staff) => (
                  <tr key={staff.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">{staff.name}</td>
                    <td className="text-center py-3 px-4">
                      <input
                        type="checkbox"
                        checked={staff.permissions.canView}
                        disabled
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="text-center py-3 px-4">
                      <input
                        type="checkbox"
                        checked={staff.permissions.canEdit}
                        disabled
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="text-center py-3 px-4">
                      <input
                        type="checkbox"
                        checked={staff.permissions.canDelete}
                        disabled
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="text-center py-3 px-4">
                      <input
                        type="checkbox"
                        checked={staff.permissions.canCreate}
                        disabled
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1 flex-wrap">
                        {staff.permissions.moduleAccess.map((module) => (
                          <span
                            key={module}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded"
                          >
                            {module}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "analysis" && (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Staff Analysis
            </h3>
            <p className="text-gray-600">
              View detailed staff analytics and performance reports
            </p>
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
          module="Staff"
          onClearLogs={() => {
            console.log("Clearing staff logs");
          }}
        />
      )}

    </div>
  );
}
