"use client";

import React, { useState } from "react";
import moment from "moment";
import { Eye, Trash2, Plus, PrinterIcon, X } from "lucide-react";

import TokenForm from "./TokenForm";

import { TToken } from "@/libs/types/token.types";
import PrintableToken from "./TokenGenerator";
import TablePagination from "@/components/shared/Pagination";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useToast } from "@/components";
import { useDeleteToken } from "@/hooks/business-admin/token-management/removeTokenData";

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

  if (isLoading) {
    return <p className="p-4">Loading...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  return (
    <div className="w-full h-[71vh] overflow-y-scroll">
      <div className="flex justify-end mb-3">
        <button
          onClick={() => setOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={16} />
          Generate Token
        </button>
      </div>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-800 uppercase text-sm leading-normal">
            <th className="py-2 px-6 text-left">SN</th>
            <th className="py-2 px-6 text-left">Token</th>
            <th className="py-2 px-6 text-left">Name</th>
            <th className="py-2 px-6 text-left">Phone</th>
            <th className="py-2 px-6 text-left">Vehicle</th>
            <th className="py-2 px-6 text-left">Date</th>
            <th className="py-2 px-6 text-left">Action</th>
          </tr>
        </thead>

        <tbody className="text-gray-700 text-sm">
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
                className="border-b border-gray-200 hover:bg-gray-100 transition"
              >
                <td className="py-2 px-6 text-left">{i + 1}</td>
                <td className="py-2 px-6 text-left">{t.tokenNumber}</td>
                <td className="py-2 px-6 text-left">{t.fullName}</td>
                <td className="py-2 px-6 text-left">{t.phone}</td>
                <td className="py-2 px-6 text-left">{t.vehicleCategory}</td>
                <td className="py-2 px-6 text-left">
                  {moment(t.participationDate).format("YYYY-MM-DD")}
                </td>

                <td className="py-2 px-6 text-left flex gap-2">
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
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center">
          {/* ACTION BAR (NOT PRINTED) */}
          <div className="absolute top-18 right-144 flex gap-2 print:hidden">
            <button
              onClick={() => window.print()}
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
