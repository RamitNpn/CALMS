import Card from "@/components/ui/card";
import { useAttendanceStats } from "@/hooks/business-admin/stats-data/getAttendanceStats";

function AttendanceStats() {

  const { data: attendanceStats } = useAttendanceStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <p className="text-muted-foreground text-sm">Present</p>
        <p className="text-3xl font-bold text-foreground mt-2">
          {attendanceStats?.totalAttendance.toLocaleString()}
        </p>
        <p className="text-xs text-green-600 mt-2">
          {attendanceStats?.attendanceRate.toFixed(1)}% attendance
        </p>
      </Card>
      <Card>
        <p className="text-muted-foreground text-sm">Absent</p>
        <p className="text-3xl font-bold text-foreground mt-2">
          {attendanceStats?.totalAbsent.toLocaleString()}
        </p>
        <p className="text-xs text-red-600 mt-2">Live absence count</p>
      </Card>
      <Card>
        <p className="text-muted-foreground text-sm">On Leave</p>
        <p className="text-3xl font-bold text-foreground mt-2">
          {attendanceStats?.totalOnLeave.toLocaleString()}
        </p>
        <p className="text-xs text-blue-600 mt-2">Live leave count</p>
      </Card>
      <Card>
        <p className="text-muted-foreground text-sm">Late Today</p>
        <p className="text-3xl font-bold text-foreground mt-2">
          {attendanceStats?.lateToday.toLocaleString()}
        </p>
        <p className="text-xs text-orange-600 mt-2">Checked in late</p>
      </Card>
    </div>
  );
}

export default AttendanceStats;
