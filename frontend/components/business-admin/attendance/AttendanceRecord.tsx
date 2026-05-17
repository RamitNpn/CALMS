"use client";

import { useState } from "react";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import moment from "moment";

import TablePagination from "@/components/shared/Pagination";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useToast } from "@/components/ui/toast";

import { useDeleteAttendance } from "@/hooks/business-admin/attendance-management/removeAttendance";

import { ViewAttendanceRecord } from "./ViewAttendanceRecord";
import { EditAttendanceRecord } from "./EditAttendanceRecord";
import { TAttendance } from "@/libs";
import Button from "@/components/ui/button";
import { AttendanceForm } from "./AttendanceForm";

interface AttendanceTableProps {
  attendances: TAttendance[];
  isLoading?: boolean;
  error?: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function AttendanceRecord({
  attendances,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
}: AttendanceTableProps) {
  const [open, setOpen] = useState(false);
  const [viewId, setViewId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<TAttendance | null>(null);

  const toast = useToast.getState();
  const { mutate: deleteAttendance } = useDeleteAttendance();

  const confirmDelete = () => {
    if (!itemToDelete) return;

    deleteAttendance(itemToDelete._id, {
      onSuccess: () => {
        toast.show({
          message: "Attendance deleted successfully",
          type: "success",
        });

        setItemToDelete(null);
      },
    });
  };

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="w-full h-[75vh] overflow-y-scroll">
      <div className="flex justify-end mb-2">
        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white text-[12px] px-4 py-2 hover:bg-indigo-700 transition cursor-pointer"
        >
          <Plus size={18} />
          Create Business Assets
        </Button>
      </div>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-800 uppercase text-sm">
            <th className="py-3 px-6 text-left">SN</th>
            <th className="py-3 px-6 text-left">Client Name</th>
            <th className="py-3 px-6 text-left">Client Email</th>
            <th className="py-3 px-6 text-left">User Type</th>
            <th className="py-3 px-6 text-left">Method</th>
            <th className="py-3 px-6 text-left">Check In</th>
            <th className="py-3 px-6 text-left">Check Out</th>
            <th className="py-3 px-6 text-left">Action</th>
          </tr>
        </thead>

        <tbody className="text-gray-700 text-sm">
          {attendances.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-6 text-center text-gray-500">
                No Attendance records found
              </td>
            </tr>
          ) : (
            attendances.map((att, index) => (
              <tr
                key={att._id}
                className="border-b border-gray-200 hover:bg-gray-100 transition"
              >
                {/* SN */}
                <td className="py-3 px-6">{(page - 1) * 10 + index + 1}</td>

                {/* CLIENT */}
                <td className="py-3 px-6 font-medium">{att.clientName}</td>

                <td className="py-3 px-6 font-medium">{att.clientEmail}</td>

                {/* USER TYPE */}
                <td className="py-3 px-6">{att.userType}</td>

                {/* METHOD */}
                <td className="py-3 px-6">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      att.method === "QR"
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {att.method}
                  </span>
                </td>

                {/* CHECK IN */}
                <td className="py-3 px-6">
                  {att.checkIn ? moment(att.checkIn).format("lll") : "-"}
                </td>

                {/* CHECK OUT */}
                <td className="py-3 px-6">
                  {att.checkOut ? moment(att.checkOut).format("lll") : "-"}
                </td>

                {/* ACTIONS */}
                <td className="py-3 px-6">
                  <div className="flex gap-2">
                    {/* VIEW */}
                    <button
                      onClick={() => setViewId(att._id)}
                      className="p-2 border rounded hover:bg-gray-200"
                    >
                      <Eye size={16} className="text-yellow-600" />
                    </button>

                    {/* EDIT */}
                    <button
                      onClick={() => setEditId(att._id)}
                      className="p-2 border rounded hover:bg-gray-200"
                    >
                      <Pencil size={16} className="text-green-600" />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => setItemToDelete(att)}
                      className="p-2 border rounded hover:bg-red-100"
                    >
                      <Trash2 size={16} className="text-red-600" />
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
      {editId && (
        <EditAttendanceRecord
          attendanceId={editId}
          onClose={() => setEditId(null)}
        />
      )}
      {open && <AttendanceForm onClose={() => setOpen(false)} />}

      {/* DELETE CONFIRM */}
      <ConfirmDialog
        open={itemToDelete !== null}
        title="Delete Attendance"
        message="Are you sure you want to delete this attendance record?"
        onConfirm={confirmDelete}
        onCancel={() => setItemToDelete(null)}
      />
    </div>
  );
}
