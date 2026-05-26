"use client";

import { useState } from "react";
import { BusinessForm } from "@/components/super-admin/business/BusinessForm";
import { useAllTokens } from "@/hooks/super-admin/token-records/getAllTokens";
import TokenRecords from "@/components/business-admin/token/TokenRecords";

export default function TokenPage() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const {
    data: tokenData,
    isError,
  } = useAllTokens({ page, limit: 10 });

  const tokens = tokenData?.data ?? tokenData ?? [];
  const pagination = tokenData?.pagination;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Token Records</h2>
          <p className="text-sm text-gray-500">
            Manage all generated tokens in the system
          </p>
        </div>
      </div>

      {/* TABLE */}
      <TokenRecords
        tokens={tokens}
        error={isError ? "Failed to load token records" : null}
        page={page}
        totalPages={pagination?.totalPages || 1}
        onPageChange={setPage}
      />

      {/* MODAL */}
      {open && <BusinessForm onClose={() => setOpen(false)} />}
    </div>
  );
}
