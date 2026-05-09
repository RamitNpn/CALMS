"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/components/ui/button";
import { useAllPayments } from "@/hooks/super-admin/payment-records/getAllPayment";
import PaymentTable from "@/components/super-admin/payment/PaymentRecords";
import { PaymentForm } from "@/components/super-admin/payment/PaymentForm";

export default function AdminPaymentPage() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const {
    data: paymentData,
    isLoading,
    isError,
  } = useAllPayments({ page, limit: 10 });

  const payments = paymentData?.data ?? paymentData ?? [];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Payment Records</h2>
          <p className="text-sm text-gray-500">
            Manage all registered payments in the system
          </p>
        </div>

        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition cursor-pointer"
        >
          <Plus size={18} />
          Create Payment
        </Button>
      </div>

      {/* TABLE */}
      <PaymentTable
        payments={payments}
        isLoading={isLoading}
        error={isError ? "Failed to load payment records" : null}
        page={page}
        totalPages={paymentData?.totalPages || 1}
        onPageChange={setPage}
      />

      {/* MODAL */}
      {open && <PaymentForm onClose={() => setOpen(false)} />}
    </div>
  );
}
