"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import {
  useGetAllStaff,
  useCreateStaff,
  useUpdateStaff,
  useDeleteStaff,
} from "@/libs/api/staff.api";
import { Button } from "@/components/shared/Button";
import { FormModal } from "@/components/shared/FormModal";
import { StaffForm } from "@/components/staff/StaffForm";
import { StaffTable } from "@/components/staff/StaffTable";
import { Staff, CreateStaffInput } from "@/libs/types/staff.types";

export function StaffPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  const { data: staffs = [], isLoading, error } = useGetAllStaff();
  const createMutation = useCreateStaff();
  const updateMutation = useUpdateStaff(editingStaff?._id || "");
  const deleteMutation = useDeleteStaff();

  const handleOpenModal = (staff?: Staff) => {
    setEditingStaff(staff || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  const handleSubmit = (data: CreateStaffInput) => {
    if (editingStaff) {
      updateMutation.mutate(
        { ...data, tenantId: editingStaff.tenantId },
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

  const handleDelete = (staff: Staff) => {
    if (confirm(`Are you sure you want to delete ${staff.name}?`)) {
      deleteMutation.mutate(staff._id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Members</h1>
          <p className="text-gray-600 mt-1">Manage all your staff members</p>
        </div>
        <Button
          variant="primary"
          onClick={() => handleOpenModal()}
          className="gap-2"
        >
          <Plus size={20} />
          Add Staff
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg p-6 border">
        <StaffTable
          staffs={staffs}
          isLoading={isLoading}
          error={error?.message}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      </div>

      {/* Form Modal */}
      <FormModal
        isOpen={isModalOpen}
        title={editingStaff ? "Edit Staff" : "Add New Staff"}
        onClose={handleCloseModal}
        size="lg"
      >
        <StaffForm
          initialData={editingStaff}
          isLoading={createMutation.isPending || updateMutation.isPending}
          onSubmit={handleSubmit}
        />
      </FormModal>
    </div>
  );
}
