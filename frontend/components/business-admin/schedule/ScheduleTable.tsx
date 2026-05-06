"use client";

import React from "react";
import { Schedule } from "@/libs/types/schedule.types";
import { DataTable, TableColumn } from "@/components/shared/DataTable";

interface ScheduleTableProps {
  schedules: Schedule[];
  isLoading?: boolean;
  error?: string | null;
  onEdit?: (schedule: Schedule) => void;
  onDelete?: (schedule: Schedule) => void;
}

export function ScheduleTable({
  schedules,
  isLoading,
  error,
  onEdit,
  onDelete,
}: ScheduleTableProps) {
  const columns: TableColumn<Schedule>[] = [
    {
      key: "title",
      label: "Title",
      sortable: true,
    },
    {
      key: "startTime",
      label: "Start Time",
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      key: "endTime",
      label: "End Time",
      render: (value) => new Date(value).toLocaleString(),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => {
        const colors = {
          PENDING: "bg-yellow-100 text-yellow-800",
          CONFIRMED: "bg-green-100 text-green-800",
          CANCELLED: "bg-red-100 text-red-800",
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${
              colors[value as keyof typeof colors] || ""
            }`}
          >
            {value}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      label: "Created Date",
      render: (value) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={schedules}
      isLoading={isLoading}
      error={error}
      onEdit={onEdit}
      onDelete={onDelete}
      pageSize={10}
    />
  );
}
