"use client";

import { Trash2, Eye, Pencil, RefreshCcw } from "lucide-react";
import moment from "moment";
import { useState } from "react";

import TablePagination from "@/components/shared/Pagination";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

import { TPayment } from "@/libs/types/payment.types";
import { useDeletePayment } from "@/hooks/super-admin/payment-records/removePayment";
import { EditPaymentForm } from "./EditPaymentRecord";
import { ViewPaymentRecord } from "./ViewPaymentRecord";
import { RenewPaymentForm } from "./RenewPaymentForm";

interface PaymentTableProps {
  payments: TPayment[];
  isLoading?: boolean;
  error?: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PaymentTable({
  payments,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
}: PaymentTableProps) {
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [renewId, setRenewId] = useState<string | null>(null);

  const { mutate: deletePayment } = useDeletePayment();
  const [itemToRemove, setItemToRemove] = useState<TPayment | null>(null);

  const confirmRemove = () => {
    if (!itemToRemove) return;

    deletePayment(itemToRemove._id, {
      onSuccess: () => {
        setItemToRemove(null);
      },
    });
  };

  if (isLoading) return <p className="p-4">Loading...</p>;

  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="w-full">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-800 uppercase text-sm">
            <th className="py-3 px-6 text-left">SN</th>
            <th className="py-3 px-6 text-left">Business</th>
            <th className="py-3 px-6 text-left">Package</th>
            <th className="py-3 px-6 text-left">Paid</th>
            <th className="py-3 px-6 text-left">Due</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">End Date</th>
            <th className="py-3 px-6 text-left">Action</th>
          </tr>
        </thead>

        <tbody className="text-gray-700 text-sm">
          {payments.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-6 text-center text-gray-500">
                No payments found
              </td>
            </tr>
          ) : (
            payments.map((payment, index) => (
              <tr
                key={payment._id}
                className="border-b border-gray-200 hover:bg-gray-100 transition"
              >
                {/* SN */}
                <td className="py-3 px-6">{(page - 1) * 10 + index + 1}</td>

                {/* Business */}
                <td className="py-3 px-6">
                  <div className="font-medium">{payment.businessName}</div>
                  <div className="text-xs text-gray-500">
                    {payment.businessEmail}
                  </div>
                </td>

                {/* Package */}
                <td className="py-3 px-6 capitalize">{payment.package}</td>

                {/* Paid */}
                <td className="py-3 px-6">{payment.paidAmount}</td>

                {/* Due */}
                <td className="py-3 px-6">{payment.dueAmount}</td>

                {/* Status */}
                <td className="py-3 px-6">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      payment.paymentStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : payment.paymentStatus === "partial"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {payment.paymentStatus}
                  </span>
                </td>

                {/* End Date */}
                <td className="py-3 px-6">
                  {moment(payment.endAt).format("lll")}
                </td>

                {/* ACTIONS */}
                <td className="py-3 px-6">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewId(payment._id)}
                      className="p-2 border border-gray-200 rounded hover:bg-gray-200 transition cursor-pointer"
                    >
                      <Eye size={16} className="text-yellow-600" />
                    </button>

                    <button
                      onClick={() => setEditId(payment._id)}
                      className="p-2 border border-gray-200 rounded hover:bg-gray-200 transition cursor-pointer"
                    >
                      <Pencil size={16} className="text-green-600" />
                    </button>

                    <button
                      onClick={() => setRenewId(payment._id)}
                      className="p-2 border border-gray-200 rounded hover:bg-gray-200 transition cursor-pointer"
                    >
                      <RefreshCcw size={16} className="text-purple-600" />
                    </button>

                    <button
                      onClick={() => setItemToRemove(payment)}
                      className="p-2 border border-gray-200 rounded hover:bg-red-100 text-red-600 transition cursor-pointer"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4">
          <TablePagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}

      {/* Modals */}
      {editId && (
        <EditPaymentForm paymentId={editId} onClose={() => setEditId(null)} />
      )}

      {viewId && (
        <ViewPaymentRecord paymentId={viewId} onClose={() => setViewId(null)} />
      )}

      {renewId && (
        <RenewPaymentForm
          paymentId={renewId}
          onClose={() => setRenewId(null)}
        />
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        open={itemToRemove !== null}
        title="Remove Payment"
        message="Are you sure you want to remove this payment record?"
        onConfirm={confirmRemove}
        onCancel={() => setItemToRemove(null)}
      />
    </div>
  );
}
