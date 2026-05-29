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
  const companyEmail = "info@calmsdriving.com";

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Payment-Invoice-${payment?.businessName || "payment"}`,
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

  const invoiceNumber = `PAY-${String(payment._id).slice(-6).toUpperCase()}`;
  const totalAmount = Number(payment.paidAmount || 0) + Number(payment.dueAmount || 0);
  const paidAmount = Number(payment.paidAmount || 0);
  // const dueAmount = Number(payment.dueAmount || 0);
  const statusLabel = payment.paymentStatus
    ? payment.paymentStatus.charAt(0).toUpperCase() + payment.paymentStatus.slice(1)
    : "Pending";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 print:bg-white">
      <div
        className={clsx(
          "bg-white rounded-lg shadow-lg w-full h-[90vh] overflow-y-auto print:shadow-none print:h-auto print:max-w-full",
          {
            "max-w-md": size === "sm",
            "max-w-lg": size === "md",
            "max-w-5xl": size === "lg",
            "max-w-6xl": size === "xl",
          },
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gray-100 sticky top-0 print:hidden">
          <h2 className="text-lg font-semibold">Payment Invoice - {payment.businessName}</h2>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-black cursor-pointer text-white px-3 py-2 rounded flex items-center gap-2"
            >
              <Printer size={18} />
              Print
            </button>

            <button onClick={onClose}>
              <X className="text-red-500 cursor-pointer" />
            </button>
          </div>
        </div>

        <div
          ref={printRef}
          className="bg-white print:bg-white"
          style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
        >
          <div className="border-b border-gray-200 px-6 py-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex h-20 w-36 items-center justify-center rounded border border-gray-300 bg-white px-3 py-2">
                  <img src="/user.png" alt="Company Logo" className="max-h-full max-w-full object-contain" />
                </div>

                <div className="space-y-1 text-gray-800">
                  <h1 className="text-xl font-bold">{companyName}</h1>
                  <p className="text-[12px] leading-5">{companyAddress}</p>
                  <p className="text-[12px] leading-5">Mobile: {companyPhone}</p>
                  <p className="text-[12px] leading-5">Email: {companyEmail}</p>
                  <p className="text-[12px] leading-5">{companyPan}</p>
                </div>
              </div>

              <div className="lg:text-right">
                <p className="text-2xl font-black tracking-wide text-black">INVOICE</p>
              </div>
            </div>
          </div>

          <div className="px-6 py-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-md font-bold text-gray-900">Bill To</p>
                <div className="mt-2 space-y-1 text-[12px] leading-6 text-gray-700">
                  <p className="font-medium text-gray-900">{payment.businessName}</p>
                  <p>{payment.businessEmail}</p>
                  <p className="capitalize">Package: {payment.package}</p>
                </div>
              </div>

              <div className="w-full max-w-[360px] rounded-md border border-gray-200 bg-white p-4">
                <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-[12px]">
                  <p className="font-bold text-gray-900">Invoice No :</p>
                  <p className="text-right font-bold text-gray-900">{invoiceNumber}</p>
                  <p className="text-gray-700">Invoice Date :</p>
                  <p className="text-right text-gray-700">
                    {moment(payment.createdAt).format("ll")}
                  </p>
                  <p className="text-gray-700">Due Date :</p>
                  <p className="text-right text-gray-700">
                    {moment(payment.endAt).format("ll")}
                  </p>
                  <p className="text-gray-700">Status :</p>
                  <p className="text-right text-gray-700">{statusLabel}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-sm border border-gray-200">
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr className="bg-black text-white">
                    <th className="px-4 py-2 text-left font-bold">Sl.</th>
                    <th className="px-4 py-2 text-left font-bold">Description</th>
                    <th className="px-4 py-2 text-right font-bold">Qty</th>
                    <th className="px-4 py-2 text-right font-bold">Rate</th>
                    <th className="px-4 py-2 text-right font-bold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-200">
                    <td className="px-4 py-2 text-left text-gray-900">1</td>
                    <td className="px-4 py-2 text-left text-gray-900 capitalize">
                      {payment.package} subscription package
                    </td>
                    <td className="px-4 py-2 text-right text-gray-900">1</td>
                    <td className="px-4 py-2 text-right text-gray-900">Rs. {totalAmount.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right text-gray-900">Rs. {totalAmount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_420px]">
              <div>
                <p className="text-md font-bold text-gray-900">Payment Instructions</p>
                <div className="mt-2 space-y-1 text-[12px] leading-6 text-gray-700">
                  <p>Please clear due amount before subscription end date.</p>
                  <p>Keep this invoice for audit and record keeping.</p>
                  <p>Account Status: {payment.isActive ? "Active" : "Inactive"}</p>
                  <p>Started At: {payment.startedAt ? moment(payment.startedAt).format("LL") : "-"}</p>
                </div>
              </div>

              <div className="space-y-3 text-[12px] text-gray-900">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2 font-semibold">
                  <span>Subtotal</span>
                  <span>Rs. {totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-2 font-semibold">
                  <span>Total</span>
                  <span>Rs. {totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span>Paid ({moment(payment.createdAt).format("ll")})</span>
                  <span>Rs. {paidAmount.toLocaleString()}</span>
                </div>
                {/* <div className="flex items-stretch overflow-hidden rounded-full border border-black">
                  <div className="flex min-w-0 flex-1 items-center justify-center bg-black px-4 py-3 text-lg font-bold text-white">
                    Balance Due
                  </div>
                  <div className="flex w-[180px] items-center justify-center bg-white px-4 py-3 text-lg font-bold text-black">
                    Rs. {dueAmount.toLocaleString()}
                  </div>
                </div> */}
              </div>
            </div>

            <div className="mt-1 flex flex-col items-end gap-3">
              <div className="h-20 w-54 border-b border-gray-500/40" />
              <p className="text-[12px] font-semibold text-gray-900">Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}