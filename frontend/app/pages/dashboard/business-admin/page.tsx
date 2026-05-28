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

const kpiData = [
  { icon: Users, label: "Total Staff", value: "127", change: "+12%" },
  { icon: Package, label: "Assets", value: "543", change: "+8%" },
  { icon: Briefcase, label: "Clients", value: "89", change: "+5%" },
  { icon: Clock, label: "Attendance Rate", value: "94%", change: "+2%" },
];

const chartData = [
  { month: "Jan", revenue: 4000, expenses: 2400 },
  { month: "Feb", revenue: 3000, expenses: 1398 },
  { month: "Mar", revenue: 2000, expenses: 9800 },
  { month: "Apr", revenue: 2780, expenses: 3908 },
  { month: "May", revenue: 1890, expenses: 4800 },
  { month: "Jun", revenue: 2390, expenses: 3800 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here&apos;s your business overview.
        </p>
      </div>

      {/* KPI Cards */}
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis stroke="var(--muted-foreground)" />
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
                dataKey="revenue"
                stroke="var(--primary)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="var(--destructive)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Activity Chart */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Monthly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="revenue" fill="var(--primary)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Advanced Analytics Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Advanced Analytics
        </h2>

        {/* Distribution Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <DistributionChart
              title="Staff Distribution by Department"
              data={[
                {
                  name: "Engineering",
                  value: 45,
                  percentage: (45 / 127) * 100,
                },
                { name: "Sales", value: 32, percentage: (32 / 127) * 100 },
                { name: "Operations", value: 28, percentage: (28 / 127) * 100 },
                { name: "HR", value: 15, percentage: (15 / 127) * 100 },
                { name: "Marketing", value: 7, percentage: (7 / 127) * 100 },
              ]}
              variant="bar"
            />
          </Card>
          <Card>
            <DistributionChart
              title="Client Acquisition Channels"
              data={[
                { name: "Referral", value: 32, percentage: (32 / 89) * 100 },
                { name: "Direct", value: 28, percentage: (28 / 89) * 100 },
                { name: "Marketing", value: 18, percentage: (18 / 89) * 100 },
                { name: "Partnership", value: 11, percentage: (11 / 89) * 100 },
              ]}
              variant="donut"
            />
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
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

      {/* Recent Activity */}
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
          {[
            {
              action: "New staff member added",
              time: "2 hours ago",
              icon: Users,
            },
            {
              action: "Invoice #1234 generated",
              time: "4 hours ago",
              icon: Package,
            },
            { action: "Attendance marked", time: "6 hours ago", icon: Clock },
            {
              action: "New client registered",
              time: "1 day ago",
              icon: Briefcase,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0 hover:bg-muted/50 rounded-lg transition-colors"
              >
                <div className="p-2 bg-muted rounded-lg">
                  <Icon className="w-4 h-4 text-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {item.action}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
                <Activity className="w-4 h-4 text-muted-foreground" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
