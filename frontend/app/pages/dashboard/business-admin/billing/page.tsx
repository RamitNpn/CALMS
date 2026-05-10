"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/components/ui/button";
import BillingRecord from "@/components/business-admin/billing/BillingRecord";
import { useAllBillings } from "@/hooks/business-admin/billing-management/getAllBillings";
import { BillingForm } from "@/components/business-admin/billing/BillingForm";

export default function BillingPage() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const {
    data: billingData,
    isLoading,
    isError,
  } = useAllBillings({ page, limit: 10 });

  const billings = billingData?.data ?? billingData ?? [];
  const pagination = billingData?.pagination;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Billing Records</h2>
          <p className="text-sm text-gray-500">
            Manage all billing records in the system
          </p>
        </div>

        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition cursor-pointer"
        >
          <Plus size={18} />
          Create Billing Records
        </Button>
      </div>

      {/* TABLE */}
      <BillingRecord
        billings={billings}
        isLoading={isLoading}
        error={isError ? "Failed to load billing records" : null}
        page={page}
        totalPages={pagination?.totalPages || 1}
        onPageChange={setPage}
      />

      {/* MODAL */}
      {open && <BillingForm onClose={() => setOpen(false)} />}

    </div>
  );
}
