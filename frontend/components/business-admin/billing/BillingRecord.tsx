"use client";

import { Trash2, Eye, Pencil } from "lucide-react";
import moment from "moment";
import TablePagination from "@/components/shared/Pagination";
import { useState } from "react";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useToast } from "@/components/ui/toast";

import { TBilling } from "@/libs/types/billing.types";
import { useDeleteBilling } from "@/hooks/business-admin/billing-management/removeBilling";

import { ViewBillingRecord } from "./ViewBillingRecord";
import { EditBillingRecord } from "./EditBillingRecord";

interface BillingTableProps {
  billings: TBilling[];
  isLoading?: boolean;
  error?: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function BillingRecord({
  billings,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
}: BillingTableProps) {
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  const { mutate: deleteBilling } = useDeleteBilling();

  const [itemToRemove, setItemToRemove] = useState<TBilling | null>(null);

  const toast = useToast.getState();

  const confirmRemove = () => {
    if (!itemToRemove) return;

    deleteBilling(itemToRemove._id, {
      onSuccess: () => {
        toast.show({
          message: "Billing record deleted successfully",
          type: "success",
        });

        setItemToRemove(null);
      },

      onError: () => {
        toast.show({
          message: "Failed to delete billing record",
          type: "error",
        });
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
    <div className="w-full h-[75vh] overflow-y-scroll">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-800 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">SN</th>
            <th className="py-3 px-6 text-left">Client</th>
            <th className="py-3 px-6 text-left">Title</th>
            <th className="py-3 px-6 text-left">Total Amount</th>
            <th className="py-3 px-6 text-left">Paid Amount</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Due Date</th>
            <th className="py-3 px-6 text-left">Created At</th>
            <th className="py-3 px-6 text-left">Action</th>
          </tr>
        </thead>

        <tbody className="text-gray-700 text-sm">
          {billings.length === 0 ? (
            <tr>
              <td
                colSpan={9}
                className="py-6 px-6 text-center text-gray-500"
              >
                No Billing Records Found
              </td>
            </tr>
          ) : (
            billings.map((billing, index) => (
              <tr
                key={billing._id}
                className="border-b border-gray-200 hover:bg-gray-100 transition"
              >
                <td className="py-3 px-6 text-left">
                  {(page - 1) * 10 + index + 1}
                </td>

                <td className="py-3 px-6 text-left">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {billing.clientName}
                    </span>

                    <span className="text-xs text-gray-500">
                      {billing.clientEmail}
                    </span>
                  </div>
                </td>

                <td className="py-3 px-6 text-left font-medium">
                  {billing.title}
                </td>

                <td className="py-3 px-6 text-left">
                  Rs. {billing.totalAmount}
                </td>

                <td className="py-3 px-6 text-left">
                  Rs. {billing.paidAmount}
                </td>

                <td className="py-3 px-6 text-left">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      billing.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : billing.status === "partial"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {billing.status}
                  </span>
                </td>

                <td className="py-3 px-6 text-left">
                  {moment(billing.dueDate).format("ll")}
                </td>

                <td className="py-3 px-6 text-left">
                  {moment(billing.createdAt).format("lll")}
                </td>

                <td className="py-3 px-6 text-left">
                  <div className="flex items-center gap-2">
                    {/* VIEW */}
                    <button
                      onClick={() => setViewId(billing._id)}
                      className="p-2 border border-gray-200 rounded hover:bg-gray-200 transition cursor-pointer"
                    >
                      <Eye size={16} className="text-yellow-600" />
                    </button>

                    {/* EDIT */}
                    <button
                      onClick={() => setEditId(billing._id)}
                      className="p-2 border border-gray-200 rounded hover:bg-gray-200 transition cursor-pointer"
                    >
                      <Pencil size={16} className="text-green-600" />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => setItemToRemove(billing)}
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

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-4">
          <TablePagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}

      {/* VIEW MODAL */}
      {viewId && (
        <ViewBillingRecord
          billingId={viewId}
          open={!!viewId}
          onClose={() => setViewId(null)}
        />
      )}

      {/* EDIT MODAL */}
      {editId && (
        <EditBillingRecord
          billingId={editId}
          onClose={() => setEditId(null)}
        />
      )}

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        open={itemToRemove !== null}
        title="Remove Billing Record"
        message="Are you sure you want to remove this billing record?"
        onConfirm={confirmRemove}
        onCancel={() => setItemToRemove(null)}
      />
    </div>
  );
}