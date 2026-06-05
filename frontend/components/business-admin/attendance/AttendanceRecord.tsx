"use client";

import { useState } from "react";
import { Pencil, X } from "lucide-react";
import moment from "moment";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import TablePagination from "@/components/shared/Pagination";
import { useToast } from "@/components/ui/toast";

import { attendanceApi, TAttendance } from "@/libs";
import { AttendanceForm } from "./AttendanceForm";
import clsx from "clsx";

type AttendanceRow = {
  _id: string;
  business_id: string;
  userName: string;
  userEmail: string;
  userType: "staff" | "client";
  method?: TAttendance["method"];
  checkIn?: TAttendance["checkIn"];
  checkOut?: TAttendance["checkOut"];
  status?: TAttendance["status"];
  attendanceId?: string;
};

interface AttendanceTableProps {
  rows: AttendanceRow[];
  isLoading?: boolean;
  error?: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  selectedIds: string[];
  onSelectedIdsChange: (selectedIds: string[]) => void;
}

export default function AttendanceRecord({
  rows,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
  selectedIds,
  onSelectedIdsChange,
}: AttendanceTableProps) {
  const [open, setOpen] = useState(false);
  const [quickEditRow, setQuickEditRow] = useState<AttendanceRow | null>(null);

  const visibleSelectedIds = selectedIds.filter((id) =>
    rows.some((row) => row._id === id),
  );
  const selectedCount = visibleSelectedIds.length;
  const allVisibleSelected =
    rows.length > 0 && visibleSelectedIds.length === rows.length;
  const someVisibleSelected = selectedCount > 0 && selectedCount < rows.length;

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="w-full h-[75vh] overflow-y-scroll rounded-2xl border border-gray-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-gray-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">Inventory</p>
          <p className="text-xs text-gray-500">
            Select one or more rows, then update check-in and check-out from the
            action button.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {selectedCount} selected
            </span>
          )}
          {selectedCount > 0 && (
            <button
              type="button"
              onClick={() => onSelectedIdsChange([])}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
            >
              Clear selection
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-sm text-gray-800">
              <th className="py-3 px-2 text-center">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={(event) => {
                    if (event.target.checked) {
                      onSelectedIdsChange(rows.map((r) => r._id));
                      return;
                    }

                    onSelectedIdsChange([]);
                  }}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = someVisibleSelected;
                    }
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  aria-label="Select all attendance rows"
                />
              </th>
              <th className="py-3 px-2 text-left">SN</th>
              <th className="py-3 px-2 text-left">User Name</th>
              <th className="py-3 px-2 text-left">User Email</th>
              <th className="py-3 px-2 text-left">User Type</th>
              <th className="py-3 px-2 text-left">Check In</th>
              <th className="py-3 px-2 text-left">Check Out</th>
              <th className="py-3 px-2 text-left">Status</th>
              <th className="py-3 px-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody className="text-gray-700 text-[13px]">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center text-gray-500">
                  No staff or client records found
                </td>
              </tr>
            ) : (
              rows.map((row, index) => {
                const isSelected = selectedIds.includes(row._id);

                return (
                  <tr
                    key={row._id}
                    className={clsx(
                      "border-b border-gray-200 transition hover:bg-white",
                      isSelected && "bg-blue-50/70",
                    )}
                  >
                    <td className="py-3 px-2 text-center align-middle">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectedIdsChange([...selectedIds, row._id]);
                            return;
                          }

                          onSelectedIdsChange(
                            selectedIds.filter((id) => id !== row._id),
                          );
                        }}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        aria-label={`Select attendance row ${index + 1}`}
                      />
                    </td>

                    <td className="py-3 px-2">{(page - 1) * 10 + index + 1}</td>

                    <td className="py-3 px-2 font-medium">{row.userName}</td>

                    <td className="py-3 px-2 font-medium">{row.userEmail}</td>

                    <td className="py-3 px-2 capitalize">{row.userType}</td>

                    <td className="py-3 px-2">
                      {row.checkIn ? moment(row.checkIn).format("lll") : "-"}
                    </td>

                    <td className="py-3 px-2">
                      {row.checkOut ? moment(row.checkOut).format("lll") : "-"}
                    </td>

                    <td className="py-3 px-2">{row.status || "Unknown"}</td>

                    <td className="py-3 px-2">
                      <button
                        type="button"
                        onClick={() => setQuickEditRow(row)}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                      >
                        <Pencil size={14} />
                        {row.attendanceId ? "Update" : "Mark Attendance"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-4">
          <TablePagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}

      {open && <AttendanceForm onClose={() => setOpen(false)} />}

      {quickEditRow && (
        <QuickEditAttendanceModal
          key={quickEditRow._id}
          row={quickEditRow}
          onClose={() => setQuickEditRow(null)}
        />
      )}
    </div>
  );
}

function QuickEditAttendanceModal({
  row,
  onClose,
}: {
  row: AttendanceRow;
  onClose: () => void;
}) {
  const [checkIn, setCheckIn] = useState(formatLocalDatetime(row.checkIn));
  const [checkOut, setCheckOut] = useState(formatLocalDatetime(row.checkOut));
  const toast = useToast.getState();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const payload = {
        business_id: row.business_id,
        clientName: row.userName,
        clientEmail: row.userEmail,
        userType: row.userType,
        checkIn: checkIn || undefined,
        checkOut: checkOut || undefined,
        status: row.status || "Present",
      };

      if (row.attendanceId) {
        return attendanceApi.updateAttendanceApi(row.attendanceId, {
          _id: row.attendanceId,
          checkIn: checkIn || undefined,
          checkOut: checkOut || undefined,
        });
      }

      return attendanceApi.createAttendance(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
      toast.show({
        message: row.attendanceId
          ? "Attendance updated successfully"
          : "Attendance created successfully",
        type: "success",
      });
      onClose();
    },
    onError: (error: unknown) => {
      toast.show({
        message:
          (error as { message?: string })?.message ||
          "Failed to update attendance",
        type: "error",
      });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
              Quick Update
            </p>
            <h3 className="text-lg font-semibold text-gray-900">
              {row.attendanceId
                ? "Update Attendance Time"
                : "Create Attendance"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {row.userName} · {row.userEmail}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white p-2 text-gray-500 transition hover:bg-gray-50"
            aria-label="Close quick update dialog"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <div>
            <label className="block text-sm font-medium">
              Status <span className="text-red-500">*</span>
            </label>

            <select
              value={checkIn ? "Present" : "Absent"}
              onChange={(event) => setCheckIn(event.target.value)}
              className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
              <option value="Late">Late</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Check In
            </label>
            <input
              type="datetime-local"
              value={checkIn}
              onChange={(event) => setCheckIn(event.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none ring-0 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Check Out
            </label>
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
              disabled={isPending}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatLocalDatetime(value?: string | Date) {
  if (!value) return "";

  return moment(value).format("YYYY-MM-DDTHH:mm");
}
