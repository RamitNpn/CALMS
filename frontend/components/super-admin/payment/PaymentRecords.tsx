"use client";

import { Trash2, Eye, Pencil, RefreshCcw, Plus, Printer } from "lucide-react";
import moment from "moment";
import { useState } from "react";

import TablePagination from "@/components/shared/Pagination";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

import { TPayment } from "@/libs/types/payment.types";
import { useDeletePayment } from "@/hooks/super-admin/payment-records/removePayment";
import { EditPaymentForm } from "./EditPaymentRecord";
import { ViewPaymentRecord } from "./ViewPaymentRecord";
import { RenewPaymentForm } from "./RenewPaymentForm";
import Button from "@/components/ui/button";
import Select from "@/components/ui/select";
import { PaymentForm } from "./PaymentForm";

interface PaymentTableProps {
  payments: TPayment[];
  isLoading?: boolean;
  error?: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  visibleColumns?: string[];
  search: string;
  setSearch: (value: string) => void;

  dateFilter: string;
  setInquiryType: (value: string) => void;
}

export default function PaymentTable({
  payments,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
  search,
  setSearch,

  dateFilter,
  setInquiryType,
  visibleColumns = [
    "show-business-name",
    "show-business-email",
    "show-package",
    "show-paid",
    "show-due",
    "show-status",
    "show-end-date",
  ],
}: PaymentTableProps) {
  const [open, setOpen] = useState(false);
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
  const downloadRecords = () => {
    if (!payments?.length) return;

    const headers = [
      "SN",
      "Payment ID",
      "Business ID",
      "Business Name",
      "Business Email",
      "Package",
      "Started At",
      "End At",
      "Paid Amount",
      "Due Amount",
      "Payment Status",
      "Active Status",
      "Created At",
      "Updated At",
    ];

    const rows = payments.map((payment, index) => [
      index + 1,
      payment._id,
      payment.business_id,
      payment.businessName,
      payment.businessEmail,
      payment.package,
      moment(payment.startedAt).format("YYYY-MM-DD HH:mm:ss"),
      moment(payment.endAt).format("YYYY-MM-DD HH:mm:ss"),
      payment.paidAmount,
      payment.dueAmount,
      payment.paymentStatus,
      payment.isActive ? "Active" : "Inactive",
      moment(payment.createdAt).format("YYYY-MM-DD HH:mm:ss"),
      moment(payment.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `payment-records-${
      new Date().toISOString().split("T")[0]
    }.csv`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) return <p className="p-4">Loading...</p>;

  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="w-full h-[71vh] overflow-y-scroll">
      <div className="flex items-center justify-between mr-2">
        <div className="mb-4 flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name, email or package..."
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
        <div className="flex justify-end gap-2 mb-2">
          <Button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white text-[12px] px-4 py-2 hover:bg-indigo-700 transition cursor-pointer"
          >
            <Plus size={18} />
            Add Business
          </Button>
          <Button
            onClick={downloadRecords}
            className="flex items-center justify-end gap-2 bg-green-500 text-white text-[12px] px-4 py-2 hover:bg-green-600 transition cursor-pointer"
          >
            <Printer size={18} />
            Export
          </Button>
        </div>
      </div>
      <table className="w-full table-auto text-[13px]">
        <thead>
          <tr className="bg-gray-200 text-gray-800">
            <th className="py-2 px-2 text-left">SN</th>
            {visibleColumns.includes("show-business-name") && (
              <th className="py-2 px-2 text-left">Business</th>
            )}
            {visibleColumns.includes("show-business-email") && (
              <th className="py-2 px-2 text-left">Email</th>
            )}
            {visibleColumns.includes("show-package") && (
              <th className="py-2 px-2 text-left">Package</th>
            )}
            {visibleColumns.includes("show-paid") && (
              <th className="py-2 px-2 text-left">Paid</th>
            )}
            {visibleColumns.includes("show-due") && (
              <th className="py-2 px-2 text-left">Due</th>
            )}
            {visibleColumns.includes("show-status") && (
              <th className="py-2 px-2 text-left">Status</th>
            )}
            {visibleColumns.includes("show-end-date") && (
              <th className="py-2 px-2 text-left">End Date</th>
            )}
            <th className="py-2 px-2 text-left">Action</th>
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
                <td className="py-2 px-6">{(page - 1) * 10 + index + 1}</td>

                {visibleColumns.includes("show-business-name") && (
                  <td className="py-2 px-6">
                    <div className="font-medium">{payment.businessName}</div>
                  </td>
                )}

                {visibleColumns.includes("show-business-email") && (
                  <td className="py-2 px-6 text-xs text-gray-500">
                    {payment.businessEmail}
                  </td>
                )}

                {visibleColumns.includes("show-package") && (
                  <td className="py-2 px-6 capitalize">{payment.package}</td>
                )}

                {visibleColumns.includes("show-paid") && (
                  <td className="py-2 px-6">{payment.paidAmount}</td>
                )}

                {visibleColumns.includes("show-due") && (
                  <td className="py-2 px-6">{payment.dueAmount}</td>
                )}

                {visibleColumns.includes("show-status") && (
                  <td className="py-2 px-6">
                    <span
                      className={`px-2 py-1 rounded text-xs capitalize font-medium ${
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
                )}

                {visibleColumns.includes("show-end-date") && (
                  <td className="py-2 px-2">
                    {moment(payment.endAt).format("lll")}
                  </td>
                )}

                {/* ACTIONS */}
                <td className="py-2 px-6">
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

      {open && <PaymentForm onClose={() => setOpen(false)} />}

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
