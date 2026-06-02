"use client";

import { useMemo, useState } from "react";
import { useAllAssets } from "@/hooks/business-admin/asset-management/getAllAssets";
import AssetRecord from "@/components/business-admin/asset/AssetRecords";
import TabNavigation from "@/components/shared/TabNavigation";
import LogDetails from "@/components/shared/LogDetails";
import CustomizeSection from "@/components/shared/CustomizeSection";
import Card from "@/components/ui/card";
import {
  BarChart3,
  Settings,
  ActivitySquare,
  FileText,
  PlusCircleIcon,
} from "lucide-react";
import { useAllAssetTypes } from "@/hooks/business-admin/asset-management/getAllAssetTypes";
import AssetTypeRecord from "@/components/business-admin/asset/AssetTypeRecrds";
import { TAsset } from "@/libs/types/asset.type";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useBusinessAnalytics } from "@/hooks/business-admin/analysis/useBusinessAnalytics";

export default function BusinessesPage() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("inventory");

  const {
    data: assetData,
    isLoading,
    isError,
  } = useAllAssets({ page, limit: 10 });

  const assets: TAsset[] = assetData?.data ?? assetData ?? [];
  const assetPagination = assetData?.pagination;
  const { summary, assetHealth } = useBusinessAnalytics();

  const { data: assetTypeData } = useAllAssetTypes({
    page: 1,
    limit: 100,
    business_id: assets?.[0]?.business_id,
  });

  const assetTypes = assetTypeData?.data ?? assetTypeData ?? [];
  const assetTypePagination = assetData?.pagination;

  const assetTypeBreakdown = useMemo(() => {
    const counts: Record<string, number> = assets.reduce(
      (acc: Record<string, number>, asset: TAsset) => {
      const key = asset.type || "Uncategorized";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
      },
      {},
    );

    return Object.entries(counts)
      .sort((left, right) => right[1] - left[1])
      .map(([name, value]) => ({ name, value }));
  }, [assets]);

  const assetStatusBreakdown = useMemo(() => {
    const statusOrder = ["active", "inactive", "maintenance"];

    const counts: Record<string, number> = assets.reduce(
      (acc: Record<string, number>, asset: TAsset) => {
      const key = (asset.status || "unknown").toLowerCase();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
      },
      {},
    );

    const remaining = Object.entries(counts)
      .filter(([status]) => !statusOrder.includes(status))
      .sort((left, right) => right[1] - left[1]);

    return [
      ...statusOrder
        .filter((status) => counts[status] !== undefined)
        .map((status) => ({ name: status, value: counts[status] })),
      ...remaining.map(([name, value]) => ({ name, value })),
    ];
  }, [assets]);

  const assetGrowth = useMemo(() => {
    const monthly: Record<string, number> = assets.reduce(
      (acc: Record<string, number>, asset: TAsset) => {
      const createdAt = new Date(asset.createdAt);
      if (Number.isNaN(createdAt.getTime())) return acc;

      const key = `${createdAt.getFullYear()}-${String(createdAt.getMonth() + 1).padStart(2, "0")}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
      },
      {},
    );

    return Object.entries(monthly)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => {
        const [year, month] = key.split("-").map(Number);
        return {
          label: new Date(year, month - 1, 1).toLocaleDateString("en-US", {
            month: "short",
            year: "2-digit",
          }),
          value,
        };
      });
  }, [assets]);

  const totalAssets = summary?.assets.totalAssets ?? assets.length;
  const totalValue = summary?.assets.totalAssetValue ?? 0;
  const activeAssets =
    summary?.assets.totalActiveAssets ??
    assets.filter((asset: TAsset) => asset.status.toLowerCase() === "active")
      .length;
  const inactiveAssets =
    summary?.assets.totalInactiveAssets ??
    assets.filter((asset: TAsset) => asset.status.toLowerCase() === "inactive")
      .length;
  const maintenanceAssets = assets.filter((asset: TAsset) =>
    asset.status.toLowerCase().includes("maint"),
  ).length;

  const tabs = [
    { id: "inventory", label: "Inventory", icon: <FileText size={16} /> },
    { id: "types", label: "Add Types", icon: <PlusCircleIcon size={16} /> },
    { id: "analysis", label: "Analysis", icon: <BarChart3 size={16} /> },
    { id: "customize", label: "Customize", icon: <Settings size={16} /> },
    { id: "logs", label: "Log Details", icon: <ActivitySquare size={16} /> },
  ];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Business Asset Records
          </h2>
          <p className="text-sm text-gray-500">
            Manage all business assets in the system
          </p>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <p className="text-muted-foreground text-sm">Total Assets</p>
            <p className="text-3xl font-bold text-foreground mt-2">
              {totalAssets.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 mt-2">
              {assetGrowth.at(-1)?.value ?? 0} added this month
            </p>
          </Card>
          <Card>
            <p className="text-muted-foreground text-sm">Total Value</p>
            <p className="text-3xl font-bold text-foreground mt-2">
              ${Math.round(totalValue / 1000).toLocaleString()}K
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Live inventory value
            </p>
          </Card>
          <Card>
            <p className="text-muted-foreground text-sm">Active Assets</p>
            <p className="text-3xl font-bold text-foreground mt-2">
              {activeAssets.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 mt-2">
              {totalAssets > 0 ? `${((activeAssets / totalAssets) * 100).toFixed(1)}% utilization` : "No assets yet"}
            </p>
          </Card>
          <Card>
            <p className="text-muted-foreground text-sm">In Maintenance</p>
            <p className="text-3xl font-bold text-foreground mt-2">
              {maintenanceAssets.toLocaleString()}
            </p>
            <p className="text-xs text-orange-600 mt-2">
              {inactiveAssets.toLocaleString()} inactive
            </p>
          </Card>
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
        <AssetRecord
          assets={assets}
          isLoading={isLoading}
          error={isError ? "Failed to load asset records" : null}
          page={page}
          totalPages={assetPagination?.totalPages || 1}
          onPageChange={setPage}
        />
      )}

      {activeTab === "types" && (
        <AssetTypeRecord
          assetTypeData={assetTypes}
          isLoading={isLoading}
          error={isError ? "Failed to load asset type records" : null}
          page={page}
          totalPages={assetTypePagination?.totalPages || 1}
          onPageChange={setPage}
        />
      )}

      {activeTab === "analysis" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Assets by Type</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={assetTypeBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip />
                <Bar dataKey="value" fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Asset Status</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={assetStatusBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip />
                <Bar dataKey="value" fill="var(--secondary)">
                  {assetStatusBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${entry.name}-${index}`}
                      fill={
                        entry.name === "active"
                          ? "#22c55e"
                          : entry.name === "inactive"
                            ? "#ef4444"
                            : "#f59e0b"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Asset Growth</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={assetGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Asset Summary</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Total asset types: {assetTypes.length.toLocaleString()}</p>
              <p>Active assets: {activeAssets.toLocaleString()}</p>
              <p>Inactive assets: {inactiveAssets.toLocaleString()}</p>
              <p>Maintenance assets: {maintenanceAssets.toLocaleString()}</p>
              <p>Total value: ${Math.round(totalValue).toLocaleString()}</p>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "customize" && (
        <CustomizeSection
          module="Assets"
          onSave={(options) => {
            console.log("Asset customization saved:", options);
          }}
        />
      )}

      {activeTab === "logs" && (
        <LogDetails
          userId={assets?.[0]?.business_id ?? ""}
          module="Asset"
          onClearLogs={() => {
            console.log("Clearing asset logs");
          }}
        />
      )}
    </div>
  );
}
