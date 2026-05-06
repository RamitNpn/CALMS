"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createScheduleSchema, CreateScheduleInput } from "@/libs/types/schedule.types";
import { useGetAllBusinesses } from "@/libs/api/business.api";
import { useGetAllStaff } from "@/libs/api/staff.api";
import { useGetAllClients } from "@/libs/api/client.api";
import { FormField } from "@/components/shared/FormField";
import { Button } from "@/components/shared/Button";

interface ScheduleFormProps {
  initialData?: any;
  isLoading: boolean;
  onSubmit: (data: CreateScheduleInput) => void;
}

export function ScheduleForm({
  initialData,
  isLoading,
  onSubmit,
}: ScheduleFormProps) {
  const { data: businesses = [] } = useGetAllBusinesses();
  const { data: staffs = [] } = useGetAllStaff();
  const { data: clients = [] } = useGetAllClients();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateScheduleInput>({
    resolver: zodResolver(createScheduleSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        label="Business"
        name="tenantId"
        type="select"
        register={register}
        errors={errors}
        required
        options={businesses.map((b) => ({ value: b._id, label: b.name }))}
      />

      <FormField
        label="Title"
        name="title"
        placeholder="Enter schedule title"
        register={register}
        errors={errors}
      />

      <FormField
        label="Staff Member"
        name="staffId"
        type="select"
        register={register}
        errors={errors}
        options={staffs.map((s) => ({ value: s._id, label: s.name }))}
      />

      <FormField
        label="Client/Student"
        name="clientId"
        type="select"
        register={register}
        errors={errors}
        options={clients.map((c) => ({ value: c._id, label: c.name }))}
      />

      <FormField
        label="Start Time"
        name="startTime"
        type="datetime-local"
        register={register}
        errors={errors}
        required
      />

      <FormField
        label="End Time"
        name="endTime"
        type="datetime-local"
        register={register}
        errors={errors}
        required
      />

      <FormField
        label="Status"
        name="status"
        type="select"
        register={register}
        errors={errors}
        options={[
          { value: "PENDING", label: "Pending" },
          { value: "CONFIRMED", label: "Confirmed" },
          { value: "CANCELLED", label: "Cancelled" },
        ]}
      />

      <div className="flex gap-2 justify-end pt-4">
        <Button variant="outline" type="reset">
          Reset
        </Button>
        <Button variant="primary" type="submit" isLoading={isLoading}>
          {initialData ? "Update" : "Create"} Schedule
        </Button>
      </div>
    </form>
  );
}
