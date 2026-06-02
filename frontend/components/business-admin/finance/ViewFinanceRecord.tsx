"use client";

import { useFinanceById } from "@/hooks/business-admin/business-management/getFinanceById";
import clsx from "clsx";
import { X } from "lucide-react";

type ViewFinanceModalProps = {
  financeId: string;
  open: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export function ViewFinanceRecord({
  financeId,
  open,
  onClose,
  size = "lg",
}: ViewFinanceModalProps) {
  const { data, isLoading, isError } = useFinanceById(financeId);

  const finance = data?.data ?? data;

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-6 rounded">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-6 rounded text-red-500">
          Failed to load financial record
        </div>
      </div>
    );
  }

  if (!finance) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-6 rounded">No record found</div>
      </div>
    );
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={clsx(
          "bg-white rounded-lg shadow-lg w-full h-[95vh] overflow-y-scroll",
          {
            "max-w-md": size === "sm",
            "max-w-lg": size === "md",
            "max-w-3xl": size === "lg",
            "max-w-5xl": size === "xl",
          },
        )}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-100 sticky top-0">
          <h2 className="text-lg font-semibold">
            Financial Record -{" "}
            <span className="italic text-red-500 text-sm font-medium">
              {finance.title}
            </span>
          </h2>

          <button onClick={onClose} className="p-1 rounded border border-gray-200 hover:bg-gray-200 transition cursor-pointer">
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-4 text-sm">
          <Section label="Title" value={finance.title} />
          <Section label="Type" value={finance.type} />
          <Section label="Category" value={finance.category} />
          <Section label="Amount" value={`Rs. ${finance.amount}`} />
          <Section label="Payment Method" value={finance.paymentMethod} />

          <Section
            label="Transaction Date"
            value={
              finance.transactionDate
                ? new Date(finance.transactionDate).toDateString()
                : "-"
            }
          />

          <Section label="Description" value={finance.description} />

          <Section
            label="Created At"
            value={
              finance.createdAt
                ? new Date(finance.createdAt).toDateString()
                : "-"
            }
          />

          <Section
            label="Updated At"
            value={
              finance.updatedAt
                ? new Date(finance.updatedAt).toDateString()
                : "-"
            }
          />

          {/* TYPE BADGE */}
          <div>
            <p className="font-medium">Status Type</p>
            <span
              className={clsx(
                "inline-block mt-1 px-2 py-1 text-xs rounded",
                finance.type === "income"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700",
              )}
            >
              {finance.type}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Helper Component */
function Section({
  label,
  value,
}: {
  label: string;
  value?: string | number | null | undefined;
}) {
  return (
    <div>
      <p className="font-medium">{label}</p>
      <p className="text-gray-600">
        {value !== undefined && value !== null ? String(value) : "-"}
      </p>
    </div>
  );
}