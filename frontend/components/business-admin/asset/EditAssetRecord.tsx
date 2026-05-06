"use client";

import { Trash2, Eye, Pencil } from "lucide-react";
import moment from "moment";
import TablePagination from "@/components/shared/Pagination";
import { useState } from "react";
import { useDeleteBusiness } from "@/hooks/super-admin/business-records/removeBusiness";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { TAsset } from "@/libs/types/asset.type";

interface AssetTableProps {
  assets: TAsset[];
  isLoading?: boolean;
  error?: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function BusinessTable({
  assets,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
}: AssetTableProps) {
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  const { mutate: deleteBusiness } = useDeleteBusiness();
  const [itemToRemove, setItemToRemove] = useState<TAsset | null>(null);

  const confirmRemove = () => {
    if (!itemToRemove) return;

    deleteBusiness(itemToRemove._id, {
      onSuccess: () => {
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
    <div className="w-full">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-800 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">SN</th>
            <th className="py-3 px-6 text-left">Business Name</th>
            <th className="py-3 px-6 text-left">Operator Name</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">Created At</th>
            <th className="py-3 px-6 text-left">Action</th>
          </tr>
        </thead>

        <tbody className="text-gray-700 text-sm">
          {assets.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-6 px-6 text-center text-gray-500">
                No businesses found
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

                <td className="py-3 px-6 text-left">
                  {asset.status}
                </td>

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

      {assets.length >= 10 && (
        <div className="mt-4">
          <TablePagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}

      {/* {editId && (
        <EditBusinessForm businessId={editId} onClose={() => setEditId(null)} />
      )}

      {viewId && (
        <ViewBusinessRecord
          businessId={viewId}
          onClose={() => setViewId(null)}
        />
      )} */}
      <ConfirmDialog
        open={itemToRemove !== null}
        title="Remove Business"
        message="Are you sure you want to remove this business?"
        onConfirm={confirmRemove}
        onCancel={() => setItemToRemove(null)}
      />
    </div>
  );
}
