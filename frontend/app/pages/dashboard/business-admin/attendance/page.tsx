"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/components/ui/button";
import { useAllAttendances } from "@/hooks/business-admin/attendance-management/getAllAttendances";
import AttendanceRecord from "@/components/business-admin/attendance/AttendanceRecord";
import { AttendanceForm } from "@/components/business-admin/attendance/AttendanceForm";

export default function AttendancePage() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const {
    data: attendanceData,
    isLoading,
    isError,
  } = useAllAttendances({ page, limit: 10 });

  const attendances = attendanceData?.data ?? attendanceData ?? [];
  const pagination = attendanceData?.pagination;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Business Attendance Records</h2>
          <p className="text-sm text-gray-500">
            Manage all business attendance records in the system
          </p>
        </div>

        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition cursor-pointer"
        >
          <Plus size={18} />
          Create Business Attendance
        </Button>
      </div>

      {/* TABLE */}
      <AttendanceRecord
        attendances={attendances}
        isLoading={isLoading}
        error={isError ? "Failed to load attendance records" : null}
        page={page}
        totalPages={pagination?.totalPages || 1}
        onPageChange={setPage}
      />

      {/* MODAL */}
      {open && <AttendanceForm onClose={() => setOpen(false)} />}

    </div>
  );
}
