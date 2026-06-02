"use client";

import { useMemo, useState } from "react";
import moment from "moment";
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
import {
  BarChart3,
  Settings,
  ActivitySquare,
  FileText,
  Calendar,
} from "lucide-react";
import { AttendanceCalendar } from "@/components/business-admin/attendance/AttendanceCalender";
import AttendanceStats from "@/components/business-admin/attendance/AttendanceStats";
import { useBusinessAnalytics } from "@/hooks/business-admin/analysis/useBusinessAnalytics";
import type { TAttendance } from "@/libs/types/attendance.types";

const ATTENDANCE_COLORS = ["#16a34a", "#dc2626", "#2563eb", "#f59e0b"];

type CalendarAttendanceRecord = {
  date: string;
  status: "present" | "absent" | "leave" | "half-day" | "holiday";
  checkInTime?: string;
  checkOutTime?: string;
};

const getAttendanceStatus = (attendance: TAttendance) => {
  if (attendance.checkIn && attendance.checkOut) {
    return "present" as const;
  }

  if (attendance.checkIn && !attendance.checkOut) {
    return "half-day" as const;
  }

  if (!attendance.checkIn && attendance.checkOut) {
    return "leave" as const;
  }

  return "absent" as const;
};

const formatMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export default function AttendancePage() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("inventory");
  const { summary } = useBusinessAnalytics();

  const {
    data: attendanceData,
    isLoading,
    isError,
  } = useAllAttendances({ page, limit: 10 });

  const attendances: TAttendance[] = attendanceData?.data ?? attendanceData ?? [];
  const pagination = attendanceData?.pagination;

  const attendanceOverview = summary?.attendance;

  const attendanceStats = {
    presentCount: attendanceOverview?.totalAttendance ?? 0,
    absentCount: attendanceOverview?.totalAbsent ?? 0,
    leaveCount: attendanceOverview?.totalOnLeave ?? 0,
    lateCount: attendanceOverview?.lateToday ?? 0,
    attendanceRate: attendanceOverview?.attendanceRate ?? 0,
  };

  const calendarRecords = useMemo<CalendarAttendanceRecord[]>(
    () =>
      attendances.map((attendance) => {
        const createdAt = new Date(attendance.createdAt);

        return {
          date: createdAt.toISOString().slice(0, 10),
          status: getAttendanceStatus(attendance),
          checkInTime: attendance.checkIn
            ? moment(attendance.checkIn).format("hh:mm A")
            : undefined,
          checkOutTime: attendance.checkOut
            ? moment(attendance.checkOut).format("hh:mm A")
            : undefined,
        };
      }),
    [attendances],
  );

  const calendarMonth = useMemo(() => {
    if (attendances.length === 0) {
      return new Date();
    }

    const latestAttendance = [...attendances].sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    )[0];

    return new Date(latestAttendance.createdAt);
  }, [attendances]);

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
    { id: "calender", label: "Calender View", icon: <Calendar size={16} /> },
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
          attendances={attendances}
          isLoading={isLoading}
          error={isError ? "Failed to load attendance records" : null}
          page={page}
          totalPages={pagination?.totalPages || 1}
          onPageChange={setPage}
        />
      )}

      {activeTab === "calender" && (
        <AttendanceCalendar records={calendarRecords} month={calendarMonth} />
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
