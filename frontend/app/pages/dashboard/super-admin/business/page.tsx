"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import BusinessTable from "@/components/super-admin/business/BusinessRecords";
import { BusinessForm } from "@/components/super-admin/business/BusinessForm";
import { useAllBusinesses } from "@/hooks/super-admin/business-records/getAllBusinessRecords";
import Button from "@/components/ui/button";

export default function BusinessesPage() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const {
    data: businessData,
    isLoading,
    isError,
  } = useAllBusinesses({ page, limit: 10 });

  const businesses = businessData?.data ?? businessData ?? [];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Business Records</h2>
          <p className="text-sm text-gray-500">
            Manage all registered businesses in the system
          </p>
        </div>

        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition cursor-pointer"
        >
          <Plus size={18} />
          Create Business
        </Button>
      </div>

      {/* TABLE */}
      <BusinessTable
        businesses={businesses}
        isLoading={isLoading}
        error={isError ? "Failed to load businesses records" : null}
        page={page}
        totalPages={businessData?.totalPages || 1}
        onPageChange={setPage}
      />

      {/* MODAL */}
      {open && <BusinessForm onClose={() => setOpen(false)} />}
    </div>
  );
}
