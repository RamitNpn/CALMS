import Card from "@/components/ui/card";
import React from "react";

type StaffStatsProps = {
  totalStaff: number;
  totalActiveStaff: number;
  totalInactiveStaff: number;
  activeRate: number;
};

function StaffStats({
  totalStaff,
  totalActiveStaff,
  totalInactiveStaff,
  activeRate,
}: StaffStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <p className="text-muted-foreground text-sm">Total Staff</p>
        <p className="text-3xl font-bold text-foreground mt-2">
          {totalStaff.toLocaleString()}
        </p>
        <p className="text-xs text-green-600 mt-2">Live staff count</p>
      </Card>
      <Card>
        <p className="text-muted-foreground text-sm">Active Staff</p>
        <p className="text-3xl font-bold text-foreground mt-2">
          {totalActiveStaff.toLocaleString()}
        </p>
        <p className="text-xs text-green-600 mt-2">{activeRate.toFixed(1)}% active</p>
      </Card>
      <Card>
        <p className="text-muted-foreground text-sm">Inactive Staff</p>
        <p className="text-3xl font-bold text-foreground mt-2">
          {totalInactiveStaff.toLocaleString()}
        </p>
        <p className="text-xs text-orange-600 mt-2">Not currently active</p>
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

export default StaffStats;
