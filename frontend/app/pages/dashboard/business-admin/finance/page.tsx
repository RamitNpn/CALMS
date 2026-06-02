"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  Settings,
  ActivitySquare,
  FileText,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import Card from "@/components/ui/card";
import TabNavigation from "@/components/shared/TabNavigation";
import LogDetails from "@/components/shared/LogDetails";
import CustomizeSection from "@/components/shared/CustomizeSection";

import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// assumed hooks & types
import { useBusinessAnalytics } from "@/hooks/business-admin/analysis/useBusinessAnalytics";
import { useAllFinance } from "@/hooks/business-admin/business-management/getAllFinance";
import { TFinance } from "@/libs/types/finance.types";
import FinanceRecord from "@/components/business-admin/finance/FinanceRecord";


export default function FinancePage() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("records");

  const {
    data: financeData,
    isLoading,
    isError,
  } = useAllFinance({ page, limit: 10 });

  const records: TFinance[] =
    financeData?.data ?? financeData ?? [];

  const pagination = financeData?.pagination;

  const { summary } = useBusinessAnalytics();

  const incomeRecords = useMemo(
    () => records.filter((r) => r.type === "income"),
    [records],
  );

  const expenseRecords = useMemo(
    () => records.filter((r) => r.type === "expense"),
    [records],
  );

  const totalIncome =
    summary?.finance?.totalIncome ??
    incomeRecords.reduce((acc, r) => acc + r.amount, 0);

  const totalExpense =
    summary?.finance?.totalExpense ??
    expenseRecords.reduce((acc, r) => acc + r.amount, 0);

  const netProfit = totalIncome - totalExpense;

  // Monthly Growth
  const monthlyGrowth = useMemo(() => {
    const map: Record<string, { income: number; expense: number }> = {};

    records.forEach((r) => {
      const d = new Date(r.transactionDate);
      if (isNaN(d.getTime())) return;

      const key = `${d.getFullYear()}-${String(
        d.getMonth() + 1,
      ).padStart(2, "0")}`;

      if (!map[key]) {
        map[key] = { income: 0, expense: 0 };
      }

      if (r.type === "income") map[key].income += r.amount;
      else map[key].expense += r.amount;
    });

    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => {
        const [year, month] = key.split("-").map(Number);

        return {
          label: new Date(year, month - 1, 1).toLocaleDateString(
            "en-US",
            { month: "short", year: "2-digit" },
          ),
          income: value.income,
          expense: value.expense,
        };
      });
  }, [records]);

  // Category Breakdown
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};

    records.forEach((r) => {
      const key = r.category || "Uncategorized";
      map[key] = (map[key] || 0) + r.amount;
    });

    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }));
  }, [records]);

  const tabs = [
    { id: "records", label: "Records", icon: <FileText size={16} /> },
    { id: "analysis", label: "Analysis", icon: <BarChart3 size={16} /> },
    { id: "customize", label: "Customize", icon: <Settings size={16} /> },
    { id: "logs", label: "Log Details", icon: <ActivitySquare size={16} /> },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Financial Records
        </h2>
        <p className="text-sm text-gray-500">
          Manage income, expenses and financial analytics
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <p className="text-sm text-muted-foreground">Total Income</p>
          <p className="text-3xl font-bold mt-2 text-green-600">
            Rs. {totalIncome.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            <TrendingUp size={14} className="inline mr-1" />
            Earnings inflow
          </p>
        </Card>

        <Card>
          <p className="text-sm text-muted-foreground">Total Expense</p>
          <p className="text-3xl font-bold mt-2 text-red-500">
            Rs. {totalExpense.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            <TrendingDown size={14} className="inline mr-1" />
            Outflow
          </p>
        </Card>

        <Card>
          <p className="text-sm text-muted-foreground">Net Profit</p>
          <p className="text-3xl font-bold mt-2 text-blue-600">
            Rs. {netProfit.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Balance after expenses
          </p>
        </Card>

        <Card>
          <p className="text-sm text-muted-foreground">Transactions</p>
          <p className="text-3xl font-bold mt-2">
            {records.length.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            All financial records
          </p>
        </Card>
      </div>

      {/* TAB NAVIGATION */}
      <TabNavigation
        activeTab={activeTab}
        tabs={tabs}
        onTabChange={setActiveTab}
      />

      {/* TAB CONTENT */}
      {activeTab === "records" && (
        <FinanceRecord
          records={records}
          isLoading={isLoading}
          error={isError ? "Failed to load financial records" : null}
          page={page}
          totalPages={pagination?.totalPages || 1}
          onPageChange={setPage}
        />
      )}

      {activeTab === "analysis" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income vs Expense */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">
              Income vs Expense
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="income" fill="#22c55e" />
                <Bar dataKey="expense" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">
              Category Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={categoryBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1">
                  {categoryBreakdown.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        index % 2 === 0 ? "#6366f1" : "#a855f7"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Monthly Trend */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">
              Monthly Trend
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#22c55e"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Summary */}
          <Card>
            <h3 className="text-lg font-semibold mb-4">
              Financial Summary
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Total income records: {incomeRecords.length}</p>
              <p>Total expense records: {expenseRecords.length}</p>
              <p>Net profit: Rs. {netProfit.toLocaleString()}</p>
              <p>
                Average income per entry: Rs.{" "}
                {incomeRecords.length
                  ? Math.round(totalIncome / incomeRecords.length)
                  : 0}
              </p>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "customize" && (
        <CustomizeSection
          module="Finance"
          onSave={(options) => {
            console.log("Finance customization saved:", options);
          }}
        />
      )}

      {activeTab === "logs" && (
        <LogDetails
          userId={records?.[0]?.business_id ?? ""}
          module="Financial"
          onClearLogs={() => {
            console.log("Clearing finance logs");
          }}
        />
      )}
    </div>
  );
}