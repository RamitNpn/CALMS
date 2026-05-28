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
import { useBusinessAnalytics } from "@/hooks/business-admin/analysis/useBusinessAnalytics";

export default function BusinessAnalysisPage() {
  const {
    summary,
    growthTrend,
    attendanceBreakdown,
    assetHealth,
    billingMix,
    userMix,
    isLoading,
    isError,
  } = useBusinessAnalytics();

  if (!summary && isLoading) {
    return <div className="rounded-lg bg-white p-6 shadow-md">Loading analysis...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Analysis</h2>
        <p className="text-muted-foreground mt-2">
          Live business metrics pulled from the existing records.
        </p>
      </div>

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Analysis data could not be loaded right now.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {summary &&
          [
            ["Staff", summary.dashboard.totalStaff],
            ["Clients", summary.dashboard.totalClients],
            ["Assets", summary.dashboard.totalAssets],
            ["Attendance", summary.dashboard.totalAttendance],
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
          <h3 className="text-lg font-semibold mb-4">Growth Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} />
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
              <Tooltip />
              <Bar dataKey="value" fill="var(--secondary)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card>
          <DistributionChart title="Asset Health" data={assetHealth} variant="donut" />
        </Card>
        <Card>
          <DistributionChart title="Billing Mix" data={billingMix} variant="bar" />
        </Card>
        <Card>
          <DistributionChart title="User Mix" data={userMix} variant="donut" />
        </Card>
      </div>
    </div>
  );
}