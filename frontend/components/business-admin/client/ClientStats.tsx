import Card from "@/components/ui/card";
import React from "react";

type ClientStatsProps = {
  totalClients: number;
  totalActiveClients: number;
  totalInactiveClients: number;
  activeRate: number;
};

function ClientStats({
  totalClients,
  totalActiveClients,
  totalInactiveClients,
  activeRate,
}: ClientStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <p className="text-muted-foreground text-sm">Total Clients</p>
        <p className="text-3xl font-bold text-foreground mt-2">
          {totalClients.toLocaleString()}
        </p>
        <p className="text-xs text-green-600 mt-2">Live client count</p>
      </Card>
      <Card>
        <p className="text-muted-foreground text-sm">Active Clients</p>
        <p className="text-3xl font-bold text-foreground mt-2">
          {totalActiveClients.toLocaleString()}
        </p>
        <p className="text-xs text-green-600 mt-2">{activeRate.toFixed(1)}% active</p>
      </Card>
      <Card>
        <p className="text-muted-foreground text-sm">Inactive Clients</p>
        <p className="text-3xl font-bold text-foreground mt-2">
          {totalInactiveClients.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground mt-2">Clients not active</p>
      </Card>
      <Card>
        <p className="text-muted-foreground text-sm">Active Rate</p>
        <p className="text-3xl font-bold text-foreground mt-2">
          {activeRate.toFixed(1)}%
        </p>
        <p className="text-xs text-muted-foreground mt-2">From live stats</p>
      </Card>
    </div>
  );
}

export default ClientStats;
