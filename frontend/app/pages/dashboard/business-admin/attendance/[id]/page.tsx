"use client";

import { AttendanceCalendar } from "@/components/business-admin/attendance/AttendanceCalender";
import AttendancePerUserRecord from "@/components/business-admin/attendance/AttendancePerUserRecord";
import TabNavigation from "@/components/shared/TabNavigation";
import { TAttendance } from "@/libs/types/attendance.types";
import { Calendar, FileText } from "lucide-react";
import { useMemo, useState } from "react";
import { useAttendanceByUser } from "@/hooks/business-admin/attendance-management/getAllAttendanceByUserId";
import moment from "moment";
import { useParams } from "next/navigation";

type CalendarAttendanceRecord = {
  date: string;
  status: "present" | "absent" | "leave" | "half-day" | "holiday";
  checkInTime?: string;
  checkOutTime?: string;
};

const getAttendanceStatus = (attendance: TAttendance) => {
  if (attendance.checkIn && attendance.checkOut) {
    return "present" as const;
  }

  if (attendance.checkIn && !attendance.checkOut) {
    return "half-day" as const;
  }

  if (!attendance.checkIn && attendance.checkOut) {
    return "leave" as const;
  }

  return "absent" as const;
};

export default function AttendanceProfileRecord() {
  const [page, setPage] = useState(1);

  const [activeTab, setActiveTab] = useState("record");
  const params = useParams();

  const userId = params.id as string;

  const {
    data: attendanceData,
    isLoading,
    error: isError,
  } = useAttendanceByUser(userId, page);

  const attendances = useMemo(() => {
    if (!attendanceData) {
      return [];
    }
    return attendanceData.data ?? [];
  }, [attendanceData]);

  const calendarRecords = useMemo<CalendarAttendanceRecord[]>(
    () =>
      attendances.map((attendance: TAttendance) => {
        const createdAt = new Date(attendance.createdAt);

        return {
          date: createdAt.toISOString().slice(0, 10),
          status: getAttendanceStatus(attendance),
          checkInTime: attendance.checkIn
            ? moment(attendance.checkIn).format("hh:mm A")
            : undefined,
          checkOutTime: attendance.checkOut
            ? moment(attendance.checkOut).format("hh:mm A")
            : undefined,
        };
      }),
    [attendances],
  );

  const calendarMonth = useMemo(() => {
    if (attendances.length === 0) {
      return new Date();
    }

    const latestAttendance = [...attendances].sort(
      (left, right) =>
        new Date(right.createdAt).getTime() -
        new Date(left.createdAt).getTime(),
    )[0];

    return new Date(latestAttendance.createdAt);
  }, [attendances]);

  const tabs = [
    { id: "record", label: "Records", icon: <FileText size={16} /> },
    { id: "calender", label: "Calendar View", icon: <Calendar size={16} /> },
  ];

  return (
    <div>
      <TabNavigation
        activeTab={activeTab}
        tabs={tabs}
        onTabChange={setActiveTab}
      />

      {activeTab === "record" && (
        <AttendancePerUserRecord
          details={attendanceData?.data || []}
          isLoading={isLoading}
          error={isError ? "Failed to load attendance records" : null}
          page={page}
          totalPages={attendanceData?.pagination?.totalPages || 1}
          onPageChange={setPage}
        />
      )}

      {activeTab === "calender" && (
        <AttendanceCalendar records={calendarRecords} month={calendarMonth} />
      )}
    </div>
  );
}
