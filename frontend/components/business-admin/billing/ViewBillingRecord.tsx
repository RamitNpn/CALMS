"use client";

import { Printer, X } from "lucide-react";
import moment from "moment";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import { useBillingById } from "@/hooks/business-admin/billing-management/getBillingById";

type ViewBillingModalProps = {
  billingId: string;
  open: boolean;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

const SIZE_CLASSES: Record<NonNullable<ViewBillingModalProps["size"]>, string> = {
  sm: "max-w-2xl",
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
};

export function ViewBillingRecord({
  billingId,
  open,
  onClose,
  size = "lg",
}: ViewBillingModalProps) {
  const { data, isLoading, isError } = useBillingById(billingId);

  const billing = data?.data ?? data;

  const companyName = "CALMS Driving Institute";
  const companyPan = "PAN No: 123456789";
  const companyAddress = "Main Road, Kathmandu, Nepal";
  const companyPhone = "+977-9800000000";
  const companyEmail = "info@calmsdriving.com";
  const companyLogo = "/user.png";

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Invoice-${(billing?.clientName || "client").replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-_]/g, "")}-${String(billing?._id).slice(-6).toUpperCase()}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 10mm;
      }
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    `,
  });

  if (!open) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="rounded bg-white p-6">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="rounded bg-white p-6 text-red-500">
          Failed to load billing details
        </div>
      </div>
    );
  }

  if (!billing) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="rounded bg-white p-6">No billing record found</div>
      </div>
    );
  }

  const invoiceNumber = `INV-${String(billing._id).slice(-6).toUpperCase()}`;
  const subtotal = Number(billing.totalAmount || 0);
  const paidAmount = Number(billing.paidAmount || 0);
  const remainingAmount = subtotal - paidAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 print:static print:bg-white print:p-0">
      <div className="absolute inset-0 print:hidden" onClick={onClose} />

      <div className={`relative z-10 w-full ${SIZE_CLASSES[size]}`}>
        <div className="mb-3 flex items-center justify-between print:hidden">
          <div>
            <h2 className="text-lg font-semibold text-white">Invoice Preview</h2>
            <p className="text-sm text-slate-200">{billing.title}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              <Printer size={16} />
              Print Invoice
            </button>
            <button
              onClick={onClose}
              className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="max-h-[88vh] overflow-y-auto rounded-xl bg-white shadow-2xl print:max-h-none print:overflow-visible print:rounded-none print:shadow-none">
          <div
            ref={printRef}
            className="bg-white"
            style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
          >
            <div className="bg-white px-5 py-6 text-slate-900 sm:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex h-24 w-44 items-center justify-center rounded-sm bg-white px-4 py-3 text-slate-900 shadow-sm">
                  <img
                    src={companyLogo}
                    alt="CALMS Driving Institute logo"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="space-y-1 text-slate-900">
                  <h1 className="text-2xl font-bold text-slate-900 sm:text-[28px]">
                    {companyName}
                  </h1>
                  <p className="text-sm leading-5">{companyAddress}</p>
                  <p className="text-sm leading-5">Mobile: {companyPhone}</p>
                  <p className="text-sm leading-5">Email: {companyEmail}</p>
                  <p className="text-sm leading-5">{companyPan}</p>
                </div>
              </div>

              <div className="lg:text-right">
                <p className="text-4xl font-black tracking-wide text-slate-900 sm:text-5xl">
                  INVOICE
                </p>
              </div>
            </div>
            </div>

            <div className="bg-white px-5 py-5 sm:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-lg font-bold text-slate-900">Bill To</p>
                <div className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
                  <p className="font-medium text-slate-900">{billing.clientName}</p>
                  <p>{billing.clientEmail}</p>
                  <p>{billing.title}</p>
                </div>
              </div>

              <div className="w-full max-w-[360px] rounded-md border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                  <p className="font-bold text-slate-900">Invoice No :</p>
                  <p className="text-right font-bold text-slate-900">{invoiceNumber}</p>
                  <p className="text-slate-700">Invoice Date :</p>
                  <p className="text-right text-slate-700">
                    {moment(billing.createdAt).format("ll")}
                  </p>
                  <p className="text-slate-700">Due Date :</p>
                  <p className="text-right text-slate-700">
                    {billing.dueDate ? moment(billing.dueDate).format("ll") : "-"}
                  </p>
                </div>
              </div>
            </div>

              <div className="mt-5 overflow-hidden rounded-sm border border-slate-200">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-white text-slate-900">
                    <th className="px-4 py-2 text-left font-bold">Sl.</th>
                    <th className="px-4 py-2 text-left font-bold">Description</th>
                    <th className="px-4 py-2 text-right font-bold">Qty</th>
                    <th className="px-4 py-2 text-right font-bold">Rate</th>
                    <th className="px-4 py-2 text-right font-bold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {billing.items?.length > 0 ? (
                    billing.items.map((item: { name: string; qty: number; price: number }, index: number) => (
                      <tr key={`${item.name}-${index}`} className="border-t border-slate-200">
                        <td className="px-4 py-2 text-left text-slate-900">{index + 1}</td>
                        <td className="px-4 py-2 text-left text-slate-900">{item.name}</td>
                        <td className="px-4 py-2 text-right text-slate-900">{item.qty}</td>
                        <td className="px-4 py-2 text-right text-slate-900">
                          Rs. {item.price.toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-right text-slate-900">
                          Rs. {(item.price * item.qty).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                        No billing items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_420px]">
              <div>
                <p className="text-lg font-bold text-slate-900">Payment Instructions</p>
                <div className="mt-2 space-y-1 text-sm leading-6 text-slate-700">
                  <p>Pay at front desk or through approved payment channel.</p>
                  <p>Keep this invoice for verification and record keeping.</p>
                  <p>
                    {billing.paymentMethod
                      ? `Preferred method: ${billing.paymentMethod}`
                      : "Payment method: Not specified"}
                  </p>
                </div>
              </div>

                <div className="space-y-3 text-sm text-slate-900">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 font-semibold">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2 font-semibold">
                  <span>Total</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span>Paid ({moment(billing.createdAt).format("ll")})</span>
                  <span>Rs. {paidAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-stretch overflow-hidden rounded-full shadow-sm">
                  <div className="flex min-w-0 flex-1 items-center justify-center bg-white px-4 py-3 text-lg font-bold text-slate-900 border">
                    Balance Due
                  </div>
                  <div className="flex w-[180px] items-center justify-center border-l border-black bg-white px-4 py-3 text-lg font-bold text-slate-900">
                    Rs. {remainingAmount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

              <div className="mt-10 flex flex-col items-end gap-3">
                <div className="h-20 w-64 border-b border-slate-500/40" />
                <p className="text-sm font-semibold text-slate-900">Authorized Signatory</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
