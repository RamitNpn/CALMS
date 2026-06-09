"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Briefcase,
  TrendingUp,
} from "lucide-react";
import TabNavigation from "@/components/shared/TabNavigation";
import { useAllPayments } from "@/hooks/super-admin/payment-records/getAllPayment";
import PaymentTable from "@/components/super-admin/payment/PaymentRecords";
import CustomizeSection, {
  defaultCustomizeOptions,
} from "@/components/shared/CustomizeSection";
import LogDetails from "@/components/shared/LogDetails";
import {
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
import { useDebounce } from "use-debounce";

const PAYMENT_COLORS = ["#16a34a", "#f59e0b", "#2563eb", "#8b5cf6"];

const formatMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const PAYMENT_TABS = [
  { id: "inventory", label: "Inventory" },
  { id: "analysis", label: "Analysis" },
  { id: "customize", label: "Customize" },
  { id: "logs", label: "Log Records" },
];

export default function AdminPaymentPage() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("inventory");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  const [debouncedSearch] = useDebounce(search, 500);
  const [paymentCustomizeOptions, setPaymentCustomizeOptions] = useState(
    defaultCustomizeOptions.Payments,
  );

  const visiblePaymentColumns = useMemo(
    () =>
      paymentCustomizeOptions
        .filter((option) => option.enabled)
        .map((option) => option.id),
    [paymentCustomizeOptions],
  );

  const {
    data: paymentData,
    isLoading,
    isError,
  } = useAllPayments({ page, limit: 10, search: debouncedSearch, dateFilter });

  const payments = useMemo<TPayment[]>(
    () => paymentData?.data ?? paymentData ?? [],
    [paymentData],
  );
  const pagination = paymentData?.pagination;

  const paymentStats = {
    totalPaid: payments.reduce((sum, payment) => sum + payment.paidAmount, 0),
    totalDue: payments.reduce((sum, payment) => sum + payment.dueAmount, 0),
    activeCount: payments.filter((payment) => payment.isActive).length,
    pendingCount: payments.filter(
      (payment) => payment.paymentStatus === "pending",
    ).length,
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

  const packageData = useMemo(() => {
    const byPackage = payments.reduce<Record<string, number>>(
      (acc, payment) => {
        acc[payment.package] = (acc[payment.package] ?? 0) + 1;
        return acc;
      },
      {},
    );

    return ["starter", "growth", "enterprise"].map((packageName) => ({
      name: packageName.charAt(0).toUpperCase() + packageName.slice(1),
      value: byPackage[packageName] ?? 0,
    }));
  }, [payments]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Payments Management
          </h2>
          <p className="text-sm text-gray-500">
            Track billing, view analysis, and manage blocks for overdue
            payments.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-md border border-gray-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Paid</p>
            <Briefcase className="h-5 w-5 text-indigo-600" />
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900">
            Rs.{paymentStats.totalPaid.toLocaleString()}
          </p>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Total Due</p>
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900">
            Rs.{paymentStats.totalDue.toLocaleString()}
          </p>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Active Payments</p>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900">
            {paymentStats.activeCount.toLocaleString()}
          </p>
        </div>
        <div className="rounded-md border border-gray-200 bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Pending Records</p>
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <p className="mt-4 text-2xl font-semibold text-gray-900">
            {paymentStats.pendingCount.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6">
        <TabNavigation
          tabs={PAYMENT_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === "analysis" && (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="rounded-3xl border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Trend
                </h3>
                <ResponsiveContainer width="100%" height={260}>
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

              <div className="rounded-3xl border border-gray-200 bg-white p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Package Mix
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={packageData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
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
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Live Insight
              </h3>
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-gray-500">Active Records</p>
                  <p className="mt-3 text-2xl font-semibold text-gray-900">
                    {paymentStats.activeCount}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-gray-500">Total Due</p>
                  <p className="mt-3 text-2xl font-semibold text-gray-900">
                    ${paymentStats.totalDue.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-gray-500">Pending Items</p>
                  <p className="mt-3 text-2xl font-semibold text-gray-900">
                    {paymentStats.pendingCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="space-y-6 py-4">
            <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-5 text-sm text-gray-600">
              Payments inventory shows all recorded payment history with support
              for export, pagination, and status filtering.
            </div>
            <PaymentTable
              payments={payments}
              isLoading={isLoading}
              error={isError ? "Failed to load payment records" : null}
              page={page}
              totalPages={pagination?.totalPages || 1}
              onPageChange={setPage}
              search={search}
              setSearch={setSearch}
              dateFilter={dateFilter}
              setInquiryType={setDateFilter}
              visibleColumns={visiblePaymentColumns}
            />
          </div>
        )}

        {activeTab === "logs" && (
          <div className="space-y-6 py-4">
            <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-5 text-sm text-gray-600">
              Review payment activity and user interactions for the payments
              module.
            </div>
            <LogDetails
              module="Payments"
              userId=""
              onClearLogs={() => {
                console.log("Clearing payment logs");
              }}
            />
          </div>
        )}

        {activeTab === "customize" && (
          <div className="space-y-6 py-4">
            <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-5 text-sm text-gray-600">
              Configure the payment module experience and preferred display
              settings.
            </div>
            <CustomizeSection
              module="Payments"
              initialOptions={paymentCustomizeOptions}
              onSave={(options) => {
                setPaymentCustomizeOptions(options);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
