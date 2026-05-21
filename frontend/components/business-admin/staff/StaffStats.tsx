import Card from "@/components/ui/card";
import React from "react";

function StaffStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <p className="text-muted-foreground text-sm">Total Staff</p>
        <p className="text-3xl font-bold text-foreground mt-2">127</p>
        <p className="text-xs text-green-600 mt-2">+8 this month</p>
      </Card>
      <Card>
        <p className="text-muted-foreground text-sm">Active Today</p>
        <p className="text-3xl font-bold text-foreground mt-2">112</p>
        <p className="text-xs text-green-600 mt-2">88% present</p>
      </Card>
      <Card>
        <p className="text-muted-foreground text-sm">On Leave</p>
        <p className="text-3xl font-bold text-foreground mt-2">8</p>
        <p className="text-xs text-orange-600 mt-2">Approved leaves</p>
      </Card>
      <Card>
        <p className="text-muted-foreground text-sm">Avg. Salary</p>
        <p className="text-3xl font-bold text-foreground mt-2">$72K</p>
        <p className="text-xs text-muted-foreground mt-2">Monthly</p>
      </Card>
    </div>
  );
}

export default StaffStats;
