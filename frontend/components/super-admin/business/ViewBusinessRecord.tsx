"use client";

import clsx from "clsx";
import { X } from "lucide-react";
import { useBusinessById } from "@/hooks/super-admin/business-records/getBusinessRecordById";

type ViewBusinessModalProps = {
  businessId: string;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export function ViewBusinessRecord({
  businessId,
  onClose,
  size = "lg",
}: ViewBusinessModalProps) {
  const { data, isLoading, isError } = useBusinessById(businessId);

  const business = data?.data ?? data;

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
          Failed to load business
        </div>
      </div>
    );
  }

  if (!business) return null;

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
          <h2 className="text-lg font-semibold">Business Details</h2>

          <button onClick={onClose}>
            <X className="text-red-500 cursor-pointer" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-4 text-sm">
          <Section label="Business Name" value={business.businessName} />
          <Section label="Business Type" value={business.businessType} />
          <Section label="Operator Name" value={business.operatorName} />
          <Section label="Operator Email" value={business.operatorEmail} />
          <Section label="Teams" value={business.teams} />

          <div>
            <p className="font-medium">Branch</p>
            <p className="text-gray-600">
              {business.branch?.name} - {business.branch?.location}
            </p>
          </div>

          <Section label="Package" value={business.package} />

          <div>
            <p className="font-medium">Services</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {business.services?.map((s: string) => (
                <span key={s} className="px-2 py-1 bg-gray-100 rounded text-xs">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <Section
            label="Payment Status"
            value={business.payment_status ? "Paid" : "Unpaid"}
          />

          <Section
            label="Payment Date"
            value={
              business.payment_initiation
                ? new Date(business.payment_initiation).toDateString()
                : "-"
            }
          />
        </div>
      </div>
    </div>
  );
}

/* Helper Component */
function Section({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="font-medium">{label}</p>
      <p className="text-gray-600">{value || "-"}</p>
    </div>
  );
}
