import Card from "@/components/ui/card";
import React from "react";

function AttendanceStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <p className="text-muted-foreground text-sm">Present Today</p>
        <p className="text-3xl font-bold text-foreground mt-2">112</p>
        <p className="text-xs text-green-600 mt-2">88% attendance</p>
      </Card>
      <Card>
        <p className="text-muted-foreground text-sm">Absent</p>
        <p className="text-3xl font-bold text-foreground mt-2">8</p>
        <p className="text-xs text-red-600 mt-2">Without notice</p>
      </Card>
      <Card>
        <p className="text-muted-foreground text-sm">On Leave</p>
        <p className="text-3xl font-bold text-foreground mt-2">5</p>
        <p className="text-xs text-blue-600 mt-2">Approved</p>
      </Card>
      <Card>
        <p className="text-muted-foreground text-sm">Late Today</p>
        <p className="text-3xl font-bold text-foreground mt-2">3</p>
        <p className="text-xs text-orange-600 mt-2">Checked in late</p>
      </Card>
    </div>
  );
}

export default AttendanceStats;
