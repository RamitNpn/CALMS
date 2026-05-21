"use client";

import { Trash2, Eye, Pencil, Plus } from "lucide-react";
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

interface AssetTableProps {
  assets: TAsset[];
  isLoading?: boolean;
  error?: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function AssetRecord({
  assets,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
}: AssetTableProps) {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  const { mutate: deleteAsset } = useDeleteAsset();
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

  if (isLoading) {
    return <p className="p-4">Loading...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  return (
    <div className="w-full h-[76vh] overflow-y-scroll ">
      <div className="flex justify-end mb-2">
        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white text-[12px] px-4 py-2 hover:bg-indigo-700 transition cursor-pointer"
        >
          <Plus size={18} />
          Create Business Assets
        </Button>
      </div>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-800 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">SN</th>
            <th className="py-3 px-6 text-left">Asset Name</th>
            <th className="py-3 px-6 text-left">Asset Type</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Created At</th>
            <th className="py-3 px-6 text-left">Action</th>
          </tr>
        </thead>

        <tbody className="text-gray-700 text-sm">
          {assets.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-6 px-6 text-center text-gray-500">
                No Assets found
              </td>
            </tr>
          ) : (
            assets.map((asset, index) => (
              <tr
                key={asset._id}
                className="border-b border-gray-200 hover:bg-gray-100 transition"
              >
                <td className="py-3 px-6 text-left">
                  {(page - 1) * 10 + index + 1}
                </td>

                <td className="py-3 px-6 text-left font-medium">
                  {asset.name}
                </td>

                <td className="py-3 px-6 text-left">{asset.type}</td>

                <td className="py-3 px-6 text-left">{asset.status}</td>

                <td className="py-3 px-6 text-left">
                  {moment(asset.createdAt).format("lll")}
                </td>

                <td className="py-3 px-6 text-left">
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
