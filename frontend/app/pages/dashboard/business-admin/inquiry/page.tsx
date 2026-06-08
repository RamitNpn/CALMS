"use client";

import { useState } from "react";
import TabNavigation from "@/components/shared/TabNavigation";
import LogDetails from "@/components/shared/LogDetails";
import CustomizeSection from "@/components/shared/CustomizeSection";
import { Settings, ActivitySquare, FileText } from "lucide-react";
import { useAllInquiries } from "@/hooks/business-admin/inquery/getAllInquires";
import InquiryRecord from "@/components/business-admin/inquery/InqueryRecord";
import { useDebounce } from "use-debounce";

export default function InquiryPage() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("inventory");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  const [debouncedSearch] = useDebounce(search, 500);

  const {
    data: inquiryData,
    isLoading,
    isError,
  } = useAllInquiries({
    page,
    limit: 10,
    search: debouncedSearch,
    dateFilter,
  });

  const inquiries = inquiryData?.data ?? inquiryData ?? [];
  const pagination = inquiryData?.pagination;

  const tabs = [
    { id: "inventory", label: "Inventory", icon: <FileText size={16} /> },
    { id: "customize", label: "Customize", icon: <Settings size={16} /> },
    { id: "logs", label: "Log Details", icon: <ActivitySquare size={16} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Client Inquiry</h2>
          <p className="text-sm text-gray-500">Manage all client inquiries</p>
        </div>
      </div>

      <TabNavigation
        activeTab={activeTab}
        tabs={tabs}
        onTabChange={setActiveTab}
      />

      {activeTab === "inventory" && (
        <InquiryRecord
          inquiries={inquiries}
          isLoading={isLoading}
          error={isError ? "Failed to load inquiry records" : null}
          page={page}
          totalPages={pagination?.totalPages || 1}
          onPageChange={setPage}
          search={search}
          setSearch={setSearch}
          dateFilter={dateFilter}
          setInquiryType={setDateFilter}
        />
      )}

      {activeTab === "customize" && (
        <CustomizeSection
          module="Clients"
          onSave={(options) => {
            console.log("Clients customization saved:", options);
          }}
        />
      )}

      {activeTab === "logs" && (
        <LogDetails
          userId={inquiryData?.businessId}
          module="Inquiry"
          onClearLogs={() => {
            console.log("Clearing inquiries logs");
          }}
        />
      )}
    </div>
  );
}
