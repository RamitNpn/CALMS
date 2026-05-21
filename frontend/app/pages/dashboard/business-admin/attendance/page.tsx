"use client";

import { useState } from "react";
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

export interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: "present" | "absent" | "leave" | "half-day" | "holiday";
  notes?: string;
}

export default function AttendancePage() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("inventory");

  const {
    data: attendanceData,
    isLoading,
    isError,
  } = useAllAttendances({ page, limit: 10 });

  const attendances = attendanceData?.data ?? attendanceData ?? [];
  const pagination = attendanceData?.pagination;

  const tabs = [
    { id: "inventory", label: "Inventory", icon: <FileText size={16} /> },
    { id: "calender", label: "Calender View", icon: <Calendar size={16} /> },
    { id: "analysis", label: "Analysis", icon: <BarChart3 size={16} /> },
    { id: "customize", label: "Customize", icon: <Settings size={16} /> },
    { id: "logs", label: "Log Details", icon: <ActivitySquare size={16} /> },
  ];

  const mockAttendanceRecords: AttendanceRecord[] = [
    {
      id: "1",
      staffId: "1",
      staffName: "Alice Johnson",
      date: "2024-02-01",
      checkInTime: "09:00 AM",
      checkOutTime: "06:00 PM",
      status: "present",
    },
    {
      id: "2",
      staffId: "2",
      staffName: "Bob Smith",
      date: "2024-02-02",
      checkInTime: "08:55 AM",
      checkOutTime: "05:55 PM",
      status: "present",
    },
    {
      id: "3",
      staffId: "3",
      staffName: "Carol Davis",
      date: "2024-02-03",
      status: "holiday",
    },
    {
      id: "4",
      staffId: "4",
      staffName: "David Wilson",
      date: "2024-02-04",
      checkInTime: "09:10 AM",
      checkOutTime: "06:05 PM",
      status: "present",
    },
    {
      id: "5",
      staffId: "5",
      staffName: "Emma Brown",
      date: "2024-02-05",
      status: "absent",
    },
    {
      id: "6",
      staffId: "6",
      staffName: "Frank Miller",
      date: "2024-02-06",
      status: "leave",
    },
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
          attendances={attendances}
          isLoading={isLoading}
          error={isError ? "Failed to load attendance records" : null}
          page={page}
          totalPages={pagination?.totalPages || 1}
          onPageChange={setPage}
        />
      )}

      {activeTab === "calender" && (
        <AttendanceCalendar records={mockAttendanceRecords} />
      )}

      {activeTab === "analysis" && (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center">
            <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Attendance Analysis
            </h3>
            <p className="text-gray-600">
              View detailed attendance patterns and reports
            </p>
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
          userId={attendanceData.businessId}
          module="Attendance"
          onClearLogs={() => {
            console.log("Clearing attendance logs");
          }}
        />
      )}
    </div>
  );
}
