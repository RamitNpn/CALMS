"use client";

import { usePaymentById } from "@/hooks/super-admin/payment-records/getPaymentById";
import clsx from "clsx";
import { Printer, X } from "lucide-react";
import moment from "moment";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";


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
  const companyName = "CALMS Driving Institute";
  const companyPan = "PAN No: 123456789";
  const companyAddress = "Main Road, Kathmandu, Nepal";
  const companyPhone = "+977-9800000000";
  const companyLogo = "/user.png";

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Payment-Receipt-${payment?.businessName || "payment"}`,
  });

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

  const paymentStatusLabel = payment.paymentStatus
    ? payment.paymentStatus.charAt(0).toUpperCase() + payment.paymentStatus.slice(1)
    : "Pending";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 print:static print:bg-white print:p-0">
      <div className="absolute inset-0 print:hidden" onClick={onClose} />

      <div className="relative z-10 w-full max-w-6xl">
        <div className="mb-3 flex items-center justify-between print:hidden">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Payment Receipt Preview
            </h2>
            <p className="text-sm text-slate-200">{payment.businessName}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 cursor-pointer"
            >
              <Printer size={16} />
              Print Receipt
            </button>

            <button
              onClick={onClose}
              className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div
          ref={printRef}
          className={clsx(
            "mx-auto max-h-[88vh] w-full overflow-y-auto rounded-[28px] bg-white shadow-2xl print:max-h-none print:rounded-none print:shadow-none",
            {
              "max-w-md": size === "sm",
              "max-w-lg": size === "md",
              "max-w-4xl": size === "lg",
              "max-w-6xl": size === "xl",
            },
          )}
        >
          <div className="bg-black px-6 py-8 text-white sm:px-10 print:bg-black">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex h-24 w-44 items-center justify-center rounded-sm bg-white px-4 py-3 text-slate-900 shadow-sm">
                  <img
                    src={companyLogo}
                    alt="CALMS Driving Institute logo"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-300">
                  Payment Receipt
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                  {companyName}
                </h1>
                <p className="mt-3 max-w-xl text-sm text-slate-300">
                  {companyAddress}
                </p>
                <div className="mt-4 space-y-1 text-sm text-slate-300">
                  <p>{companyPan}</p>
                  <p>{companyPhone}</p>
                </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/20 bg-black p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
                  Receipt Status
                </p>
                <p className="mt-2 text-2xl font-bold">{paymentStatusLabel}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <Meta value={moment(payment.createdAt).format("ll")} label="Created" />
                  <Meta value={moment(payment.endAt).format("ll")} label="End Date" />
                  <Meta value={payment.package} label="Package" />
                  <Meta value={payment.isActive ? "Active" : "Inactive"} label="Account" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 sm:px-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                      Billed To
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                      {payment.businessName}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {payment.businessEmail}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                      Package
                    </p>
                    <p className="mt-1 font-semibold capitalize text-slate-900">
                      {payment.package}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                      Payment Summary
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Subscription billing overview
                    </p>
                  </div>
                  <div
                    className={clsx(
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      {
                        "bg-slate-100 text-slate-700":
                          payment.paymentStatus === "paid",
                        "bg-slate-200 text-slate-700":
                          payment.paymentStatus === "partial",
                        "bg-slate-300 text-slate-800":
                          payment.paymentStatus === "pending",
                      },
                    )}
                  >
                    {paymentStatusLabel}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <KeyValue
                    label="Paid Amount"
                    value={`Rs. ${Number(payment.paidAmount || 0).toLocaleString()}`}
                  />
                  <KeyValue
                    label="Due Amount"
                    value={`Rs. ${Number(payment.dueAmount || 0).toLocaleString()}`}
                  />
                  <KeyValue
                    label="Started At"
                    value={payment.startedAt ? moment(payment.startedAt).format("LL") : "-"}
                  />
                  <KeyValue
                    label="End At"
                    value={payment.endAt ? moment(payment.endAt).format("LL") : "-"}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl bg-black p-5 text-white shadow-lg">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
                  Amount Overview
                </p>
                <div className="mt-4 space-y-4">
                  <SummaryRow label="Paid" value={`Rs. ${Number(payment.paidAmount || 0).toLocaleString()}`} />
                  <SummaryRow label="Due" value={`Rs. ${Number(payment.dueAmount || 0).toLocaleString()}`} />
                  <SummaryRow label="Status" value={paymentStatusLabel} strong />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1">
                <InfoCard label="Business" value={payment.businessName} />
                <InfoCard label="Email" value={payment.businessEmail} />
                <InfoCard label="Account" value={payment.isActive ? "Active" : "Inactive"} />
                <InfoCard label="Created" value={moment(payment.createdAt).format("LLL")} />
                <InfoCard label="Updated" value={moment(payment.updatedAt).format("LLL")} />
              </div>

              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">Notes</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  This receipt confirms the subscription payment for the driving institute system. Keep it with your financial records.
                </p>
              </div>
            </div>
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
  value?: string;
}) {
  return (
    <div>
      <p className="font-medium">{label}</p>
      <p className="text-gray-600">{value || "-"}</p>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/20 bg-black px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.25em] text-slate-300">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/20 pb-3 last:border-b-0 last:pb-0">
      <span className={`text-sm ${strong ? "font-semibold" : "text-slate-300"}`}>{label}</span>
      <span className={`text-sm ${strong ? "font-bold" : "font-medium"}`}>{value}</span>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}