"use client";

import { Trash2, Eye, Pencil, Plus, Printer } from "lucide-react";
import moment from "moment";
import TablePagination from "@/components/shared/Pagination";
import { useState } from "react";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { TAsset } from "@/libs/types/asset.type";
import { useDeleteAsset } from "@/hooks/business-admin/asset-management/removeAsset";
import { ViewAssetRecord } from "./ViewAssetRecord";
import { useToast } from "@/components/ui/toast";
import { EditAssetRecord } from "./EditAssetRecord";
import Button from "@/components/ui/button";
import { AssetForm } from "./AssetForm";
import Select from "@/components/ui/select";
import Image from "next/image";
import { useAllAssets } from "@/hooks/business-admin/asset-management/getAllAssets";

interface AssetTableProps {
  assets: TAsset[];
  isLoading?: boolean;
  error?: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  search: string;
  setSearch: (value: string) => void;

  dateFilter: string;
  setInquiryType: (value: string) => void;
}

export default function AssetRecord({
  assets,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
  search,
  setSearch,

  dateFilter,
  setInquiryType,
}: AssetTableProps) {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  const { mutate: deleteAsset } = useDeleteAsset();
  const { data: assetData } = useAllAssets({});
  const [itemToRemove, setItemToRemove] = useState<TAsset | null>(null);
  const toast = useToast.getState();

  const confirmRemove = () => {
    if (!itemToRemove) return;

    deleteAsset(itemToRemove._id, {
      onSuccess: () => {
        toast.show({
          message: "Asset deleted successfully",
          type: "success",
        });

        setItemToRemove(null);
      },
    });
  };

  const downloadRecords = () => {
    if (!assetData?.data?.length) return;

    const headers = [
      "SN",
      "Asset ID",
      "Asset Name",
      "Asset Type",
      "Status",
      "Created At",
      "Updated At",
      "Custom Fields",
    ];

    const rows = assetData?.data?.map((asset: TAsset, index: number) => [
      index + 1,
      asset._id,
      asset.name,
      asset.type,
      asset.status,
      moment(asset.createdAt),
      moment(asset.updatedAt),
      JSON.stringify(asset.customFields || {}),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows?.map((row: (string | number)[]) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `asset-records-${new Date().toISOString().split("T")[0]}.csv`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return <p className="p-4">Loading...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  return (
    <div className="w-full h-[76vh] overflow-y-scroll ">
      <div className="flex items-center justify-between mr-2">
        <div className="mb-4 flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              onPageChange(1);
            }}
            className="border border-gray-300 rounded px-3 py-2 w-full md:w-80 outline-none text-[13px] focus:border-blue-600 bg-white shadow"
          />

          <Select
            value={dateFilter}
            onChange={(e) => {
              setInquiryType(e.target.value);
              onPageChange(1);
            }}
            options={[
              {
                label: "All Records",
                value: "all",
              },
              {
                label: "Today",
                value: "current_day",
              },
              {
                label: "This Week",
                value: "current_week",
              },
              {
                label: "This Month",
                value: "current_month",
              },
              {
                label: "This Year",
                value: "current_year",
              },
            ]}
          />
        </div>
        <div className="flex justify-end mb-2 gap-4">
          <Button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white text-[12px] px-4 py-2 hover:bg-indigo-700 transition cursor-pointer"
          >
            <Plus size={18} />
            Create Business Assets
          </Button>
          <Button
            onClick={downloadRecords}
            className="flex items-center gap-2 bg-green-500 text-white text-[12px] px-4 py-2 hover:bg-green-600 transition cursor-pointer"
          >
            <Printer size={18} />
            Export
          </Button>
        </div>
      </div>

      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-800 text-sm leading-normal">
            <th className="py-3 px-2 text-left">SN</th>
            <th className="py-3 px-2 text-left">Image</th>
            <th className="py-3 px-2 text-left">Asset Name</th>
            <th className="py-3 px-2 text-left">Asset Type</th>
            <th className="py-3 px-2 text-left">Price (Rs)</th>
            <th className="py-3 px-2 text-left">Status</th>
            <th className="py-3 px-2 text-left">Created At</th>
            <th className="py-3 px-2 text-left">Action</th>
          </tr>
        </thead>

        <tbody className="text-gray-700 text-sm text-[13px]">
          {assets.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-6 px-6 text-center text-gray-500">
                No Assets found
              </td>
            </tr>
          ) : (
            assets.map((asset, index) => (
              <tr
                key={asset._id}
                className="border-b border-gray-200 hover:bg-white transition rounded hover:translate-x-1"
              >
                <td className="py-3 px-2 text-left">
                  {(page - 1) * 10 + index + 1}
                </td>

                <td className="py-3 px-2 text-left font-medium">
                  <Image src={asset.image || "/placeholder.png"} alt={asset.name} width={40} height={40} className="rounded" />
                </td>

                <td className="py-3 px-2 text-left font-medium">
                  {asset.name}
                </td>

                <td className="py-3 px-2 text-left">{asset.type}</td>

                <td className="py-3 px-2 text-left">{asset.price || "-"}</td>

                <td className="py-3 px-2 text-left">{asset.status}</td>

                <td className="py-3 px-2 text-left">
                  {moment(asset.createdAt).format("lll")}
                </td>

                <td className="py-3 px-2 text-left">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setViewId(asset._id);
                      }}
                      className="p-2 border border-gray-200 rounded hover:bg-gray-200 transition cursor-pointer"
                    >
                      <Eye size={16} className="text-yellow-600" />
                    </button>

                    <button
                      onClick={() => setEditId(asset._id)}
                      className="p-2 border border-gray-200 rounded hover:bg-gray-200 transition cursor-pointer"
                    >
                      <Pencil size={16} className="text-green-600" />
                    </button>

                    <button
                      onClick={() => setItemToRemove(asset)}
                      className="p-2 border border-gray-200 rounded hover:bg-red-100 text-red-600 transition cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="mt-4">
          <TablePagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}

      {viewId && (
        <ViewAssetRecord
          assetId={viewId ?? ""}
          open={!!viewId}
          onClose={() => setViewId(null)}
        />
      )}

      {editId && (
        <EditAssetRecord assetId={editId} onClose={() => setEditId(null)} />
      )}

      {open && <AssetForm onClose={() => setOpen(false)} />}

      <ConfirmDialog
        open={itemToRemove !== null}
        title="Remove Asset"
        message="Are you sure you want to remove this asset?"
        onConfirm={confirmRemove}
        onCancel={() => setItemToRemove(null)}
      />
    </div>
  );
}
