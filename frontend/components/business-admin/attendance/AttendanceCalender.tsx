"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/button";

interface AttendanceRecord {
  date: string; // YYYY-MM-DD format
  status: "present" | "absent" | "leave" | "half-day" | "holiday";
  checkInTime?: string;
  checkOutTime?: string;
}

interface AttendanceCalendarProps {
  records: AttendanceRecord[];
  month?: Date;
  onMonthChange?: (month: Date) => void;
}

export function AttendanceCalendar({
  records,
  month = new Date(),
  onMonthChange,
}: AttendanceCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(month);

  const handlePrevMonth = () => {
    const prev = new Date(currentMonth);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentMonth(prev);
    onMonthChange?.(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + 1);
    setCurrentMonth(next);
    onMonthChange?.(next);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const recordMap = new Map(records.map((r) => [r.date, r]));

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const STATUS_CLASS = {
    present: "bg-green-50 border-green-200 text-green-700",
    absent: "bg-red-50 border-red-200 text-red-700",
    leave: "bg-blue-50 border-blue-200 text-blue-700",
    "half-day": "bg-yellow-50 border-yellow-200 text-yellow-700",
    holiday: "bg-purple-50 border-purple-200 text-purple-700",
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      present: "Present",
      absent: "Absent",
      leave: "Leave",
      "half-day": "Half-Day",
      holiday: "Holiday",
    };
    return labels[status] || "Unknown";
  };

  const monthYear = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // Calculate statistics
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
    return recordMap.get(dateStr);
  }).filter((r) => r !== undefined) as AttendanceRecord[];

  const stats = {
    present: monthDays.filter((r) => r.status === "present").length,
    absent: monthDays.filter((r) => r.status === "absent").length,
    leave: monthDays.filter((r) => r.status === "leave").length,
    halfDay: monthDays.filter((r) => r.status === "half-day").length,
    holiday: monthDays.filter((r) => r.status === "holiday").length,
  };

  return (
    <div className="p-4 rounded-xl shadow-sm bg-white/70 backdrop-blur">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-foreground">{monthYear}</h3>
        <div className="flex gap-2">
          <Button
            className="bg-gray-200 hover:bg-gray-300"
            variant="secondary"
            onClick={handlePrevMonth}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            className="bg-gray-200 hover:bg-gray-300"
            variant="secondary"
            onClick={handleNextMonth}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm my-2">
        <div className="bg-white shadow-md rounded py-1 px-2">
          <p className="text-muted-foreground mb-1">Present</p>
          <p className="text-2xl font-bold text-green-600">{stats.present}</p>
        </div>
        <div className="bg-white shadow-md rounded py-1 px-2">
          <p className="text-muted-foreground mb-1">Absent</p>
          <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
        </div>
        <div className="bg-white shadow-md rounded py-1 px-2">
          <p className="text-muted-foreground mb-1">Leave</p>
          <p className="text-2xl font-bold text-blue-600">{stats.leave}</p>
        </div>
        <div className="bg-white shadow-md rounded py-1 px-2">
          <p className="text-muted-foreground mb-1">Half-Day</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.halfDay}</p>
        </div>
        <div className="bg-white shadow-md rounded py-1 px-2">
          <p className="text-muted-foreground mb-1">Holiday</p>
          <p className="text-2xl font-bold text-purple-600">{stats.holiday}</p>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="my-6">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1.5 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-[11px] font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-9 w-9" />;
            }

            const dateStr = `${currentMonth.getFullYear()}-${String(
              currentMonth.getMonth() + 1,
            ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            const record = recordMap.get(dateStr);

            return (
              <div
                key={day}
                className={` h-9 w-9 mx-auto rounded-md border flex flex-col items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-md cursor-pointer ${
                  record
                    ? STATUS_CLASS[record.status]
                    : "bg-gray-50 border-gray-200 text-gray-400"
                }
`}
                title={record ? getStatusLabel(record.status) : ""}
              >
                <span className="text-[11px] font-medium text-gray-700 leading-none">
                  {day}
                </span>
                {record && (
                  <span
                    className={`mt-[2px] h-2 w-2 rounded-full shadow-sm ${
                      record.status === "present"
                        ? "bg-green-500"
                        : record.status === "absent"
                          ? "bg-red-500"
                          : record.status === "leave"
                            ? "bg-blue-500"
                            : record.status === "half-day"
                              ? "bg-yellow-500"
                              : "bg-purple-500"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="font-semibold text-foreground mb-4 text-sm">Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-100 border border-green-300" />
            <span className="text-muted-foreground">Present</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-100 border border-red-300" />
            <span className="text-muted-foreground">Absent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-100 border border-blue-300" />
            <span className="text-muted-foreground">Leave</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-300" />
            <span className="text-muted-foreground">Half-Day</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-100 border border-purple-300" />
            <span className="text-muted-foreground">Holiday</span>
          </div>
        </div>
      </div>
    </div>
  );
}
