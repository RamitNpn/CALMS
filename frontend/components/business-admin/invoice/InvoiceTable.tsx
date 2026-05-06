"use client";

import React from "react";
import { Invoice } from "@/libs/types/invoice.types";
import { DataTable, TableColumn } from "@/components/shared/DataTable";

interface InvoiceTableProps {
  invoices: Invoice[];
  isLoading?: boolean;
  error?: string | null;
  onEdit?: (invoice: Invoice) => void;
  onDelete?: (invoice: Invoice) => void;
}

export function InvoiceTable({
  invoices,
  isLoading,
  error,
  onEdit,
  onDelete,
}: InvoiceTableProps) {
  const columns: TableColumn<Invoice>[] = [
    {
      key: "clientId",
      label: "Client ID",
    },
    {
      key: "totalAmount",
      label: "Total Amount",
      render: (value) => `PKR ${value.toFixed(2)}`,
    },
    {
      key: "paidAmount",
      label: "Paid Amount",
      render: (value) => `PKR ${(value || 0).toFixed(2)}`,
    },
    {
      key: "status",
      label: "Status",
      render: (value) => {
        const colors = {
          PAID: "bg-green-100 text-green-800",
          PARTIAL: "bg-yellow-100 text-yellow-800",
          DUE: "bg-red-100 text-red-800",
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
      key: "dueDate",
      label: "Due Date",
      render: (value) =>
        value ? new Date(value).toLocaleDateString() : "-",
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
      data={invoices}
      isLoading={isLoading}
      error={error}
      onEdit={onEdit}
      onDelete={onDelete}
      pageSize={10}
    />
  );
}
