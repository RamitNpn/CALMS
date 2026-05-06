"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createStaffSchema, CreateStaffInput } from "@/libs/types/staff.types";
import { useGetAllBusinesses } from "@/libs/api/business.api";
import { FormField } from "@/components/shared/FormField";
import { Button } from "@/components/shared/Button";

interface StaffFormProps {
  initialData?: any;
  isLoading: boolean;
  onSubmit: (data: CreateStaffInput) => void;
}

export function StaffForm({
  initialData,
  isLoading,
  onSubmit,
}: StaffFormProps) {
  const { data: businesses = [] } = useGetAllBusinesses();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateStaffInput>({
    resolver: zodResolver(createStaffSchema),
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
        label="Name"
        name="name"
        placeholder="Enter staff name"
        register={register}
        errors={errors}
        required
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="Enter email address"
        register={register}
        errors={errors}
        required
      />

      <FormField
        label="Phone"
        name="phone"
        type="tel"
        placeholder="Enter phone number"
        register={register}
        errors={errors}
      />

      <FormField
        label="Role"
        name="role"
        type="select"
        register={register}
        errors={errors}
        required
        options={[
          { value: "SUPER_ADMIN", label: "Super Admin" },
          { value: "ADMIN", label: "Admin" },
          { value: "STAFF", label: "Staff" },
          { value: "CLIENT", label: "Client" },
        ]}
      />

      {!initialData && (
        <FormField
          label="Password"
          name="password"
          type="password"
          placeholder="Enter password (min 6 characters)"
          register={register}
          errors={errors}
          required
        />
      )}

      <div className="flex gap-2 justify-end pt-4">
        <Button variant="outline" type="reset">
          Reset
        </Button>
        <Button variant="primary" type="submit" isLoading={isLoading}>
          {initialData ? "Update" : "Create"} Staff
        </Button>
      </div>
    </form>
  );
}
