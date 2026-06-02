"use client";

import { Trash2, Eye, Pencil, Plus } from "lucide-react";
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

interface FinancialTableProps {
  records: TFinance[];
  isLoading?: boolean;
  error?: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function FinanceRecord({
  records,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
}: FinancialTableProps) {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  const [itemToRemove, setItemToRemove] =
    useState<TFinance | null>(null);

  const { mutate: deleteRecord } =
    useDeleteFinance();

  const toast = useToast.getState();

  const confirmRemove = () => {
    if (!itemToRemove) return;

    deleteRecord(itemToRemove._id, {
      onSuccess: () => {
        toast.show({
          message:
            "Financial record deleted successfully",
          type: "success",
        });

        setItemToRemove(null);
      },
    });
  };

  if (isLoading) {
    return (
      <p className="p-4">Loading...</p>
    );
  }

  if (error) {
    return (
      <p className="p-4 text-red-500">
        {error}
      </p>
    );
  }

  return (
    <div className="w-full h-[76vh] overflow-y-scroll">

      {/* HEADER ACTION */}
      <div className="flex justify-end mb-2">
        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white text-[12px] px-4 py-2 hover:bg-indigo-700 transition cursor-pointer"
        >
          <Plus size={18} />
          Add Financial Record
        </Button>
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
              <td
                colSpan={8}
                className="py-6 px-6 text-center text-gray-500"
              >
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
                  {(page - 1) * 10 +
                    index +
                    1}
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
                <td className="py-3 px-2 text-left">
                  {record.category}
                </td>

                {/* AMOUNT */}
                <td className="py-3 px-2 text-left font-semibold">
                  Rs.{" "}
                  {record.amount.toLocaleString()}
                </td>

                {/* PAYMENT */}
                <td className="py-3 px-2 text-left">
                  {record.paymentMethod ||
                    "cash"}
                </td>

                {/* DATE */}
                <td className="py-3 px-2 text-left">
                  {moment(
                    record.transactionDate,
                  ).format("lll")}
                </td>

                {/* ACTION */}
                <td className="py-3 px-2 text-left">
                  <div className="flex items-center gap-2">

                    {/* VIEW */}
                    <button
                      onClick={() =>
                        setViewId(record._id)
                      }
                      className="p-2 border border-gray-200 rounded hover:bg-gray-200 transition cursor-pointer"
                    >
                      <Eye
                        size={16}
                        className="text-yellow-600"
                      />
                    </button>

                    {/* EDIT */}
                    <button
                      onClick={() =>
                        setEditId(record._id)
                      }
                      className="p-2 border border-gray-200 rounded hover:bg-gray-200 transition cursor-pointer"
                    >
                      <Pencil
                        size={16}
                        className="text-green-600"
                      />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() =>
                        setItemToRemove(
                          record,
                        )
                      }
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
        <EditFinanceForm
          financeId={editId}
          onClose={() => setEditId(null)}
        />
      )}

      {/* CREATE FORM */}
      {open && (
        <FinanceForm
          onClose={() => setOpen(false)}
        />
      )}

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        open={itemToRemove !== null}
        title="Delete Financial Record"
        message="Are you sure you want to delete this financial record?"
        onConfirm={confirmRemove}
        onCancel={() =>
          setItemToRemove(null)
        }
      />
    </div>
  );
}