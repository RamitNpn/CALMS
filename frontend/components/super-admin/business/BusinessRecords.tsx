"use client";

import { Trash2, Eye, Pencil } from "lucide-react";
import moment from "moment";
import { TBusiness } from "@/libs/types/business.types";
import TablePagination from "@/components/shared/Pagination";
import { EditBusinessForm } from "./EditBusinessRecord";
import { useState } from "react";
import { ViewBusinessRecord } from "./ViewBusinessRecord";
import { useDeleteBusiness } from "@/hooks/super-admin/business-records/removeBusiness";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

interface BusinessTableProps {
  businesses: TBusiness[];
  isLoading?: boolean;
  error?: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  visibleColumns?: string[];
}

export default function BusinessTable({
  businesses,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
  visibleColumns = [
    "show-business-name",
    "show-operator-name",
    "show-operator-email",
    "show-created-at",
  ],
}: BusinessTableProps) {
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  const { mutate: deleteBusiness } = useDeleteBusiness();
  const [itemToRemove, setItemToRemove] = useState<TBusiness | null>(null);

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
    <div className="w-full h-[71vh] overflow-y-scroll">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-800 uppercase text-sm leading-normal">
            <th className="py-2 px-6 text-left">SN</th>
            {visibleColumns.includes("show-business-name") && (
              <th className="py-2 px-6 text-left">Business Name</th>
            )}
            {visibleColumns.includes("show-operator-name") && (
              <th className="py-2 px-6 text-left">Operator Name</th>
            )}
            {visibleColumns.includes("show-operator-email") && (
              <th className="py-2 px-6 text-left">Email</th>
            )}
            {visibleColumns.includes("show-package") && (
              <th className="py-2 px-6 text-left">Package</th>
            )}
            {visibleColumns.includes("show-payment-status") && (
              <th className="py-2 px-6 text-left">Payment Status</th>
            )}
            {visibleColumns.includes("show-status") && (
              <th className="py-2 px-6 text-left">Status</th>
            )}
            {visibleColumns.includes("show-branch") && (
              <th className="py-2 px-6 text-left">Branch</th>
            )}
            {visibleColumns.includes("show-created-at") && (
              <th className="py-2 px-6 text-left">Created At</th>
            )}
            <th className="py-2 px-6 text-left">Action</th>
          </tr>
        </thead>

        <tbody className="text-gray-700 text-sm">
          {businesses.length === 0 ? (
            <tr>
              <td
                colSpan={
                  2 + visibleColumns.length + 1
                }
                className="py-6 px-6 text-center text-gray-500"
              >
                No businesses found
              </td>
            </tr>
          ) : (
            businesses.map((business, index) => (
              <tr
                key={business._id}
                className="border-b border-gray-200 hover:bg-gray-100 transition"
              >
                <td className="py-2 px-6 text-left">
                  {(page - 1) * 10 + index + 1}
                </td>

                {visibleColumns.includes("show-business-name") && (
                  <td className="py-2 px-6 text-left font-medium">
                    {business.businessName}
                  </td>
                )}

                {visibleColumns.includes("show-operator-name") && (
                  <td className="py-2 px-6 text-left">{business.operatorName}</td>
                )}

                {visibleColumns.includes("show-operator-email") && (
                  <td className="py-2 px-6 text-left">
                    {business.operatorEmail}
                  </td>
                )}

                {visibleColumns.includes("show-package") && (
                  <td className="py-2 px-6 text-left capitalize">
                    {business.package}
                  </td>
                )}

                {visibleColumns.includes("show-payment-status") && (
                  <td className="py-2 px-6 text-left">
                    {business.payment_status ? "Paid" : "Pending"}
                  </td>
                )}

                {visibleColumns.includes("show-status") && (
                  <td className="py-2 px-6 text-left">
                    {business.status ? "Active" : "Inactive"}
                  </td>
                )}

                {visibleColumns.includes("show-branch") && (
                  <td className="py-2 px-6 text-left">
                    {business.branch?.name ?? "-"}
                  </td>
                )}

                {visibleColumns.includes("show-created-at") && (
                  <td className="py-2 px-6 text-left">
                    {moment(business.createdAt).format("lll")}
                  </td>
                )}

                <td className="py-2 px-6 text-left">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setViewId(business._id);
                      }}
                      className="p-2 border border-gray-200 rounded hover:bg-gray-200 transition cursor-pointer"
                    >
                      <Eye size={16} className="text-yellow-600" />
                    </button>

                    <button
                      onClick={() => setEditId(business._id)}
                      className="p-2 border border-gray-200 rounded hover:bg-gray-200 transition cursor-pointer"
                    >
                      <Pencil size={16} className="text-green-600" />
                    </button>

                    <button
                      onClick={() => setItemToRemove(business)}
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

      {editId && (
        <EditBusinessForm businessId={editId} onClose={() => setEditId(null)} />
      )}

      {viewId && (
        <ViewBusinessRecord
          businessId={viewId}
          onClose={() => setViewId(null)}
        />
      )}
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
