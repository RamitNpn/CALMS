"use client";

import { useState } from "react";
import ClientRecord from "@/components/business-admin/client/ClientRecord";
import TabNavigation from "@/components/shared/TabNavigation";
import LogDetails from "@/components/shared/LogDetails";
import CustomizeSection from "@/components/shared/CustomizeSection";
import { useAllClients } from "@/hooks/business-admin/client-management/getAllClientData";
import {
  BarChart3,
  Settings,
  ActivitySquare,
  FileText,
  Eye,
} from "lucide-react";
import Button from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ClientStats from "@/components/business-admin/client/ClientStats";

const mockClients = [
  {
    id: "1",
    name: "Acme Corporation",
    email: "contact@acme.com",
    phone: "+1-555-0101",
    industry: "Technology",
    companyName: "Acme Corp Inc",
    status: "active",
    contractValue: 50000,
    startDate: "2023-01-15",
    endDate: "2024-01-15",
    address: "123 Business St, NYC",
    notes: "Key account, quarterly reviews required",
  },
];

export default function ClientPage() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("inventory");

  const router = useRouter();

  const {
    data: clientData,
    isLoading,
    isError,
  } = useAllClients({ page, limit: 10 });

  const clients = clientData?.data ?? clientData ?? [];
  const pagination = clientData?.pagination;

  const tabs = [
    { id: "inventory", label: "Inventory", icon: <FileText size={16} /> },
    { id: "analysis", label: "Analysis", icon: <BarChart3 size={16} /> },
    { id: "customize", label: "Customize", icon: <Settings size={16} /> },
    { id: "logs", label: "Log Details", icon: <ActivitySquare size={16} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Business Client Records
          </h2>
          <p className="text-sm text-gray-500">
            Manage all business clients in the system
          </p>
        </div>
      </div>

      <ClientStats />

      <TabNavigation
        activeTab={activeTab}
        tabs={tabs}
        onTabChange={setActiveTab}
      />

      {activeTab === "inventory" && (
        <ClientRecord
          clients={clients}
          isLoading={isLoading}
          error={isError ? "Failed to load client records" : null}
          page={page}
          totalPages={pagination?.totalPages || 1}
          onPageChange={setPage}
        />
      )}

      {activeTab === "analysis" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue by Industry</h3>
            <div className="space-y-3">
              {[
                { name: "Technology", value: 180000, percentage: 33 },
                { name: "Finance", value: 150000, percentage: 28 },
                { name: "Healthcare", value: 120000, percentage: 22 },
                { name: "Retail", value: 92000, percentage: 17 },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {item.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      ${(item.value / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Client Status Distribution
            </h3>
            <div className="space-y-3">
              {[
                { name: "Active", value: 67, color: "bg-green-500" },
                { name: "Inactive", value: 15, color: "bg-gray-500" },
                { name: "Suspended", value: 7, color: "bg-red-500" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                  <span className="text-sm text-foreground">{item.name}</span>
                  <span className="ml-auto text-sm font-semibold text-foreground">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Recent Clients</h3>
            <div className="space-y-3">
              {mockClients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between p-3 hover:bg-muted/50 rounded"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{client.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {client.industry}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      ${(client.contractValue / 1000).toFixed(0)}K
                    </p>
                    <p className="text-xs text-green-600">{client.status}</p>
                  </div>
                  <Button
                    onClick={() =>
                      router.push(`/business/clients/${client.id}`)
                    }
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
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
        userId={clientData?.businessId}
          module="Client"
          onClearLogs={() => {
            console.log("Clearing clients logs");
          }}
        />
      )}
    </div>
  );
}
