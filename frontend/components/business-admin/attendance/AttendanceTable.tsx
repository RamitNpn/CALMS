"use client";

import React from "react";
import { Attendance } from "@/libs/types/attendance.types";
import { DataTable, TableColumn } from "@/components/shared/DataTable";

interface AttendanceTableProps {
  attendance: Attendance[];
  isLoading?: boolean;
  error?: string | null;
  onEdit?: (attendance: Attendance) => void;
  onDelete?: (attendance: Attendance) => void;
}

export function AttendanceTable({
  attendance,
  isLoading,
  error,
  onEdit,
  onDelete,
}: AttendanceTableProps) {
  const columns: TableColumn<Attendance>[] = [
    {
      key: "date",
      label: "Date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: "userId",
      label: "User ID",
    },
    {
      key: "userType",
      label: "User Type",
      render: (value) => (
        <span className="px-2 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
          {value}
        </span>
      ),
    },
    {
      key: "checkIn",
      label: "Check-in",
      render: (value) =>
        value ? new Date(value).toLocaleTimeString() : "-",
    },
    {
      key: "checkOut",
      label: "Check-out",
      render: (value) =>
        value ? new Date(value).toLocaleTimeString() : "-",
    },
    {
      key: "method",
      label: "Method",
      render: (value) => (
        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-200 text-gray-800">
          {value || "-"}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={attendance}
      isLoading={isLoading}
      error={error}
      onEdit={onEdit}
      onDelete={onDelete}
      pageSize={10}
    />
  );
}
