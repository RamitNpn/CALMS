"use client";

import { useMemo, useState } from "react";
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
import { TClient } from "@/libs/types/client.types";
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

export default function ClientPage() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("inventory");

  const router = useRouter();

  const {
    data: clientData,
    isLoading,
    isError,
  } = useAllClients({ page, limit: 10 });

  const { summary } = useBusinessAnalytics();

  const clients = clientData?.data ?? clientData ?? [];
  const pagination = clientData?.pagination;

  const clientGenderData = useMemo(() => {
    const counts: Record<string, number> = clients.reduce(
      (acc: Record<string, number>, client: TClient) => {
      const key = client.gender || "other";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
      },
      {},
    );

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [clients]);

  const clientGrowth = useMemo(() => {
    const monthly: Record<string, number> = clients.reduce(
      (acc: Record<string, number>, client: TClient) => {
      const createdAt = new Date(client.createdAt);
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
  }, [clients]);

  const totalClients = summary?.users.totalClients ?? clients.length;
  const activeClients = summary?.users.totalActiveClients ?? clients.length;
  const inactiveClients = summary?.users.totalInactiveClients ?? 0;
  const activeRate = totalClients > 0 ? (activeClients / totalClients) * 100 : 0;

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

      <ClientStats
        totalClients={totalClients}
        totalActiveClients={activeClients}
        totalInactiveClients={inactiveClients}
        activeRate={activeRate}
      />

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
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Client Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={clientGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Gender Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={clientGenderData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip />
                <Bar dataKey="value" fill="var(--secondary)">
                  {clientGenderData.map((entry, index) => (
                    <Cell
                      key={`client-gender-${entry.name}-${index}`}
                      fill={index % 2 === 0 ? "#2563eb" : "#10b981"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-6 lg:col-span-2 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">Recent Clients</h3>
            <div className="space-y-3">
              {clients.slice(0, 5).map((client) => (
                <div
                  key={client._id}
                  className="flex items-center justify-between p-3 hover:bg-muted/50 rounded"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{client.userName}</p>
                    <p className="text-sm text-muted-foreground">
                      {client.userEmail}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground capitalize">
                      {client.gender || "other"}
                    </p>
                    <p className="text-xs text-green-600">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button onClick={() => router.push(`/business/clients/${client._id}`)}>
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
          userId={clients?.[0]?.business_id ?? ""}
          module="Client"
          onClearLogs={() => {
            console.log("Clearing clients logs");
          }}
        />
      )}
    </div>
  );
}
