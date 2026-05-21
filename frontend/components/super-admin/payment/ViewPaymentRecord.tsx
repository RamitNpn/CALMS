"use client";

import { usePaymentById } from "@/hooks/super-admin/payment-records/getPaymentById";
import clsx from "clsx";
import { X } from "lucide-react";
import moment from "moment";


type ViewPaymentModalProps = {
  paymentId: string;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export function ViewPaymentRecord({
  paymentId,
  onClose,
  size = "lg",
}: ViewPaymentModalProps) {
  const { data, isLoading, isError } = usePaymentById(paymentId);

  const payment = data?.data ?? data;

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
          Failed to load payment
        </div>
      </div>
    );
  }

  if (!payment) return null;

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
          <h2 className="text-lg font-semibold">Payment Details</h2>

          <button onClick={onClose}>
            <X className="text-red-500 cursor-pointer" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-4 text-sm">
          <Section label="Business Name" value={payment.businessName} />
          <Section label="Business Email" value={payment.businessEmail} />

          <Section label="Package" value={payment.package} />

          <Section
            label="Started At"
            value={
              payment.startedAt
                ? moment(payment.startedAt).format("LL")
                : "-"
            }
          />

          <Section
            label="End At"
            value={
              payment.endAt ? moment(payment.endAt).format("LL") : "-"
            }
          />

          <Section
            label="Paid Amount"
            value={`Rs. ${payment.paidAmount}`}
          />

          <Section
            label="Due Amount"
            value={`Rs. ${payment.dueAmount}`}
          />

          {/* PAYMENT STATUS BADGE */}
          <div>
            <p className="font-medium">Payment Status</p>
            <span
              className={clsx(
                "inline-block px-2 py-1 rounded text-xs font-medium mt-1",
                {
                  "bg-green-100 text-green-700":
                    payment.paymentStatus === "paid",
                  "bg-yellow-100 text-yellow-700":
                    payment.paymentStatus === "partial",
                  "bg-red-100 text-red-700":
                    payment.paymentStatus === "pending",
                },
              )}
            >
              {payment.paymentStatus}
            </span>
          </div>

          <Section
            label="Active Status"
            value={payment.isActive ? "Active" : "Inactive"}
          />

          <Section
            label="Created At"
            value={
              payment.createdAt
                ? moment(payment.createdAt).format("LLL")
                : "-"
            }
          />

          <Section
            label="Updated At"
            value={
              payment.updatedAt
                ? moment(payment.updatedAt).format("LLL")
                : "-"
            }
          />
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
  value?: string;
}) {
  return (
    <div>
      <p className="font-medium">{label}</p>
      <p className="text-gray-600">{value || "-"}</p>
    </div>
  );
}