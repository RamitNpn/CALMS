"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Trash2, Edit2, Eye } from "lucide-react";
import clsx from "clsx";

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  isLoading?: boolean;
  error?: string | null;
  pageSize?: number;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  actions?: boolean;
}

export function DataTable<T extends { _id: string }>({
  columns,
  data,
  isLoading,
  error,
  pageSize = 10,
  onEdit,
  onDelete,
  onView,
  actions = true,
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = data.slice(startIndex, startIndex + pageSize);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
        Error: {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No data found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={clsx(
                    "px-4 py-3 text-left text-sm font-semibold text-gray-700",
                    column.width && `w-${column.width}`
                  )}
                >
                  {column.label}
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, index) => (
              <tr
                key={row._id}
                className={clsx(
                  "border-b transition-colors hover:bg-gray-50",
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                )}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={clsx(
                      "px-4 py-3 text-sm text-gray-700",
                      column.width && `w-${column.width}`
                    )}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : formatCellValue(row[column.key])}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {onView && (
                        <button
                          onClick={() => onView(row)}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="p-2 hover:bg-amber-100 rounded-lg transition-colors text-amber-600"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, data.length)} of{" "}
            {data.length} results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={clsx(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    currentPage === page
                      ? "bg-primary text-white"
                      : "border hover:bg-gray-50"
                  )}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function formatCellValue(value: any): string {
  if (value === null || value === undefined) return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value instanceof Date) return new Date(value).toLocaleDateString();
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}
