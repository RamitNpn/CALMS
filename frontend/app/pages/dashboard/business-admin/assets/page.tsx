"use client";

import { useState } from "react";
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

export default function BusinessesPage() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("inventory");

  const {
    data: assetData,
    isLoading,
    isError,
  } = useAllAssets({ page, limit: 10 });

  const assets = assetData?.data ?? assetData ?? [];
  const assetPagination = assetData?.pagination;

  const { data: assetTypeData } = useAllAssetTypes({
    page: 1,
    limit: 100,
    business_id: assets?.[0]?.businessId,
  });

  const assetTypes = assetTypeData?.data ?? assetTypeData ?? [];
  const assetTypePagination = assetData?.pagination;

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
            <p className="text-3xl font-bold text-foreground mt-2">543</p>
            <p className="text-xs text-green-600 mt-2">+25 this month</p>
          </Card>
          <Card>
            <p className="text-muted-foreground text-sm">Total Value</p>
            <p className="text-3xl font-bold text-foreground mt-2">$287K</p>
            <p className="text-xs text-muted-foreground mt-2">
              Inventory value
            </p>
          </Card>
          <Card>
            <p className="text-muted-foreground text-sm">Active Assets</p>
            <p className="text-3xl font-bold text-foreground mt-2">521</p>
            <p className="text-xs text-green-600 mt-2">95.9% utilization</p>
          </Card>
          <Card>
            <p className="text-muted-foreground text-sm">In Maintenance</p>
            <p className="text-3xl font-bold text-foreground mt-2">12</p>
            <p className="text-xs text-orange-600 mt-2">Scheduled</p>
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
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Assets by Category</h3>
            <div className="space-y-3">
              {[
                { name: "Electronics", count: 180, value: 95000 },
                { name: "Furniture", count: 140, value: 42000 },
                { name: "Vehicles", count: 15, value: 75000 },
                { name: "Equipment", count: 120, value: 52000 },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-3 hover:bg-muted/50 rounded"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.count} assets
                    </p>
                  </div>
                  <span className="font-semibold text-foreground">
                    ${(item.value / 1000).toFixed(0)}K
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Asset Conditions</h3>
            <div className="space-y-3">
              {[
                { name: "Excellent", count: 280, color: "bg-green-500" },
                { name: "Good", count: 180, color: "bg-blue-500" },
                { name: "Fair", count: 70, color: "bg-yellow-500" },
                { name: "Poor", count: 13, color: "bg-red-500" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm text-foreground flex-1">
                    {item.name}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
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
          userId={assets.businessId}
          module="Asset"
          onClearLogs={() => {
            console.log("Clearing asset logs");
          }}
        />
      )}
    </div>
  );
}
