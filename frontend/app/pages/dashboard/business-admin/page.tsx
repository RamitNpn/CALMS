"use client";

import { Users, Package, Briefcase, Clock, Activity } from "lucide-react";
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
import { DistributionChart } from "@/components/ui/widgets";
import Card from "@/components/ui/card";
import { useBusinessAnalytics } from "@/hooks/business-admin/analysis/useBusinessAnalytics";

export default function DashboardPage() {
  const {
    summary,
    growthTrend,
    attendanceBreakdown,
    assetHealth,
    billingMix,
    userMix,
    recentLogs,
    isLoading,
    isError,
  } = useBusinessAnalytics();

  const kpiData = summary
    ? [
        {
          icon: Users,
          label: "Total Staff",
          value: summary.dashboard.totalStaff.toLocaleString(),
          change: `${summary.dashboard.staffRate >= 0 ? "+" : ""}${summary.dashboard.staffRate}%`,
        },
        {
          icon: Package,
          label: "Assets",
          value: summary.dashboard.totalAssets.toLocaleString(),
          change: `${summary.dashboard.assetRate >= 0 ? "+" : ""}${summary.dashboard.assetRate}%`,
        },
        {
          icon: Briefcase,
          label: "Clients",
          value: summary.dashboard.totalClients.toLocaleString(),
          change: `${summary.dashboard.clientRate >= 0 ? "+" : ""}${summary.dashboard.clientRate}%`,
        },
        {
          icon: Clock,
          label: "Attendance",
          value: summary.dashboard.totalAttendance.toLocaleString(),
          change: `${summary.attendance.attendanceRate >= 0 ? "+" : ""}${summary.attendance.attendanceRate}%`,
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here&apos;s your business overview.
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
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
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
        <Card>
          <h3 className="text-lg font-semibold mb-4">Growth Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthTrend}>
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
                dataKey="value"
                stroke="var(--primary)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Attendance Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attendanceBreakdown}>
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
              <Bar dataKey="value" fill="var(--secondary)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <DistributionChart title="Asset Health" data={assetHealth} variant="donut" />
        </Card>

        <Card>
          <DistributionChart title="Billing Mix" data={billingMix} variant="bar" />
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Advanced Analytics</h2>
          {isLoading && <p className="text-sm text-muted-foreground">Loading live metrics...</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <DistributionChart title="User Mix" data={userMix} variant="donut" />
          </Card>
          <Card>
            <h3 className="text-lg font-semibold mb-4">More Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Open the Analysis tab for a dedicated view of the live charts.
            </p>
            <Link
              className="mt-4 inline-flex rounded bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-emerald-600 hover:text-white"
              href="/pages/dashboard/business-admin/analytics"
            >
              Go to Analysis
            </Link>
          </Card>
        </div>
      </div>

      <div className="px-6 py-2">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Link
            className="px-3 py-2 text-sm text-center rounded-[8px] bg-white shadow-md text-gray-800 hover:bg-emerald-600 hover:text-white"
            href="/business/staff"
          >
            Add New Staff
          </Link>
          <Link
            className="px-3 py-2 text-sm text-center rounded-[8px] bg-white shadow-md text-gray-800 hover:bg-emerald-600 hover:text-white"
            href="/business/clients"
          >
            New Client
          </Link>
          <Link
            className="px-3 py-2 text-sm text-center rounded-[8px] bg-white shadow-md text-gray-800 hover:bg-emerald-600 hover:text-white"
            href="/business/assets"
          >
            Register Asset
          </Link>
          <Link
            className="px-3 py-2 text-sm text-center rounded-[8px] bg-white shadow-md text-gray-800 hover:bg-emerald-600 hover:text-white"
            href="/business/billing"
          >
            Create Invoice
          </Link>
        </div>
      </div>

      <div className="px-6 py-2 h-[50vh] overflow-y-scroll bg-white shadow-md rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <a
            href="/pages/dashboard/business-admin/logs"
            className="text-sm font-medium text-primary hover:underline"
          >
            View All
          </a>
        </div>
        <div className="space-y-4">
          {recentLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity yet.</p>
          ) : (
            recentLogs.map((log) => (
              <div
                key={log._id}
                className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="p-2 bg-muted rounded-lg">
                  <Activity className="w-4 h-4 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {log.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {log.description}
                  </p>
                </div>
                <Activity className="w-4 h-4 text-muted-foreground" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}