"use client";

import {
  Briefcase,
  Users,
  CreditCard,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import { useSuperAdminAnalytics } from "@/hooks/super-admin/analysis/useSuperAdminAnalytics";

export default function SuperAdminDashboard() {
  const {
    summaryCards,
    monthlyTrend,
    packageDistribution,
    paymentStatusDistribution,
    businessStatusDistribution,
    recentLogs,
    isLoading,
    isError,
  } = useSuperAdminAnalytics();

  const kpiData = summaryCards
    ? [
        {
          icon: Briefcase,
          label: "Total Businesses",
          value: summaryCards.totalBusinesses.toLocaleString(),
          change: `${summaryCards.activeBusinesses} active`,
        },
        {
          icon: Users,
          label: "Active Businesses",
          value: summaryCards.activeBusinesses.toLocaleString(),
          change: `${summaryCards.totalBusinesses - summaryCards.activeBusinesses} inactive`,
        },
        {
          icon: CreditCard,
          label: "Total Payments",
          value: summaryCards.totalPayments.toLocaleString(),
          change: `${summaryCards.totalRevenue.toLocaleString()} collected`,
        },
        {
          icon: TrendingUp,
          label: "Monthly Focus",
          value: monthlyTrend.length.toString(),
          change: "dynamic months",
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Platform Overview</h1>
        <p className="text-muted-foreground mt-2">
          Monitor platform metrics and business health.
        </p>
      </div>

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Analysis data could not be loaded right now.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="p-6 bg-white shadow-md rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs font-semibold text-white bg-green-600 px-2 py-1 rounded">
                  {kpi.change}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">{kpi.label}</p>
              <p className="text-2xl font-bold text-foreground mt-2">
                {kpi.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="businesses"
                stroke="var(--primary)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="payments"
                stroke="var(--secondary)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Business Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={businessStatusDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill="var(--primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Package Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={packageDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill="var(--secondary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Payment Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentStatusDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="value" fill="var(--primary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Analysis Hub</h3>
          <p className="text-sm text-muted-foreground">
            Open the Analysis tab for a dedicated view of all live charts.
          </p>
          <Link
            className="mt-4 inline-flex rounded bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-emerald-600 hover:text-white"
            href="/pages/dashboard/super-admin/analytics"
          >
            Go to Analysis
          </Link>
        </div>
      </div>

      <div className="p-6 bg-white shadow-md rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Platform Activity</h3>
          <a
            href="/pages/dashboard/super-admin/logs"
            className="text-sm font-medium text-primary hover:underline"
          >
            View All
          </a>
        </div>
        <div className="space-y-4">
          {recentLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent platform activity yet.</p>
          ) : (
            recentLogs.map((log) => (
              <div
                key={log._id}
                className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
              >
                <div className="p-2 bg-muted rounded-lg">
                  <Activity className="w-4 h-4 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{log.title}</p>
                  <p className="text-xs text-muted-foreground">{log.description}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}