"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAllAttendances } from "@/hooks/business-admin/attendance-management/getAllAttendances";
import { useAllStaff } from "@/hooks/business-admin/staff-management/getAllStaffDatas";
import { useAllClients } from "@/hooks/business-admin/client-management/getAllClientData";
import AttendanceRecord from "@/components/business-admin/attendance/AttendanceRecord";
import TabNavigation from "@/components/shared/TabNavigation";
import LogDetails from "@/components/shared/LogDetails";
import CustomizeSection from "@/components/shared/CustomizeSection";
import {
  BarChart3,
  Settings,
  ActivitySquare,
  FileText,
} from "lucide-react";
import AttendanceStats from "@/components/business-admin/attendance/AttendanceStats";
import { useBusinessAnalytics } from "@/hooks/business-admin/analysis/useBusinessAnalytics";
import { useToast } from "@/components/ui/toast";
import { attendanceApi } from "@/libs";
import type { TClient } from "@/libs/types/client.types";
import type { TAttendance } from "@/libs/types/attendance.types";
import type { TStaff } from "@/libs/types/staff.types";

type AttendanceRow = {
  _id: string;
  userId: string;
  business_id: string;
  userName: string;
  userEmail: string;
  userType: "staff" | "client";
  method?: TAttendance["method"];
  checkIn?: TAttendance["checkIn"];
  checkOut?: TAttendance["checkOut"];
  attendanceId?: string;
};

const ATTENDANCE_COLORS = ["#16a34a", "#dc2626", "#2563eb", "#f59e0b"];

const formatMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export default function AttendancePage() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("inventory");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkUpdateOpen, setIsBulkUpdateOpen] = useState(false);
  const { summary } = useBusinessAnalytics();

  const {
    data: attendanceData,
    isLoading,
    isError,
  } = useAllAttendances({ page: 1, limit: 1000 });

  const { data: staffData } = useAllStaff({ page: 1, limit: 1000 });
  const { data: clientData } = useAllClients({ page: 1, limit: 1000 });

  const attendances = useMemo<TAttendance[]>(
    () => attendanceData?.data ?? attendanceData ?? [],
    [attendanceData],
  );
  const staffMembers = useMemo<TStaff[]>(
    () => staffData?.data ?? staffData ?? [],
    [staffData],
  );
  const clients = useMemo<TClient[]>(
    () => clientData?.data ?? clientData ?? [],
    [clientData],
  );
  const pagination = attendanceData?.pagination;

  const attendanceRows = useMemo<AttendanceRow[]>(
    () => {
      const attendanceByPerson = new Map<string, TAttendance>();

      attendances.forEach((attendance) => {
        const keys = [
          attendance.clientId?.toString(),
          buildAttendanceEmailKey(attendance.clientEmail, attendance.userType),
        ].filter(Boolean) as string[];

        keys.forEach((key) => {
          const existing = attendanceByPerson.get(key);

          if (!existing || isAttendanceNewer(attendance, existing)) {
            attendanceByPerson.set(key, attendance);
          }
        });
      });

      const staffRows = staffMembers.map((staff) => {
        const attendance =
          attendanceByPerson.get(staff._id) ??
          attendanceByPerson.get(buildAttendanceEmailKey(staff.userEmail, "staff"));

        return {
          _id: `staff-${staff._id}`,
          userId: staff._id,
          business_id: staff.business_id,
          userName: staff.userName,
          userEmail: staff.userEmail,
          userType: "staff",
          method: attendance?.method,
          checkIn: attendance?.checkIn,
          checkOut: attendance?.checkOut,
          attendanceId: attendance?._id,
        } satisfies AttendanceRow;
      });

      const clientRows = clients.map((client) => {
        const attendance =
          attendanceByPerson.get(client._id) ??
          attendanceByPerson.get(buildAttendanceEmailKey(client.userEmail, "client"));

        return {
          _id: `client-${client._id}`,
          userId: client._id,
          business_id: client.business_id,
          userName: client.userName,
          userEmail: client.userEmail,
          userType: "client",
          method: attendance?.method,
          checkIn: attendance?.checkIn,
          checkOut: attendance?.checkOut,
          attendanceId: attendance?._id,
        } satisfies AttendanceRow;
      });

      return [...staffRows, ...clientRows];
    },
    [attendances, staffMembers, clients],
  );

  const selectedRows = useMemo(
    () => attendanceRows.filter((row) => selectedIds.includes(row._id)),
    [attendanceRows, selectedIds],
  );

  const selectedCount = selectedRows.length;

  const attendanceOverview = summary?.attendance;

  const attendanceStats = {
    presentCount: attendanceOverview?.totalAttendance ?? 0,
    absentCount: attendanceOverview?.totalAbsent ?? 0,
    leaveCount: attendanceOverview?.totalOnLeave ?? 0,
    lateCount: attendanceOverview?.lateToday ?? 0,
    attendanceRate: attendanceOverview?.attendanceRate ?? 0,
  };

  const attendanceTrend = useMemo(() => {
    const byMonth = attendances.reduce<Record<string, number>>((acc, item) => {
      const monthKey = formatMonthKey(new Date(item.createdAt));
      acc[monthKey] = (acc[monthKey] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(byMonth)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([month, total]) => ({
        month,
        total,
      }));
  }, [attendances]);

  const attendanceMethodData = useMemo(() => {
    const byMethod = attendances.reduce<Record<string, number>>((acc, item) => {
      acc[item.method] = (acc[item.method] ?? 0) + 1;
      return acc;
    }, {});

    return ["QR", "Manual"].map((method) => ({
      name: method,
      value: byMethod[method] ?? 0,
    }));
  }, [attendances]);

  const attendanceBreakdown = useMemo(() => {
    const present = attendanceOverview?.totalAttendance ?? 0;
    const absent = attendanceOverview?.totalAbsent ?? 0;
    const leave = attendanceOverview?.totalOnLeave ?? 0;
    const late = attendanceOverview?.lateToday ?? 0;

    return [
      { name: "Present", value: present },
      { name: "Absent", value: absent },
      { name: "Leave", value: leave },
      { name: "Late", value: late },
    ];
  }, [attendanceOverview]);

  const tabs = [
    { id: "inventory", label: "Inventory", icon: <FileText size={16} /> },
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
            Business Attendance Records
          </h2>
          <p className="text-sm text-gray-500">
            Manage all business attendance records in the system
          </p>
        </div>

        {activeTab === "inventory" && (
          <div className="flex items-center gap-2">
            {selectedCount > 0 && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {selectedCount} selected
              </span>
            )}
            <button
              type="button"
              disabled={selectedCount === 0}
              onClick={() => setIsBulkUpdateOpen(true)}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Update Selected
            </button>
          </div>
        )}
      </div>

      <AttendanceStats {...attendanceStats} />

      {/* TAB NAVIGATION */}
      <TabNavigation
        activeTab={activeTab}
        tabs={tabs}
        onTabChange={setActiveTab}
      />

      {/* TAB CONTENT */}
      {activeTab === "inventory" && (
        <AttendanceRecord
          rows={attendanceRows}
          isLoading={isLoading}
          error={isError ? "Failed to load attendance records" : null}
          page={page}
          totalPages={pagination?.totalPages || 1}
          onPageChange={setPage}
          selectedIds={selectedIds}
          onSelectedIdsChange={setSelectedIds}
        />
      )}

      {activeTab === "analysis" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Attendance Trend
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={attendanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#2563eb"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Attendance Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={attendanceBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Check-in Method Split
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={attendanceMethodData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {attendanceMethodData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={ATTENDANCE_COLORS[index % ATTENDANCE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Live Insight
              </h3>
              <div className="space-y-4 text-sm text-gray-600">
                <p>
                  Attendance rate is {attendanceStats.attendanceRate.toFixed(1)}%
                  with {attendanceStats.presentCount.toLocaleString()} present
                  records currently in the system.
                </p>
                <p>
                  {attendanceStats.absentCount.toLocaleString()} absences,
                  {" "}
                  {attendanceStats.leaveCount.toLocaleString()} leave records,
                  and {attendanceStats.lateCount.toLocaleString()} late check-ins
                  are visible from the current stats feed.
                </p>
                <p>
                  The inventory tab below uses the same live attendance records,
                  so it updates as soon as new check-ins are saved.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "customize" && (
        <CustomizeSection
          module="Attendance"
          onSave={(options) => {
            console.log("Attendance customization saved:", options);
          }}
        />
      )}

      {activeTab === "logs" && (
        <LogDetails
          userId={attendances[0]?.business_id ?? ""}
          module="Attendance"
          onClearLogs={() => {
            console.log("Clearing attendance logs");
          }}
        />
      )}

      {isBulkUpdateOpen && (
        <BulkUpdateAttendanceModal
          rows={selectedRows}
          onClose={() => setIsBulkUpdateOpen(false)}
          onSuccess={() => setSelectedIds([])}
        />
      )}
    </div>
  );
}

function BulkUpdateAttendanceModal({
  rows,
  onClose,
  onSuccess,
}: {
  rows: AttendanceRow[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const queryClient = useQueryClient();
  const toast = useToast.getState();

  const getResolvedCheckIn = () => checkIn || new Date().toISOString();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const resolvedCheckIn = getResolvedCheckIn();

      await Promise.all(
        rows.map((row) => {
          if (row.attendanceId) {
            return attendanceApi.updateAttendanceApi(row.attendanceId, {
              _id: row.attendanceId,
              checkIn: resolvedCheckIn,
              checkOut: checkOut || undefined,
            });
          }

          return attendanceApi.createAttendance({
            business_id: row.business_id,
            clientName: row.userName,
            clientEmail: row.userEmail,
            userType: row.userType,
            checkIn: resolvedCheckIn,
            checkOut: checkOut || undefined,
          });
        }),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
      toast.show({
        message: "Selected attendance rows updated successfully",
        type: "success",
      });
      onSuccess();
      onClose();
    },
    onError: () => {
      toast.show({ message: "Failed to update selected attendance rows", type: "error" });
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Bulk Update</p>
            <h3 className="text-lg font-semibold text-gray-900">Update Selected Attendance</h3>
            <p className="mt-1 text-sm text-gray-500">Apply the same check-in and check-out values to {rows.length} selected row{rows.length === 1 ? "" : "s"}. If check-in is empty, the current date and time will be used.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition hover:bg-gray-50"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            mutate();
          }}
          className="space-y-4 px-5 py-5"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">Check In</label>
            <input
              type="datetime-local"
              value={checkIn}
              onChange={(event) => setCheckIn(event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none ring-0 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Check Out</label>
            <input
              type="datetime-local"
              value={checkOut}
              onChange={(event) => setCheckOut(event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none ring-0 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || rows.length === 0}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Updating..." : "Update Selected"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function buildAttendanceEmailKey(email?: string | null, userType?: string | null) {
  const e = (email ?? "").toString().trim().toLowerCase();
  const u = (userType ?? "").toString().trim().toLowerCase();

  return `${e}|${u}`;
}

function isAttendanceNewer(left: TAttendance, right: TAttendance) {
  const leftTime = new Date(left.updatedAt ?? left.createdAt).getTime();
  const rightTime = new Date(right.updatedAt ?? right.createdAt).getTime();
  return leftTime >= rightTime;
}
