"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/components/ui/button";
import { useAllPayments } from "@/hooks/super-admin/payment-records/getAllPayment";
import PaymentTable from "@/components/super-admin/payment/PaymentRecords";
import { PaymentForm } from "@/components/super-admin/payment/PaymentForm";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { TPayment } from "@/libs/types/payment.types";

const PAYMENT_COLORS = ["#16a34a", "#f59e0b", "#2563eb", "#8b5cf6"];

const formatMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export default function AdminPaymentPage() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);

  const {
    data: paymentData,
    isLoading,
    isError,
  } = useAllPayments({ page, limit: 10 });

  const payments: TPayment[] = paymentData?.data ?? paymentData ?? [];
  const pagination = paymentData?.pagination;

  const paymentStats = {
    totalPaid: payments.reduce((sum, payment) => sum + payment.paidAmount, 0),
    totalDue: payments.reduce((sum, payment) => sum + payment.dueAmount, 0),
    activeCount: payments.filter((payment) => payment.isActive).length,
    pendingCount: payments.filter((payment) => payment.paymentStatus === "pending")
      .length,
  };

  const paymentTrend = useMemo(() => {
    const byMonth = payments.reduce<
      Record<string, { month: string; paid: number; due: number }>
    >((acc, payment) => {
      const monthKey = formatMonthKey(new Date(payment.createdAt));

      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: new Date(payment.createdAt).toLocaleString("default", {
            month: "short",
            year: "numeric",
          }),
          paid: 0,
          due: 0,
        };
      }

      acc[monthKey].paid += payment.paidAmount;
      acc[monthKey].due += payment.dueAmount;
      return acc;
    }, {});

    return Object.entries(byMonth)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([, value]) => value);
  }, [payments]);

  const paymentStatusData = useMemo(() => {
    const byStatus = payments.reduce<Record<string, number>>((acc, payment) => {
      acc[payment.paymentStatus] = (acc[payment.paymentStatus] ?? 0) + 1;
      return acc;
    }, {});

    return ["paid", "partial", "pending"].map((status) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: byStatus[status] ?? 0,
    }));
  }, [payments]);

  const packageData = useMemo(() => {
    const byPackage = payments.reduce<Record<string, number>>((acc, payment) => {
      acc[payment.package] = (acc[payment.package] ?? 0) + 1;
      return acc;
    }, {});

    return ["starter", "growth", "enterprise"].map((packageName) => ({
      name: packageName.charAt(0).toUpperCase() + packageName.slice(1),
      value: byPackage[packageName] ?? 0,
    }));
  }, [payments]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Payment Records</h2>
          <p className="text-sm text-gray-500">
            Manage all registered payments in the system
          </p>
        </div>

        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition cursor-pointer"
        >
          <Plus size={18} />
          Create Payment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Total Paid</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            ${paymentStats.totalPaid.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Total Due</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            ${paymentStats.totalDue.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Active Payments</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {paymentStats.activeCount.toLocaleString()}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Pending Records</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {paymentStats.pendingCount.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Trend
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={paymentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                }}
              />
              <Line
                type="monotone"
                dataKey="paid"
                stroke="#16a34a"
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="due"
                stroke="#ef4444"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Payment Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={paymentStatusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Package Mix
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={packageData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {packageData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Live Insight
          </h3>
          <div className="space-y-4 text-sm text-gray-600">
            <p>
              {paymentStats.activeCount.toLocaleString()} active payment records are
              currently visible in the system.
            </p>
            <p>
              Paid value is ${paymentStats.totalPaid.toLocaleString()} while due
              balance remains at ${paymentStats.totalDue.toLocaleString()}.
            </p>
            <p>
              The analysis above is driven from the same live payment feed as the
              table below, so the charts update with every new payment record.
            </p>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <PaymentTable
        payments={payments}
        isLoading={isLoading}
        error={isError ? "Failed to load payment records" : null}
        page={page}
        totalPages={pagination?.totalPages || 1}
        onPageChange={setPage}
      />

      {/* MODAL */}
      {open && <PaymentForm onClose={() => setOpen(false)} />}
    </div>
  );
}
