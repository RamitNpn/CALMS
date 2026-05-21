import Card from "@/components/ui/card";
import React from "react";

function ClientStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <p className="text-muted-foreground text-sm">Total Clients</p>
        <p className="text-3xl font-bold text-foreground mt-2">89</p>
        <p className="text-xs text-green-600 mt-2">+12 this quarter</p>
      </Card>
      <Card>
        <p className="text-muted-foreground text-sm">Active Contracts</p>
        <p className="text-3xl font-bold text-foreground mt-2">67</p>
        <p className="text-xs text-green-600 mt-2">75% of total</p>
      </Card>
      <Card>
        <p className="text-muted-foreground text-sm">Total Revenue</p>
        <p className="text-3xl font-bold text-foreground mt-2">$542K</p>
        <p className="text-xs text-green-600 mt-2">+18% YoY</p>
      </Card>
      <Card>
        <p className="text-muted-foreground text-sm">Avg Contract Value</p>
        <p className="text-3xl font-bold text-foreground mt-2">$8,093</p>
        <p className="text-xs text-muted-foreground mt-2">Per client</p>
      </Card>
    </div>
  );
}

export default ClientStats;
