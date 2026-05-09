"use client";

import clsx from "clsx";
import { X } from "lucide-react";
import moment from "moment";

import { useBillingById } from "@/hooks/business-admin/billing-management/getBillingById";

type ViewBillingModalProps = {
  billingId: string;
  open: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export function ViewBillingRecord({
  billingId,
  open,
  onClose,
  size = "lg",
}: ViewBillingModalProps) {
  const { data, isLoading, isError } = useBillingById(billingId);

  const billing = data?.data ?? data;

  if (!open) return null;

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
          Failed to load billing details
        </div>
      </div>
    );
  }

  if (!billing) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-6 rounded">No billing record found</div>
      </div>
    );
  }

  const remainingAmount =
    Number(billing.totalAmount || 0) -
    Number(billing.paidAmount || 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={clsx(
          "bg-white rounded-lg shadow-lg w-full h-[90vh] overflow-y-auto",
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
            Billing Details -{" "}
            <span className="italic text-red-500 text-sm font-medium">
              {billing.title}
            </span>
          </h2>

          <button onClick={onClose}>
            <X className="text-red-500 cursor-pointer" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6 text-sm">
          {/* CLIENT INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Section label="Client Name" value={billing.clientName} />

            <Section label="Client Email" value={billing.clientEmail} />

            <Section label="Billing Title" value={billing.title} />

            <Section
              label="Payment Method"
              value={billing.paymentMethod}
            />

            <Section label="Status" value={billing.status} />

            <Section
              label="Due Date"
              value={
                billing.dueDate
                  ? moment(billing.dueDate).format("ll")
                  : "-"
              }
            />
          </div>

          {/* AMOUNTS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AmountCard
              title="Total Amount"
              value={`Rs. ${billing.totalAmount ?? 0}`}
            />

            <AmountCard
              title="Paid Amount"
              value={`Rs. ${billing.paidAmount ?? 0}`}
            />

            <AmountCard
              title="Remaining Amount"
              value={`Rs. ${remainingAmount}`}
            />
          </div>

          {/* ITEMS */}
          <div>
            <h3 className="font-semibold text-lg mb-3">
              Billing Items
            </h3>

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-3">SN</th>
                    <th className="px-4 py-3">Item Name</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {billing.items?.length > 0 ? (
                    billing.items.map(
                      (
                        item: {
                          name: string;
                          price: number;
                          qty: number;
                        },
                        index: number,
                      ) => (
                        <tr
                          key={index}
                          className="border-t border-gray-200"
                        >
                          <td className="px-4 py-3">{index + 1}</td>

                          <td className="px-4 py-3 font-medium">
                            {item.name}
                          </td>

                          <td className="px-4 py-3">
                            Rs. {item.price}
                          </td>

                          <td className="px-4 py-3">{item.qty}</td>

                          <td className="px-4 py-3">
                            Rs. {item.price * item.qty}
                          </td>
                        </tr>
                      ),
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-4 text-gray-500"
                      >
                        No billing items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* RECEIPT */}
          <div>
            <p className="font-medium mb-1">Receipt</p>

            {billing.recipt ? (
              <a
                href={billing.recipt}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Receipt
              </a>
            ) : (
              <p className="text-gray-500">No receipt uploaded</p>
            )}
          </div>

          {/* DATES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Section
              label="Created At"
              value={
                billing.createdAt
                  ? moment(billing.createdAt).format("lll")
                  : "-"
              }
            />

            <Section
              label="Updated At"
              value={
                billing.updatedAt
                  ? moment(billing.updatedAt).format("lll")
                  : "-"
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- HELPER COMPONENTS ---------------- */

function Section({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div>
      <p className="font-medium text-gray-800">{label}</p>

      <p className="text-gray-600 mt-1">
        {value !== undefined && value !== null
          ? String(value)
          : "-"}
      </p>
    </div>
  );
}

function AmountCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <p className="text-sm text-gray-500">{title}</p>

      <h3 className="text-xl font-bold text-gray-800 mt-2">
        {value}
      </h3>
    </div>
  );
}