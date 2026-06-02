"use client";

import clsx from "clsx";
import { X } from "lucide-react";

import { useAttendanceById } from "@/hooks/business-admin/attendance-management/getAttendanceById";

type ViewAttendanceModalProps = {
  attendanceId: string;
  open: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export function ViewAttendanceRecord({
  attendanceId,
  open,
  onClose,
  size = "lg",
}: ViewAttendanceModalProps) {
  const { data, isLoading, isError } =
    useAttendanceById(attendanceId);

  const attendance = data?.data ?? data;

  if (!open) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-6 rounded">
          Loading...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-6 rounded text-red-500">
          Failed to load attendance
        </div>
      </div>
    );
  }

  if (!attendance) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-6 rounded">
          No attendance found
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={clsx(
          "bg-white rounded-lg shadow-lg w-full h-auto overflow-y-auto",
          {
            "max-w-md": size === "sm",
            "max-w-lg": size === "md",
            "max-w-3xl": size === "lg",
            "max-w-5xl": size === "xl",
          },
        )}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-100 sticky top-0">
          <h2 className="text-lg font-semibold">
            Attendance Details
          </h2>

          <button onClick={onClose} className="p-1 rounded border border-gray-200 hover:bg-gray-200 transition cursor-pointer">
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-4 text-sm">
          <Section
            label="Client ID"
            value={attendance.clientId}
          />

          <Section
            label="User Type"
            value={attendance.userType}
          />

          <Section
            label="Method"
            value={attendance.method}
          />

          <Section
            label="Check In"
            value={
              attendance.checkIn
                ? new Date(
                    attendance.checkIn,
                  ).toLocaleString()
                : "-"
            }
          />

          <Section
            label="Check Out"
            value={
              attendance.checkOut
                ? new Date(
                    attendance.checkOut,
                  ).toLocaleString()
                : "-"
            }
          />

          <Section
            label="Created At"
            value={
              attendance.createdAt
                ? new Date(
                    attendance.createdAt,
                  ).toDateString()
                : "-"
            }
          />

          <Section
            label="Updated At"
            value={
              attendance.updatedAt
                ? new Date(
                    attendance.updatedAt,
                  ).toDateString()
                : "-"
            }
          />
        </div>
      </div>
    </div>
  );
}

/* Helper Component */
function Section({
  label,
  value,
}: {
  label: string;
  value?: string | number | null | undefined;
}) {
  return (
    <div>
      <p className="font-medium">{label}</p>

      <p className="text-gray-600">
        {value !== undefined && value !== null
          ? String(value)
          : "-"}
      </p>
    </div>
  );
}