"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Briefcase,
  Users,
  BarChart3,
  TrendingUp,
  Settings,
  User,
  ActivitySquare,
} from "lucide-react";
import TabNavigation from "@/components/shared/TabNavigation";
import BusinessTable from "@/components/super-admin/business/BusinessRecords";
import { BusinessForm } from "@/components/super-admin/business/BusinessForm";
import CustomizeSection, {
  defaultCustomizeOptions,
} from "@/components/shared/CustomizeSection";
import LogDetails from "@/components/shared/LogDetails";
import type { TBusiness } from "@/libs/types/business.types";
import { useDebounce } from "use-debounce";
import { useAllBusinesses } from "@/hooks/super-admin/business-records/getAllBusinesses";

const BUSINESS_TABS = [
  {
    id: "inventory",
    label: "Records",
    icon: <User size={16} />,
  },
  {
    id: "customize",
    label: "Customize",
    icon: <Settings size={16} />,
    disabled: true,
    badge: "Dev",
  },
  {
    id: "logs",
    label: "Log Details",
    icon: <ActivitySquare size={16} />,
  },
];

const buildMonthKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export default function BusinessesPage() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("inventory");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  const [debouncedSearch] = useDebounce(search, 500);
  const [businessCustomizeOptions, setBusinessCustomizeOptions] = useState(
    defaultCustomizeOptions.Business,
  );

  const visibleBusinessColumns = useMemo(
    () =>
      businessCustomizeOptions
        .filter((option) => option.enabled)
        .map((option) => option.id),
    [businessCustomizeOptions],
  );

  const {
    data: businessData,
    isLoading,
    isError,
  } = useAllBusinesses({
    page,
    limit: 10,
    search: debouncedSearch,
    dateFilter,
  });

  const businesses = useMemo<TBusiness[]>(
    () => businessData?.data ?? businessData ?? [],
    [businessData],
  );
  const pagination = businessData?.pagination;

  const totalBusinesses = businesses.length;
  const activeBusinesses = businesses.filter((item) => item.status).length;
  const packageDistribution = useMemo(() => {
    const counts = businesses.reduce<Record<string, number>>(
      (acc, business) => {
        acc[business.package] = (acc[business.package] ?? 0) + 1;
        return acc;
      },
      {},
    );

    return Object.entries(counts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [businesses]);

  const statusDistribution = useMemo(() => {
    return [
      { name: "Active", value: activeBusinesses },
      { name: "Inactive", value: totalBusinesses - activeBusinesses },
    ];
  }, [activeBusinesses, totalBusinesses]);

  const monthlyTrend = useMemo(() => {
    const trendMap = new Map<string, { month: string; count: number }>();

    businesses.forEach((business) => {
      const createdAt = new Date(business.createdAt);
      const monthKey = buildMonthKey(createdAt);
      if (!trendMap.has(monthKey)) {
        trendMap.set(monthKey, {
          month: createdAt.toLocaleDateString("default", {
            month: "short",
            year: "numeric",
          }),
          count: 0,
        });
      }
      trendMap.get(monthKey)!.count += 1;
    });

    return Array.from(trendMap.entries())
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([, value]) => value);
  }, [businesses]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Business Management
          </h2>
          <p className="text-sm text-gray-500">
            Monitor business performance, customize the experience, and review
            activity logs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            icon: Briefcase,
            title: "Total Businesses",
            value: totalBusinesses,
            summary: `${activeBusinesses} active`,
          },
          {
            icon: Users,
            title: "Active Businesses",
            value: activeBusinesses,
            summary: `${totalBusinesses - activeBusinesses} inactive`,
          },
          {
            icon: BarChart3,
            title: "Business Packages",
            value: packageDistribution.reduce(
              (sum, item) => sum + item.value,
              0,
            ),
            summary: `${packageDistribution.length} package tiers`,
          },
          {
            icon: TrendingUp,
            title: "Recent Months",
            value: monthlyTrend.length,
            summary: "New business trend",
          },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-md border border-gray-200 bg-white p-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-700">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm text-gray-500">{card.summary}</span>
              </div>
              <p className="mt-4 text-sm text-gray-500">{card.title}</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {card.value.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly New Businesses
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyTrend}>
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
              <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Package Mix
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <RePieChart>
              <Pie
                data={packageDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                fill="#4f46e5"
                label
              >
                {packageDistribution.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={["#4f46e5", "#22c55e", "#fb7185"][index % 3]}
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
            </RePieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Business Health
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis type="category" dataKey="name" stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="value" fill="#10b981" radius={[8, 8, 8, 8]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white p-6">
        <TabNavigation
          activeTab={activeTab}
          tabs={BUSINESS_TABS}
          onTabChange={setActiveTab}
        />

        {activeTab === "inventory" && (
          <BusinessTable
            businesses={businesses}
            isLoading={isLoading}
            error={isError ? "Failed to load business records" : null}
            page={page}
            totalPages={pagination?.totalPages || 1}
            onPageChange={setPage}
            search={search}
            setSearch={setSearch}
            dateFilter={dateFilter}
            setInquiryType={setDateFilter}
            visibleColumns={visibleBusinessColumns}
          />
        )}

        {activeTab === "customize" && (
          <CustomizeSection
            module="Business"
            initialOptions={businessCustomizeOptions}
            onSave={(options) => {
              setBusinessCustomizeOptions(options);
            }}
          />
        )}

        {activeTab === "logs" && (
          <LogDetails
            module="Business"
            userId=""
            onClearLogs={() => {
              console.log("Clearing business logs");
            }}
          />
        )}
      </div>

      {open && <BusinessForm onClose={() => setOpen(false)} />}
    </div>
  );
}
