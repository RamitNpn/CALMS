"use client";

import React, { useState } from "react";
import moment from "moment";
import { Eye, Trash2, Plus, PrinterIcon, X, Printer } from "lucide-react";

import TokenForm from "./TokenForm";

import { TToken } from "@/libs/types/token.types";
import PrintableToken from "./TokenGenerator";
import TablePagination from "@/components/shared/Pagination";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useToast } from "@/components";
import { useDeleteToken } from "@/hooks/business-admin/token-management/removeTokenData";
import { printToken } from "@/utils/printToken";
import Select from "@/components/ui/select";

interface TokenTableProps {
  tokens: TToken[];
  isLoading?: boolean;
  error?: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  search: string;
  setSearch: (value: string) => void;

  dateFilter: string;
  setDateFilter: (value: string) => void;
}

interface TokenTableProps {
  tokens: TToken[];
  isLoading?: boolean;
  error?: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function TokenRecord({
  tokens,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
  search,
  setSearch,

  dateFilter,
  setDateFilter,
}: TokenTableProps) {
  const [open, setOpen] = useState(false);
  const [viewToken, setViewToken] = useState<any>(null);
  const [itemToRemove, setItemToRemove] = useState<TToken | null>(null);

  // DELETE (inside file like AssetRecord style)
  const { mutate: deleteToken } = useDeleteToken();

  const toast = useToast.getState();

  const confirmRemove = () => {
    if (!itemToRemove) return;

    deleteToken(itemToRemove._id, {
      onSuccess: () => {
        toast.show({
          message: "Token deleted successfully",
          type: "success",
        });

        setItemToRemove(null);
      },
    });
  };

  const downloadRecords = () => {
    if (!tokens?.length) return;

    const headers = [
      "SN",
      "Token ID",
      "Token Number",
      "Name",
      "Phone",
      "Vehicle",
      "Date",
      "Created At",
    ];

    const rows = tokens.map((t, i) => [
      i + 1,
      t._id,
      t.tokenNumber,
      t.fullName,
      t.phone,
      t.vehicleCategory,
      t.participationDate
        ? moment(t.participationDate).format("YYYY-MM-DD")
        : "",
      moment(t.createdAt).format("YYYY-MM-DD HH:mm:ss"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `token-records-${new Date().toISOString().split("T")[0]}.csv`;
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
    <div className="w-full h-[71vh] overflow-y-scroll">
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
              setDateFilter(e.target.value);
              onPageChange(1);
            }}
            options={[
              { label: "All Records", value: "all" },
              { label: "Today", value: "current_day" },
              { label: "This Week", value: "current_week" },
              { label: "This Month", value: "current_month" },
              { label: "This Year", value: "current_year" },
            ]}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white text-[12px] px-4 py-2 hover:bg-indigo-700 transition cursor-pointer"
          >
            <Plus size={16} />
            Generate Token
          </button>

          <button
            onClick={downloadRecords}
            className="flex items-center justify-end gap-2 bg-green-500 text-white text-[12px] px-4 py-2 hover:bg-green-600 transition cursor-pointer"
          >
            <Printer size={14} />
            Export
          </button>
        </div>
      </div>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-800 text-sm leading-normal">
            <th className="py-2 px-2 text-left">SN</th>
            <th className="py-2 px-2 text-left">Token</th>
            <th className="py-2 px-2 text-left">Name</th>
            <th className="py-2 px-2 text-left">Phone</th>
            <th className="py-2 px-2 text-left">Vehicle</th>
            <th className="py-2 px-2 text-left">Date</th>
            <th className="py-2 px-2 text-left">Action</th>
          </tr>
        </thead>

        <tbody className="text-gray-700 text-[13px]">
          {tokens.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-6 px-6 text-center text-gray-500">
                No Tokens found
              </td>
            </tr>
          ) : (
            tokens.map((t, i) => (
              <tr
                key={t._id}
                className="border-b border-gray-200 hover:bg-white transition rounded hover:translate-x-1"
              >
                <td className="py-2 px-2 text-left">{i + 1}</td>
                <td className="py-2 px-2 text-left">{t.tokenNumber}</td>
                <td className="py-2 px-2 text-left">{t.fullName}</td>
                <td className="py-2 px-2 text-left">{t.phone}</td>
                <td className="py-2 px-2 text-left">{t.vehicleCategory}</td>
                <td className="py-2 px-2 text-left">
                  {moment(t.participationDate).format("YYYY-MM-DD")}
                </td>

                <td className="py-2 px-2 text-left flex gap-2">
                  <button
                    onClick={() => setViewToken(t)}
                    className="p-2 border border-gray-200 rounded hover:bg-gray-200 text-yellow-500 transition cursor-pointer"
                  >
                    <Eye size={14} />
                  </button>

                  <button
                    onClick={() => setItemToRemove(t)}
                    className="p-2 border border-gray-200 rounded hover:bg-red-100 text-red-600 transition cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
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

      {/* CREATE MODAL */}
      {open && <TokenForm onClose={() => setOpen(false)} />}

      {/* VIEW + PRINT */}
      {viewToken && (
        <div className="absolute fixed inset-0 bg-black/20 flex flex-col items-center justify-center">
          {/* ACTION BAR (NOT PRINTED) */}
          <div className="relative bottom-1 left-34 flex gap-2 print:hidden">
            <button
              onClick={printToken}
              className="bg-black text-white px-3 py-2 rounded outline-none cursor-pointer flex items-center gap-2"
            >
              <PrinterIcon size={14} />
            </button>

            <button
              onClick={() => setViewToken(null)}
              className="bg-white px-3 py-2 outline-none cursor-pointer rounded"
            >
              <X size={14} className="text-red-500" />
            </button>
          </div>

          {/* PRINT AREA */}
          <PrintableToken token={viewToken} />
        </div>
      )}

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        open={itemToRemove !== null}
        title="Remove Token"
        message="Are you sure you want to remove this token?"
        onConfirm={confirmRemove}
        onCancel={() => setItemToRemove(null)}
      />
    </div>
  );
}
