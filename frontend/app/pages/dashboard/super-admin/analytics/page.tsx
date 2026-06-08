"use client";

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
import Card from "@/components/ui/card";
import { DistributionChart } from "@/components/ui/widgets";
import { useSuperAdminAnalytics } from "@/hooks/super-admin/analysis/useSuperAdminAnalytics";

export default function AnalyticsPage() {
  const {
    summaryCards,
    monthlyTrend,
    packageDistribution,
    paymentStatusDistribution,
    businessStatusDistribution,
    isLoading,
    isError,
  } = useSuperAdminAnalytics();

  if (!summaryCards && isLoading) {
    return <div className="rounded-lg bg-white p-6 shadow-md">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Analysis</h2>
        <p className="text-muted-foreground mt-2">
          System-wide charts built from live business and payment data.
        </p>
      </div>

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Super admin analysis could not be loaded right now.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards &&
          [
            ["Businesses", summaryCards.totalBusinesses],
            ["Active", summaryCards.activeBusinesses],
            ["Payments", summaryCards.totalPayments],
            ["Revenue", summaryCards.totalRevenue],
          ].map(([label, value]) => (
            <Card key={label}>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {Number(value).toLocaleString()}
              </p>
            </Card>
          ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="businesses" stroke="var(--primary)" strokeWidth={2} />
              <Line type="monotone" dataKey="payments" stroke="var(--secondary)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">Business Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={businessStatusDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip />
              <Bar dataKey="value" fill="var(--primary)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card>
          <DistributionChart title="Package Distribution" data={packageDistribution} variant="bar" />
        </Card>
        <Card>
          <DistributionChart title="Payment Status" data={paymentStatusDistribution} variant="donut" />
        </Card>
        <Card>
          <DistributionChart title="Business Health" data={businessStatusDistribution} variant="donut" />
        </Card>
      </div>
    </div>
  );
}