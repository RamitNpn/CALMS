"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import {
  useGetAllAttendance,
  useCreateAttendance,
  useUpdateAttendance,
  useDeleteAttendance,
} from "@/libs/api/attendance.api";
import { Button } from "@/components/shared/Button";
import { FormModal } from "@/components/shared/FormModal";
import { AttendanceForm } from "@/components/attendance/AttendanceForm";
import { AttendanceTable } from "@/components/attendance/AttendanceTable";
import { Attendance, CreateAttendanceInput } from "@/libs/types/attendance.types";

export function AttendancePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState<Attendance | null>(null);

  const { data: attendance = [], isLoading, error } = useGetAllAttendance();
  const createMutation = useCreateAttendance();
  const updateMutation = useUpdateAttendance(editingAttendance?._id || "");
  const deleteMutation = useDeleteAttendance();

  const handleOpenModal = (record?: Attendance) => {
    setEditingAttendance(record || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAttendance(null);
  };

  const handleSubmit = (data: CreateAttendanceInput) => {
    if (editingAttendance) {
      updateMutation.mutate(
        {
          checkIn: data.checkIn,
          checkOut: data.checkOut,
          method: data.method,
        },
        {
          onSuccess: () => handleCloseModal(),
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => handleCloseModal(),
      });
    }
  };

  const handleDelete = (record: Attendance) => {
    if (confirm("Are you sure you want to delete this attendance record?")) {
      deleteMutation.mutate(record._id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-600 mt-1">Manage attendance records</p>
        </div>
        <Button
          variant="primary"
          onClick={() => handleOpenModal()}
          className="gap-2"
        >
          <Plus size={20} />
          Record Attendance
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg p-6 border">
        <AttendanceTable
          attendance={attendance}
          isLoading={isLoading}
          error={error?.message}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      </div>

      {/* Form Modal */}
      <FormModal
        isOpen={isModalOpen}
        title={editingAttendance ? "Edit Attendance" : "Record Attendance"}
        onClose={handleCloseModal}
        size="lg"
      >
        <AttendanceForm
          initialData={editingAttendance}
          isLoading={createMutation.isPending || updateMutation.isPending}
          onSubmit={handleSubmit}
        />
      </FormModal>
    </div>
  );
}
