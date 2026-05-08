"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/components/ui/button";
import { useAllStaff } from "@/hooks/business-admin/staff-management/getAllStaffDatas";
import StaffRecord from "@/components/business-admin/staff/StaffRecord";
import { StaffForm } from "@/components/business-admin/staff/StaffForm";

export default function StaffPage() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const {
    data: staffData,
    isLoading,
    isError,
  } = useAllStaff({ page, limit: 10 });

  const staffs = staffData?.data ?? staffData ?? [];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Business Staff Records</h2>
          <p className="text-sm text-gray-500">
            Manage all business staffs in the system
          </p>
        </div>

        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition cursor-pointer"
        >
          <Plus size={18} />
          Create Business staffs
        </Button>
      </div>

      {/* TABLE */}
      <StaffRecord
        staffs={staffs}
        isLoading={isLoading}
        error={isError ? "Failed to load staff records" : null}
        page={page}
        totalPages={staffData?.totalPages || 1}
        onPageChange={setPage}
      />

      {/* MODAL */}
      {open && <StaffForm onClose={() => setOpen(false)} />}

    </div>
  );
}
