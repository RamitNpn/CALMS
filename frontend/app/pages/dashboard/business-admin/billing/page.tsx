"use client";

import { useMemo, useState } from "react";
import BillingRecord from "@/components/business-admin/billing/BillingRecord";
import TabNavigation from "@/components/shared/TabNavigation";
import LogDetails from "@/components/shared/LogDetails";
import CustomizeSection from "@/components/shared/CustomizeSection";
import { useAllBillings } from "@/hooks/business-admin/billing-management/getAllBillings";
import {
  BarChart3,
  Settings,
  ActivitySquare,
  FileText,
} from "lucide-react";
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
import BillingStats from "@/components/business-admin/billing/BillingStats";
import { useBusinessAnalytics } from "@/hooks/business-admin/analysis/useBusinessAnalytics";
import type { TBilling } from "@/libs/types/billing.types";

const BILLING_COLORS = ["#16a34a", "#f59e0b", "#ef4444", "#3b82f6"];

const formatMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [page, setPage] = useState(1);
  const { summary } = useBusinessAnalytics();

  const {
    data: billingData,
    isLoading,
    isError,
  } = useAllBillings({ page, limit: 10 });

  const billings: TBilling[] = billingData?.data ?? billingData ?? [];
  const pagination = billingData?.pagination;

  const billingOverview = summary?.billing;

  const billingStats = {
    totalRevenue: billingOverview?.totalRevenue ?? 0,
    pendingPayments: billingOverview?.totalOutstanding ?? 0,
    overdueCount: billings.filter((billing) => {
      const dueDate = billing.dueDate ? new Date(billing.dueDate) : null;
      const isOverdue = dueDate ? dueDate.getTime() < Date.now() : false;
      return isOverdue && billing.status !== "paid";
    }).length,
    averageInvoiceValue:
      billings.length > 0
        ? billings.reduce((sum, billing) => sum + billing.totalAmount, 0) /
          billings.length
        : 0,
    invoiceCount: billings.length,
  };

  const billingTrend = useMemo(() => {
    const byMonth = billings.reduce<
      Record<string, { month: string; revenue: number; paid: number }>
    >((acc, billing) => {
      const monthKey = formatMonthKey(new Date(billing.createdAt));

      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: new Date(billing.createdAt).toLocaleString("default", {
            month: "short",
            year: "numeric",
          }),
          revenue: 0,
          paid: 0,
        };
      }

      acc[monthKey].revenue += billing.totalAmount;
      acc[monthKey].paid += billing.paidAmount;
      return acc;
    }, {});

    return Object.entries(byMonth)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([, value]) => value);
  }, [billings]);

  const billingStatusData = useMemo(() => {
    const byStatus = billings.reduce<Record<string, number>>((acc, billing) => {
      const status = billing.status ?? "pending";
      acc[status] = (acc[status] ?? 0) + 1;
      return acc;
    }, {});

    return ["paid", "partial", "pending"].map((status) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: byStatus[status] ?? 0,
    }));
  }, [billings]);

  const paymentMethodData = useMemo(() => {
    const byMethod = billings.reduce<Record<string, number>>((acc, billing) => {
      const method = billing.paymentMethod ?? "not specified";
      acc[method] = (acc[method] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(byMethod).map(([name, value]) => ({ name, value }));
  }, [billings]);

  const tabs = [
    { id: "inventory", label: "Inventory", icon: <FileText size={16} /> },
    { id: "analysis", label: "Analysis", icon: <BarChart3 size={16} /> },
    { id: "customize", label: "Customize", icon: <Settings size={16} /> },
    { id: "logs", label: "Log Details", icon: <ActivitySquare size={16} /> },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Billing Records</h2>
          <p className="text-sm text-gray-500">
            Manage all billing records in the system
          </p>
        </div>
      </div>

      <BillingStats {...billingStats} />

      {/* TAB NAVIGATION */}
      <TabNavigation
        activeTab={activeTab}
        tabs={tabs}
        onTabChange={setActiveTab}
      />

      {/* TAB CONTENT */}
      {activeTab === "inventory" && (
        <BillingRecord
          billings={billings}
          isLoading={isLoading}
          error={isError ? "Failed to load billing records" : null}
          page={page}
          totalPages={pagination?.totalPages || 1}
          onPageChange={setPage}
        />
      )}

      {activeTab === "analysis" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Revenue Trend
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={billingTrend}>
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
                    dataKey="revenue"
                    stroke="#2563eb"
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="paid"
                    stroke="#16a34a"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Billing Status Distribution
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={billingStatusData}>
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
                  <Bar dataKey="value" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Method Mix
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={BILLING_COLORS[index % BILLING_COLORS.length]}
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

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Live Snapshot
              </h3>
              <div className="space-y-4 text-sm text-gray-600">
                <p>
                  Revenue is currently ${billingStats.totalRevenue.toLocaleString()}.
                </p>
                <p>
                  Outstanding balance sits at ${billingStats.pendingPayments.toLocaleString()} with {billingStats.overdueCount.toLocaleString()} overdue invoices.
                </p>
                <p>
                  Average invoice value is ${billingStats.averageInvoiceValue.toFixed(0)} across {billingStats.invoiceCount.toLocaleString()} live billing records.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "customize" && (
        <CustomizeSection
          module="Billing"
          onSave={(options) => {
            console.log("Billing customization saved:", options);
          }}
        />
      )}

      {activeTab === "logs" && (
        <LogDetails
          userId={billings[0]?.business_id ?? ""}
          module="Billing"
          onClearLogs={() => {
            console.log("Clearing billing logs");
          }}
        />
      )}
    </div>
  );
}
