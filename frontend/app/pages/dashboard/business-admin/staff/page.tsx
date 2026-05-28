"use client";

import { useMemo, useState } from "react";
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

  const totalStaff = summary?.users.totalStaff ?? staffs.length;
  const activeStaff = summary?.users.totalActiveStaff ?? staffs.length;
  const inactiveStaff = summary?.users.totalInactiveStaff ?? 0;
  const activeRate = totalStaff > 0 ? (activeStaff / totalStaff) * 100 : 0;

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
        />
      )}

      {activeTab === "permission" && (
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            Role-Based Access Control
          </h3>
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600">
            Permission details are managed from staff records and role settings.
            Live permission analytics are not exposed by the current API yet.
          </div>
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
