"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAttendanceSchema, CreateAttendanceInput } from "@/libs/types/attendance.types";
import { useGetAllBusinesses } from "@/libs/api/business.api";
import { useGetAllStaff } from "@/libs/api/staff.api";
import { useGetAllClients } from "@/libs/api/client.api";
import { FormField } from "@/components/shared/FormField";
import { Button } from "@/components/shared/Button";

interface AttendanceFormProps {
  initialData?: any;
  isLoading: boolean;
  onSubmit: (data: CreateAttendanceInput) => void;
}

export function AttendanceForm({
  initialData,
  isLoading,
  onSubmit,
}: AttendanceFormProps) {
  const { data: businesses = [] } = useGetAllBusinesses();
  const { data: staffs = [] } = useGetAllStaff();
  const { data: clients = [] } = useGetAllClients();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateAttendanceInput>({
    resolver: zodResolver(createAttendanceSchema),
    defaultValues: initialData,
  });

  const userType = watch("userType");

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
        label="User Type"
        name="userType"
        type="select"
        register={register}
        errors={errors}
        required
        options={[
          { value: "STAFF", label: "Staff" },
          { value: "CLIENT", label: "Client" },
        ]}
      />

      <FormField
        label={userType === "STAFF" ? "Staff Member" : "Client/Student"}
        name="userId"
        type="select"
        register={register}
        errors={errors}
        required
        options={
          userType === "STAFF"
            ? staffs.map((s) => ({ value: s._id, label: s.name }))
            : clients.map((c) => ({ value: c._id, label: c.name }))
        }
      />

      <FormField
        label="Date"
        name="date"
        type="date"
        register={register}
        errors={errors}
        required
      />

      <FormField
        label="Check-in Time"
        name="checkIn"
        type="datetime-local"
        register={register}
        errors={errors}
      />

      <FormField
        label="Check-out Time"
        name="checkOut"
        type="datetime-local"
        register={register}
        errors={errors}
      />

      <FormField
        label="Method"
        name="method"
        type="select"
        register={register}
        errors={errors}
        options={[
          { value: "QR", label: "QR Code" },
          { value: "MANUAL", label: "Manual" },
        ]}
      />

      <div className="flex gap-2 justify-end pt-4">
        <Button variant="outline" type="reset">
          Reset
        </Button>
        <Button variant="primary" type="submit" isLoading={isLoading}>
          {initialData ? "Update" : "Record"} Attendance
        </Button>
      </div>
    </form>
  );
}
