"use client";

import { Trash2, Eye, Pencil, Plus, Printer } from "lucide-react";
import moment from "moment";
import { useState } from "react";

import TablePagination from "@/components/shared/Pagination";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import Button from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { TFinance } from "@/libs/types/finance.types";
import { useDeleteFinance } from "@/hooks/business-admin/business-management/removeFinance";
import { ViewFinanceRecord } from "./ViewFinanceRecord";
import { EditFinanceForm } from "./EditFinanceForm";
import { FinanceForm } from "./FinanceForm";
import Select from "@/components/ui/select";
import { useAllFinance } from "@/hooks/business-admin/business-management/getAllFinance";

interface FinancialTableProps {
  records: TFinance[];
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

export default function FinanceRecord({
  records,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,

  search,
  setSearch,

  dateFilter,
  setInquiryType,
}: FinancialTableProps) {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  const [itemToRemove, setItemToRemove] = useState<TFinance | null>(null);

  const { mutate: deleteRecord } = useDeleteFinance();
  const { data: financeData } = useAllFinance({});

  const toast = useToast.getState();

  const confirmRemove = () => {
    if (!itemToRemove) return;

    deleteRecord(itemToRemove._id, {
      onSuccess: () => {
        toast.show({
          message: "Financial record deleted successfully",
          type: "success",
        });

        setItemToRemove(null);
      },
    });
  };

  const downloadRecords = () => {
    if (!financeData?.data?.length) return;

    const headers = [
      "SN",
      "Record ID",
      "Business ID",
      "Title",
      "Type",
      "Category",
      "Amount",
      "Payment Method",
      "Description",
      "Status",
      "Transaction Date",
      "Created At",
      "Updated At",
    ];

    const rows = financeData?.data.map((record, index) => [
      index + 1,
      record._id,
      record.business_id,
      record.title,
      record.type,
      record.category,
      record.amount,
      record.paymentMethod || "",
      record.description || "",
      record.status || "",
      moment(record.transactionDate).format("YYYY-MM-DD HH:mm:ss"),
      moment(record.createdAt).format("YYYY-MM-DD HH:mm:ss"),
      moment(record.updatedAt).format("YYYY-MM-DD HH:mm:ss"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row: (string | number)[]) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `revenue-records-${
      new Date().toISOString().split("T")[0]
    }.csv`;

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
    <div className="w-full h-[76vh] overflow-y-scroll">
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
        <div className="flex justify-end gap-2 mb-2">
          <Button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white text-[12px] px-4 py-2 hover:bg-indigo-700 transition cursor-pointer"
          >
            <Plus size={18} />
            Add Financial Record
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

      {/* TABLE */}
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-800 text-sm leading-normal">
            <th className="py-3 px-2 text-left">SN</th>
            <th className="py-3 px-2 text-left">Title</th>
            <th className="py-3 px-2 text-left">Type</th>
            <th className="py-3 px-2 text-left">Category</th>
            <th className="py-3 px-2 text-left">Amount</th>
            <th className="py-3 px-2 text-left">Payment</th>
            <th className="py-3 px-2 text-left">Date</th>
            <th className="py-3 px-2 text-left">Action</th>
          </tr>
        </thead>

        <tbody className="text-gray-700 text-sm text-[13px]">
          {records.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-6 px-6 text-center text-gray-500">
                No Financial Records found
              </td>
            </tr>
          ) : (
            records.map((record, index) => (
              <tr
                key={record._id}
                className="border-b border-gray-200 hover:bg-white transition rounded hover:translate-x-1"
              >
                {/* SN */}
                <td className="py-3 px-2 text-left">
                  {(page - 1) * 10 + index + 1}
                </td>

                {/* TITLE */}
                <td className="py-3 px-2 text-left font-medium">
                  {record.title}
                </td>

                {/* TYPE */}
                <td className="py-3 px-2 text-left">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      record.type === "income"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {record.type}
                  </span>
                </td>

                {/* CATEGORY */}
                <td className="py-3 px-2 text-left">{record.category}</td>

                {/* AMOUNT */}
                <td className="py-3 px-2 text-left font-semibold">
                  Rs. {record.amount.toLocaleString()}
                </td>

                {/* PAYMENT */}
                <td className="py-3 px-2 text-left">
                  {record.paymentMethod || "cash"}
                </td>

                {/* DATE */}
                <td className="py-3 px-2 text-left">
                  {moment(record.transactionDate).format("lll")}
                </td>

                {/* ACTION */}
                <td className="py-3 px-2 text-left">
                  <div className="flex items-center gap-2">
                    {/* VIEW */}
                    <button
                      onClick={() => setViewId(record._id)}
                      className="p-2 border border-gray-200 rounded hover:bg-gray-200 transition cursor-pointer"
                    >
                      <Eye size={16} className="text-yellow-600" />
                    </button>

                    {/* EDIT */}
                    <button
                      onClick={() => setEditId(record._id)}
                      className="p-2 border border-gray-200 rounded hover:bg-gray-200 transition cursor-pointer"
                    >
                      <Pencil size={16} className="text-green-600" />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => setItemToRemove(record)}
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
        <ViewFinanceRecord
          financeId={viewId}
          open={!!viewId}
          onClose={() => setViewId(null)}
        />
      )}

      {/* EDIT MODAL */}
      {editId && (
        <EditFinanceForm financeId={editId} onClose={() => setEditId(null)} />
      )}

      {/* CREATE FORM */}
      {open && <FinanceForm onClose={() => setOpen(false)} />}

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        open={itemToRemove !== null}
        title="Delete Financial Record"
        message="Are you sure you want to delete this financial record?"
        onConfirm={confirmRemove}
        onCancel={() => setItemToRemove(null)}
      />
    </div>
  );
}
