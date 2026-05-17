"use staff";

import { Trash2, Eye, Pencil, Plus } from "lucide-react";
import moment from "moment";
import TablePagination from "@/components/shared/Pagination";
import { useState } from "react";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { useToast } from "@/components/ui/toast";
import { TStaff } from "@/libs";
import { useDeleteStaff } from "@/hooks/business-admin/staff-management/removeStaffData";
import { ViewStaffRecord } from "./ViewStaffRecord";
import { EditstaffForm } from "./EditStaffRecord.";
import Button from "@/components/ui/button";
import { StaffForm } from "./StaffForm";

interface StaffTableProps {
  staffs: TStaff[];
  isLoading?: boolean;
  error?: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function StaffRecord({
  staffs,
  isLoading,
  error,
  page,
  totalPages,
  onPageChange,
}: StaffTableProps) {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);

  const { mutate: deleteStaff } = useDeleteStaff();
  const [itemToRemove, setItemToRemove] = useState<TStaff | null>(null);
  const toast = useToast.getState();

  const confirmRemove = () => {
    if (!itemToRemove) return;

    console.log(itemToRemove._id);

    deleteStaff(itemToRemove._id, {
      onSuccess: () => {
        toast.show({
          message: "Staff deleted successfully",
          type: "success",
        });

        setItemToRemove(null);
      },
    });
  };

  if (isLoading) {
    return <p className="p-4">Loading...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  return (
    <div className="w-full">
      <div className="flex justify-end mb-2">
        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white text-[12px] px-4 py-2 hover:bg-indigo-700 transition cursor-pointer"
        >
          <Plus size={18} />
          Create Business Clients
        </Button>
      </div>
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-800 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">SN</th>
            <th className="py-3 px-6 text-left">Staff Name</th>
            <th className="py-3 px-6 text-left">Email</th>
            <th className="py-3 px-6 text-left">Phone</th>
            <th className="py-3 px-6 text-left">Gender</th>
            <th className="py-3 px-6 text-left">Role</th>
            <th className="py-3 px-6 text-left">Created At</th>
            <th className="py-3 px-6 text-left">Action</th>
          </tr>
        </thead>

        <tbody className="text-gray-700 text-sm">
          {staffs.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-6 px-6 text-center text-gray-500">
                No Staff found
              </td>
            </tr>
          ) : (
            staffs.map((staff, index) => (
              <tr
                key={staff._id}
                className="border-b border-gray-200 hover:bg-gray-100 transition"
              >
                <td className="py-3 px-6 text-left">
                  {(page - 1) * 10 + index + 1}
                </td>

                <td className="py-3 px-6 text-left font-medium">
                  {staff.userName}
                </td>

                <td className="py-3 px-6 text-left">{staff.userEmail}</td>

                <td className="py-3 px-6 text-left">{staff.userPhone}</td>

                <td className="py-3 px-6 text-left capitalize">
                  {staff.gender || "-"}
                </td>

                <td className="py-3 px-6 text-left capitalize">{staff.role}</td>

                <td className="py-3 px-6 text-left">
                  {moment(staff.createdAt).format("lll")}
                </td>

                <td className="py-3 px-6 text-left">
                  <div className="flex items-center gap-2">
                    {/* VIEW */}
                    <button
                      onClick={() => setViewId(staff._id)}
                      className="p-2 border border-gray-200 rounded hover:bg-gray-200 transition cursor-pointer"
                    >
                      <Eye size={16} className="text-yellow-600" />
                    </button>

                    {/* EDIT */}
                    <button
                      onClick={() => setEditId(staff._id)}
                      className="p-2 border border-gray-200 rounded hover:bg-gray-200 transition cursor-pointer"
                    >
                      <Pencil size={16} className="text-green-600" />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => setItemToRemove(staff)}
                      className="p-2 border border-gray-200 rounded hover:bg-red-100 text-red-600 transition cursor-pointer"
                    >
                      <Trash2 size={16} />
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
        <ViewStaffRecord
          staffId={viewId}
          open={!!viewId}
          onClose={() => setViewId(null)}
        />
      )}

      {editId && (
        <EditstaffForm staffId={editId} onClose={() => setEditId(null)} />
      )}

      {open && <StaffForm onClose={() => setOpen(false)} />}


      {/* DELETE CONFIRM */}
      <ConfirmDialog
        open={itemToRemove !== null}
        title="Remove Staff"
        message="Are you sure you want to remove this staff member?"
        onConfirm={confirmRemove}
        onCancel={() => setItemToRemove(null)}
      />
    </div>
  );
}
