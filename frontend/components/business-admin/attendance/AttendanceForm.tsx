"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createAttendanceSchema,
  TCreateAttendanceSchema,
} from "@/libs/validation/attendance.validation";

import { useToast } from "@/components/ui/toast";
import { attendanceApi } from "@/libs";

type AttendanceFormProps = {
  onClose?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export function AttendanceForm({ onClose, size = "lg" }: AttendanceFormProps) {
  const storedData = JSON.parse(localStorage.getItem("auth-data") || "{}");

  const businessId = storedData?.business_id;

  const toast = useToast.getState();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCreateAttendanceSchema>({
    resolver: zodResolver(createAttendanceSchema),
    defaultValues: {
      business_id: businessId,
      clientName: "",
      clientEmail: "",
      checkIn: undefined,
      checkOut: undefined,
      userType: "",
      method: undefined,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: attendanceApi.createAttendance,
    onSuccess: () => {
      toast.show({
        message: "Attendance created successfully",
        type: "success",
      });
      reset();
      onClose?.();
    },

    onError: (err: unknown) => {
      toast.show({
        message: (err as { message?: string })?.message || "Failed to create attendance",
        type: "error",
      });
    },
  });

  const onSubmit = (data: TCreateAttendanceSchema) => {
    mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={clsx(
          "bg-white rounded-lg shadow-lg w-full h-auto overflow-y-auto",
          {
            "max-w-md": size === "sm",
            "max-w-lg": size === "md",
            "max-w-3xl": size === "lg",
            "max-w-5xl": size === "xl",
          },
        )}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-100 sticky top-0">
          <h2 className="text-xl font-semibold">Create Attendance Record</h2>

          <button onClick={onClose}>
            <X className="text-red-500 border border-gray-200 cursor-pointer hover:bg-red-500 hover:text-white rounded" />
          </button>
        </div>

        {/* FORM */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <p className="text-xl font-semibold">Attendance Information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CLIENT NAME */}
              <div>
                <label className="block text-sm font-medium">
                  Client Name <span className="text-red-500">*</span>
                </label>

                <input
                  {...register("clientName")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />

                {errors.clientName && (
                  <p className="text-red-500 text-sm">
                    {errors.clientName.message}
                  </p>
                )}
              </div>

              {/* CLIENT EMAIL */}
              <div>
                <label className="block text-sm font-medium">
                  Client Email <span className="text-red-500">*</span>
                </label>

                <input
                  {...register("clientEmail")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />

                {errors.clientEmail && (
                  <p className="text-red-500 text-sm">
                    {errors.clientEmail.message}
                  </p>
                )}
              </div>

              {/* USER TYPE */}
              <div>
                <label className="block text-sm font-medium">
                  User Type <span className="text-red-500">*</span>
                </label>

                <input
                  {...register("userType")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />

                {errors.userType && (
                  <p className="text-red-500 text-sm">
                    {errors.userType.message}
                  </p>
                )}
              </div>

              {/* CHECK IN */}
              <div>
                <label className="block text-sm font-medium">Check In</label>

                <input
                  type="date"
                  {...register("checkIn")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
              </div>

              {/* CHECK OUT */}
              <div>
                <label className="block text-sm font-medium">Check Out</label>

                <input
                  type="date"
                  {...register("checkOut")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
              </div>

              {/* METHOD */}
              <div>
                <label className="block text-sm font-medium">
                  Method <span className="text-red-500">*</span>
                </label>

                <select
                  {...register("method")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                >
                  <option value="Manual">Manual</option>
                  <option value="QR">QR</option>
                </select>
              </div>
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
                className="px-5 py-2 bg-gray-700 text-white rounded"
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
