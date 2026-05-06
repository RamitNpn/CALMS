"use client";

import React from "react";
import { Staff } from "@/libs/types/staff.types";
import { DataTable, TableColumn } from "@/components/shared/DataTable";

interface StaffTableProps {
  staffs: Staff[];
  isLoading?: boolean;
  error?: string | null;
  onEdit?: (staff: Staff) => void;
  onDelete?: (staff: Staff) => void;
}

export function StaffTable({
  staffs,
  isLoading,
  error,
  onEdit,
  onDelete,
}: StaffTableProps) {
  const columns: TableColumn<Staff>[] = [
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "phone",
      label: "Phone",
    },
    {
      key: "role",
      label: "Role",
      render: (value) => (
        <span className="px-2 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
          {value}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium ${
            value
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value ? "Active" : "Inactive"}
        </span>
      ),
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
      data={staffs}
      isLoading={isLoading}
      error={error}
      onEdit={onEdit}
      onDelete={onDelete}
      pageSize={10}
    />
  );
}
