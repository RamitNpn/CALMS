"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import moment from "moment";

import TablePagination from "@/components/shared/Pagination";
import { useToast } from "@/components/ui/toast";

import { ViewAttendanceRecord } from "./ViewAttendanceRecord";
import { EditAttendanceRecord } from "./EditAttendanceRecord";
import { attendanceApi } from "@/libs";
import { TUser } from "@/libs/types/user.types";

interface AttendanceTableProps {
  users: TUser[];
  isLoading?: boolean;
  error?: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function AttendanceRecord({
  users,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
}: AttendanceTableProps) {
  const [viewId, setViewId] = useState<string | null>(null);
  const [editRecordId, setEditRecordId] = useState<string | null>(null);

  console.log("Is attendance Id set in state?:", editRecordId);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [businessId] = useState<string>(() => {
    const storedData = JSON.parse(localStorage.getItem("auth-data") || "{}");
    return storedData?.business_id;
  });

  const toast = useToast.getState();

  const allSelected = users?.length > 0 && selectedIds.length === users.length;

  const isIndeterminate =
    selectedIds.length > 0 && selectedIds.length < users.length;

  const handleBulkCreateAttendance = async () => {
    if (selectedIds.length === 0) return;

    try {
      await attendanceApi.createAttendance({
        userIds: selectedIds,
        business_id: businessId,
        status: "Present",
        checkIn: new Date().toISOString(),
        checkOut: undefined,
        date: new Date().toISOString(),
      });

      toast.show({
        message: "Attendance created for selected users",
        type: "success",
      });

      setSelectedIds([]);
    } catch (error) {
      toast.show({
        message: "Failed to create attendance",
        type: "error",
      });
    }
  };

  const hasAnyAttendance = users?.some((u: any) => u.status || u.checkIn);

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="w-full h-[75vh] overflow-y-scroll">
      <div className="flex justify-end mb-2">
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {selectedIds.length} selected
              </span>
            )}
            <button
              type="button"
              disabled={selectedIds.length === 0}
              className="flex items-center gap-2 bg-indigo-600 text-white text-[12px] px-4 py-2 hover:bg-indigo-700 transition cursor-pointer rounded"
              onClick={handleBulkCreateAttendance}
            >
              Create Attendance
            </button>
          </div>
        )}
      </div>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-800 text-sm leading-normal">
            <th className="py-2 px-2 text-left">
              <input
                type="checkbox"
                checked={allSelected}
                disabled={hasAnyAttendance}
                ref={(el) => {
                  if (el) el.indeterminate = isIndeterminate;
                }}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedIds((users ?? []).map((u: any) => u._id));
                  } else {
                    setSelectedIds([]);
                  }
                }}
                className="w-4 h-4"
              />
            </th>
            <th className="py-2 px-2 text-left">SN</th>
            <th className="py-2 px-2 text-left">User Name</th>
            <th className="py-2 px-2 text-left">User Email</th>
            <th className="py-2 px-2 text-left">User Type</th>
            <th className="py-2 px-2 text-left">Status</th>
            <th className="py-2 px-2 text-left">Check In</th>
            <th className="py-2 px-2 text-left">Check Out</th>
            <th className="py-2 px-2 text-left">Action</th>
          </tr>
        </thead>

        <tbody className="text-gray-700 text-sm">
          {users?.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-6 text-center text-gray-500">
                No Attendance records found
              </td>
            </tr>
          ) : (
            users.map((att: any, index: number) => (
              <tr
                key={att._id}
                className="border-b border-gray-200 hover:bg-gray-100 transition"
              >
                <td className="py-2 pl-2 text-left">
                  <input
                    type="checkbox"
                    disabled={!!att.attendanceId}
                    checked={
                      !!att.attendanceId || selectedIds.includes(att._id)
                    }
                    onChange={() => {
                      setSelectedIds((prev) =>
                        prev.includes(att._id)
                          ? prev.filter((id) => id !== att._id)
                          : [...prev, att._id],
                      );
                    }}
                    className="w-4 h-4"
                  />
                </td>
                {/* SN */}
                <td className="py-2 pr-2 text-left">
                  {(page - 1) * 10 + index + 1}
                </td>

                {/* USER */}
                <td className="py-2 px-2 text-left">{att.userName}</td>

                <td className="py-2 px-2 text-left">{att.userEmail}</td>

                {/* USER TYPE */}
                <td className="py-2 px-2 text-left capitalize">{att.role}</td>

                <td className="py-2 px-2 text-left">
                  {att.status ? (
                    <span className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs">
                      {att.status}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>

                {/* CHECK IN */}
                <td className="py-2 px-2 text-left">
                  {att.checkIn ? moment(att.checkIn).format("lll") : "-"}
                </td>

                {/* CHECK OUT */}
                <td className="py-2 px-2 text-left">
                  {att.checkOut ? moment(att.checkOut).format("lll") : "-"}
                </td>

                {/* ACTIONS */}
                <td className="py-2 px-2 text-left">
                  <div className="flex items-center gap-2">
                    {/* EDIT */}
                    <button
                      onClick={() => {
                        console.log("clicked row:", att);
                        console.log("attendanceId:", att.attendanceId);

                        setEditRecordId(att.attendanceId);
                      }}
                      disabled={!att.attendanceId}
                      className="p-2 border border-gray-200 rounded hover:bg-gray-200 transition cursor-pointer"
                    >
                      <Pencil size={16} className="text-green-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-4">
          <TablePagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}

      {/* VIEW MODAL */}
      {viewId && (
        <ViewAttendanceRecord
          attendanceId={viewId}
          open={!!viewId}
          onClose={() => setViewId(null)}
        />
      )}

      {/* EDIT MODAL */}
      {editRecordId && (
        <EditAttendanceRecord
          attendanceId={editRecordId}
          onClose={() => setEditRecordId(null)}
        />
      )}
    </div>
  );
}
