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

const kpiData = [
  { icon: Briefcase, label: "Total Businesses", value: "342", change: "+15%" },
  { icon: Users, label: "Active Users", value: "8,234", change: "+22%" },
  {
    icon: CreditCard,
    label: "Monthly Revenue",
    value: "$124.5K",
    change: "+18%",
  },
  { icon: TrendingUp, label: "Growth Rate", value: "12.5%", change: "+3%" },
];

const revenueData = [
  { month: "Jan", revenue: 45000, subscriptions: 320 },
  { month: "Feb", revenue: 52000, subscriptions: 380 },
  { month: "Mar", revenue: 48000, subscriptions: 350 },
  { month: "Apr", revenue: 61000, subscriptions: 430 },
  { month: "May", revenue: 75000, subscriptions: 510 },
  { month: "Jun", revenue: 89000, subscriptions: 620 },
];

export default function SuperAdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Platform Overview
        </h1>
        <p className="text-muted-foreground mt-2">
          Monitor platform metrics and business health.
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
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
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subscription Growth */}
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Subscription Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
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
              <Bar dataKey="subscriptions" fill="var(--secondary)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Business Management</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Manage businesses, subscriptions, and their configurations
          </p>
          <div className="space-y-2 space-x-4">
            <Link
              className="px-3 py-2 text-sm text-center rounded bg-gray-100 shadow-md text-gray-700 hover:bg-emerald-600 hover:text-white"
              href="/super-admin/businesses"
            >
              View All Businesses
            </Link>
            <Link
              className="px-3 py-2 text-sm text-center rounded bg-gray-100 shadow-md text-gray-700 hover:bg-emerald-600 hover:text-white"
              href="/super-admin/subscriptions"
            >
              Manage Subscriptions
            </Link>
          </div>
        </div>

        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Track payments, invoices, and financial metrics
          </p>
          <div className="space-y-2 space-x-4">
            <Link
              className="px-3 py-2 text-sm text-center rounded bg-gray-100 shadow-md text-gray-700 hover:bg-emerald-600 hover:text-white"
              href="/super-admin/payments"
            >
              Payment Tracking
            </Link>
            <Link
              className="px-3 py-2 text-sm text-center rounded bg-gray-100 shadow-md text-gray-700 hover:bg-emerald-600 hover:text-white"
              href="/super-admin/analytics"
            >
              Analytics & Reports
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
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
          {[
            {
              action: "New business registered",
              business: "Tech Innovations Inc",
              time: "2 hours ago",
            },
            {
              action: "Payment received",
              business: "Global Solutions Ltd",
              amount: "$599",
              time: "4 hours ago",
            },
            {
              action: "Subscription upgraded",
              business: "Fast Forward Corp",
              time: "6 hours ago",
            },
            {
              action: "New user created",
              business: "Digital Pioneers",
              time: "1 day ago",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
            >
              <div className="p-2 bg-muted rounded-lg">
                <Activity className="w-4 h-4 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {item.action}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.business} {item.amount ? `- ${item.amount}` : ""}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">{item.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
