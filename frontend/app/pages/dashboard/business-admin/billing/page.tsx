"use client";

import { useState } from "react";
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import Button from "@/components/ui/button";

const billingChartData = [
  { month: 'Jan', revenue: 45000, pending: 12000, paid: 33000 },
  { month: 'Feb', revenue: 52000, pending: 18000, paid: 34000 },
  { month: 'Mar', revenue: 48000, pending: 8000, paid: 40000 },
  { month: 'Apr', revenue: 61000, pending: 15000, paid: 46000 },
  { month: 'May', revenue: 55000, pending: 20000, paid: 35000 },
  { month: 'Jun', revenue: 67000, pending: 7200, paid: 59800 },
];

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [page, setPage] = useState(1);
  const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'year'>('month');

  const {
    data: billingData,
    isLoading,
    isError,
  } = useAllBillings({ page, limit: 10 });

  const billings = billingData?.data ?? billingData ?? [];
  const pagination = billingData?.pagination;

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
          <div className="flex gap-4">
            {[
              { label: 'Week', value: 'week' },
              { label: 'Month', value: 'month' },
              { label: 'Year', value: 'year' },
            ].map((option) => (
              <Button
                key={option.value}
                variant={timePeriod === option.value ? 'primary' : 'secondary'}
                onClick={() => setTimePeriod(option.value as 'week' | 'month' | 'year')}
              >
                {option.label}
              </Button>
            ))}
          </div>

          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={billingChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'vardiv)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={2} />
                <Line type="monotone" dataKey="paid" stroke="var(--chart-1)" strokeWidth={2} />
                <Line type="monotone" dataKey="pending" stroke="var(--chart-2)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Payment Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={billingChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="paid" fill="var(--chart-1)" />
                <Bar dataKey="pending" fill="var(--chart-2)" />
              </BarChart>
            </ResponsiveContainer>
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
          module="Billing"
          onClearLogs={() => {
            console.log("Clearing billing logs");
          }}
        />
      )}
    </div>
  );
}
