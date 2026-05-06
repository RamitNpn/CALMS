"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import {
  useGetAllSchedules,
  useCreateSchedule,
  useUpdateSchedule,
  useDeleteSchedule,
} from "@/libs/api/schedule.api";
import { Button } from "@/components/shared/Button";
import { FormModal } from "@/components/shared/FormModal";
import { ScheduleForm } from "@/components/schedule/ScheduleForm";
import { ScheduleTable } from "@/components/schedule/ScheduleTable";
import { Schedule, CreateScheduleInput } from "@/libs/types/schedule.types";

export function SchedulePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  const { data: schedules = [], isLoading, error } = useGetAllSchedules();
  const createMutation = useCreateSchedule();
  const updateMutation = useUpdateSchedule(editingSchedule?._id || "");
  const deleteMutation = useDeleteSchedule();

  const handleOpenModal = (schedule?: Schedule) => {
    setEditingSchedule(schedule || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSchedule(null);
  };

  const handleSubmit = (data: CreateScheduleInput) => {
    if (editingSchedule) {
      updateMutation.mutate(data, {
        onSuccess: () => handleCloseModal(),
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => handleCloseModal(),
      });
    }
  };

  const handleDelete = (schedule: Schedule) => {
    if (confirm(`Are you sure you want to delete this schedule?`)) {
      deleteMutation.mutate(schedule._id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedules</h1>
          <p className="text-gray-600 mt-1">Manage all schedules and appointments</p>
        </div>
        <Button
          variant="primary"
          onClick={() => handleOpenModal()}
          className="gap-2"
        >
          <Plus size={20} />
          New Schedule
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg p-6 border">
        <ScheduleTable
          schedules={schedules}
          isLoading={isLoading}
          error={error?.message}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      </div>

      {/* Form Modal */}
      <FormModal
        isOpen={isModalOpen}
        title={editingSchedule ? "Edit Schedule" : "Create New Schedule"}
        onClose={handleCloseModal}
        size="lg"
      >
        <ScheduleForm
          initialData={editingSchedule}
          isLoading={createMutation.isPending || updateMutation.isPending}
          onSubmit={handleSubmit}
        />
      </FormModal>
    </div>
  );
}
