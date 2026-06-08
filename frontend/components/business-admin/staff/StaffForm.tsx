"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";
import clsx from "clsx";
import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TCreateStaff } from "@/libs/types/staff.types";
import { createStaffSchema, staffApi } from "@/libs";

type StaffFormProps = {
  onClose?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export function StaffForm({ onClose, size = "lg" }: StaffFormProps) {
  const toast = useToast.getState();
  const storedData = JSON.parse(localStorage.getItem("auth-data") || "{}");

  const businessId = storedData?.business_id || "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createStaffSchema),
    defaultValues: {
      business_id: businessId,
      userName: "",
      userEmail: "",
      userPhone: "",
      gender: undefined,
      profile: "",
      role: "staff",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: staffApi.createStaff,
    onSuccess: (data: any) => {
      toast.show({
        message: data?.message || "Staff created successfully",
        type: "success",
      });
      reset();
      onClose?.();
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.error || err?.message || "Failed to create staff";
      toast.show({
        message: errorMessage,
        type: "error",
      });
    },
  });

  const onSubmit = (data: TCreateStaff) => {
    const formData = new FormData();

    formData.append("business_id", businessId);
    formData.append("userName", data.userName);
    formData.append("userEmail", data.userEmail);
    formData.append("userPhone", data.userPhone);
    formData.append("role", data.role);

    if (data.gender) {
      formData.append("gender", data.gender);
    }

    if (data.profile?.[0]) {
      formData.append("profile", data.profile[0]);
    }

    mutate(formData as unknown as TCreateStaff);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={clsx(
          "bg-white rounded-lg shadow-lg h-auto overflow-y-auto w-full",
          {
            "max-w-md": size === "sm",
            "max-w-lg": size === "md",
            "max-w-3xl": size === "lg",
            "max-w-5xl": size === "xl",
          },
        )}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Flowdesk - Create Staff
          </h2>

          <button onClick={onClose} className="p-1 rounded border border-gray-200 hover:bg-gray-200 transition cursor-pointer">
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-[13px]">
            {/* TITLE */}
            <div>
              <p className="text-xl font-semibold">Create Staff Account</p>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Staff NAME */}
              <div>
                <label className="block text-sm font-medium">
                  Staff Name <span className="text-red-500">*</span>
                </label>

                <input
                  {...register("userName", {
                    required: "Staff name is required",
                  })}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />

                {errors.userName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.userName.message}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium">
                  Staff Email <span className="text-red-500">*</span>
                </label>

                <input
                  type="email"
                  {...register("userEmail", {
                    required: "Staff email is required",
                  })}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />

                {errors.userEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.userEmail.message}
                  </p>
                )}
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-sm font-medium">
                  Staff Phone <span className="text-red-500">*</span>
                </label>

                <input
                  {...register("userPhone", {
                    required: "Phone number is required",
                  })}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />

                {errors.userPhone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.userPhone.message}
                  </p>
                )}
              </div>

              {/* GENDER */}
              <div>
                <label className="block text-sm font-medium">Gender</label>

                <select
                  {...register("gender")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* PROFILE */}
            <div>
              <label className="block text-sm font-medium">Profile Image</label>

              <input
                {...register("profile")}
                type="file"
                className="w-full mt-1 cursor-pointer border border-gray-200 hover:border-green-400 p-2 rounded outline-none"
              />
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => reset()}
                className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 bg-gray-700 text-white rounded cursor-pointer"
              >
                {isPending ? "Creating..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
