"use client";

import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
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
import AttendanceRecord from "@/components/business-admin/attendance/AttendanceRecord";
import TabNavigation from "@/components/shared/TabNavigation";
import LogDetails from "@/components/shared/LogDetails";
import CustomizeSection from "@/components/shared/CustomizeSection";
import { BarChart3, Settings, ActivitySquare, FileText } from "lucide-react";
import AttendanceStats from "@/components/business-admin/attendance/AttendanceStats";
import { useBusinessAnalytics } from "@/hooks/business-admin/analysis/useBusinessAnalytics";
import type { TAttendance } from "@/libs/types/attendance.types";
import { useTodayAttendance } from "@/hooks/business-admin/attendance-management/getTodaysAttendance";
import { useAttendanceStats } from "@/hooks/business-admin/stats-data/getAttendanceStats";

const ATTENDANCE_COLORS = ["#16a34a", "#dc2626", "#2563eb", "#f59e0b"];

const formatMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export default function AttendancePage() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("inventory");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");

  const [debouncedSearch] = useDebounce(search, 500);
  const { summary } = useBusinessAnalytics();

  const [businessId] = useState<string>(() => {
    const storedData = JSON.parse(localStorage.getItem("auth-data") || "{}");
    return storedData?.business_id;
  });

  const { data: attendanceData } = useAllAttendances({
    page,
    business_id: businessId,
  });

  const {
    data: users,
    isLoading,
    isError,
  } = useTodayAttendance({
    page: 1,
    limit: 1000,
    business_id: businessId,
    search: debouncedSearch,
    role,
  });

  const { data: attendanceStats } = useAttendanceStats();

  const attendances = useMemo<TAttendance[]>(
    () => attendanceData?.data ?? attendanceData ?? [],
    [attendanceData],
  );

  const attendanceOverview = summary?.attendance;

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
    { id: "inventory", label: "Records", icon: <FileText size={16} /> },
    { id: "analysis", label: "Analysis", icon: <BarChart3 size={16} /> },
    {
      id: "customize",
      label: "Customize",
      icon: <Settings size={16} />,
      disabled: true,
      badge: "Dev",
    },
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
      </div>

      <AttendanceStats />

      {/* TAB NAVIGATION */}
      <TabNavigation
        activeTab={activeTab}
        tabs={tabs}
        onTabChange={setActiveTab}
      />

      {/* TAB CONTENT */}
      {activeTab === "inventory" && (
        <AttendanceRecord
          users={users?.data || []}
          isLoading={isLoading}
          error={isError ? "Failed to load attendance records" : null}
          page={page}
          totalPages={users?.pagination?.totalPages || 1}
          onPageChange={setPage}
          search={search}
          setSearch={setSearch}
          role={role}
          setRole={setRole}
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

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  {/* CENTER TOTAL LABEL (custom overlay) */}
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-sm fill-gray-500"
                  >
                    Total
                  </text>

                  <text
                    x="50%"
                    y="54%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-lg font-semibold fill-gray-900"
                  >
                    {attendanceMethodData.reduce(
                      (acc, curr) => acc + curr.value,
                      0,
                    )}
                  </text>

                  <Pie
                    data={attendanceMethodData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={105}
                    innerRadius={60}
                    paddingAngle={3}
                    labelLine={false}
                    label={({ name, percent }) => {
                      const safePercent =
                        typeof percent === "number" ? percent : 0;

                      return `${name} (${(safePercent * 100).toFixed(0)}%)`;
                    }}
                  >
                    {attendanceMethodData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={
                          ATTENDANCE_COLORS[index % ATTENDANCE_COLORS.length]
                        }
                      />
                    ))}
                  </Pie>

                  {/* TOOLTIP */}
                  <Tooltip
                    formatter={(value, name) => [`${value} records`, name]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* LEGEND */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-600">
                {attendanceMethodData.map((item, index) => {
                  const total = attendanceMethodData.reduce(
                    (acc, curr) => acc + curr.value,
                    0,
                  );
                  const percent = total ? (item.value / total) * 100 : 0;

                  return (
                    <div
                      key={item.name}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              ATTENDANCE_COLORS[
                                index % ATTENDANCE_COLORS.length
                              ],
                          }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium text-gray-700">
                        {percent.toFixed(1)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Live Insight
              </h3>
              <div className="space-y-4 text-sm text-gray-600">
                <p>
                  Attendance rate is{" "}
                  {attendanceStats?.attendanceRate.toFixed(1)}% with{" "}
                  {attendanceStats?.totalAttendance.toLocaleString()} present
                  records currently in the system.
                </p>
                <p>
                  {attendanceStats?.totalAbsent.toLocaleString()} absences,{" "}
                  {attendanceStats?.totalOnLeave.toLocaleString()} leave
                  records,s and {attendanceStats?.lateToday.toLocaleString()}{" "}
                  late check-ins are visible from the current stats feed.
                </p>
                <p>
                  The calendar view below uses the same live attendance records,
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
    </div>
  );
}
