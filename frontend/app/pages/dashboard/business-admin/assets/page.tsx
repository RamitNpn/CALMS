"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/components/ui/button";
import { useAllAssets } from "@/hooks/business-admin/asset-management/getAllAssets";
import { AssetForm } from "@/components/business-admin/asset/AssetForm";
import AssetRecord from "@/components/business-admin/asset/AssetRecords";

export default function BusinessesPage() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const {
    data: assetData,
    isLoading,
    isError,
  } = useAllAssets({ page, limit: 10 });

  const assets = assetData?.data ?? assetData ?? [];
  const pagination = assetData?.pagination;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Business Asset Records</h2>
          <p className="text-sm text-gray-500">
            Manage all business assets in the system
          </p>
        </div>

        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition cursor-pointer"
        >
          <Plus size={18} />
          Create Business Assets
        </Button>
      </div>

      {/* TABLE */}
      <AssetRecord
        assets={assets}
        isLoading={isLoading}
        error={isError ? "Failed to load asset records" : null}
        page={page}
        totalPages={pagination?.totalPages || 1}
        onPageChange={setPage}
      />

      {/* MODAL */}
      {open && <AssetForm onClose={() => setOpen(false)} />}
    </div>
  );
}
