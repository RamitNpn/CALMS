"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  updateAttendanceSchema,
  TUpdateAttendanceSchema,
} from "@/libs/validation/attendance.validation";

import { useAttendanceById } from "@/hooks/business-admin/attendance-management/getAttendanceById";

import { useToast } from "@/components/ui/toast";
import { attendanceApi } from "@/libs";
import Image from "next/image";
import FormHeader from "@/components/shared/FormHeader";
import { toLocalDateTimeInput } from "@/utils/dateTime.helper";

type Props = {
  attendanceId: string;
  onClose: () => void;
  onSuccess?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export function EditAttendanceRecord({
  attendanceId,
  onClose,
  onSuccess,
  size = "lg",
}: Props) {
  const toast = useToast.getState();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useAttendanceById(attendanceId);

  const attendance = data?.data ?? data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TUpdateAttendanceSchema>({
    resolver: zodResolver(updateAttendanceSchema),

    defaultValues: {
      _id: attendanceId,
      checkIn: "",
      checkOut: "",
      status: undefined,
    },
  });

useEffect(() => {
  if (!attendanceId || !attendance) return;

  reset({
    _id: attendanceId,

    checkIn: attendance.checkIn
      ? toLocalDateTimeInput(attendance.checkIn)
      : "",

    checkOut: attendance.checkOut
      ? toLocalDateTimeInput(attendance.checkOut)
      : "",

    status: attendance.status ?? "Present",
  });
}, [attendanceId, attendance, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      attendanceId,
      data,
    }: {
      attendanceId: string;
      data: Partial<TUpdateAttendanceSchema>;
    }) => attendanceApi.updateAttendanceApi(attendanceId, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendances"] });
      toast.show({
        message: "Attendance updated successfully",
        type: "success",
      });

      onSuccess?.();

      onClose();
    },

    onError: (err) => {
      console.error(err);

      toast.show({
        message: "Failed to update attendance",
        type: "error",
      });
    },
  });

  const onSubmit = (values: TUpdateAttendanceSchema) => {
    const payload = {
      _id: attendanceId,
      checkIn: values.checkIn,
      checkOut: values.checkOut,
      status: values.status,
    };

    mutate({
      attendanceId,
      data: payload,
    });
  };

  if (isLoading) return <div className="p-6">Loading attendance...</div>;

  if (isError)
    return <div className="p-6 text-red-500">Failed to load attendance</div>;

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
        <FormHeader onClose={() => onClose?.()} />

        {/* FORM */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <p className="text-xl font-semibold">Edit Attendance Record</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CHECK IN */}
              <div>
                <label className="block text-sm font-medium">Check In</label>

                <input
                  type="datetime-local"
                  {...register("checkIn")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />

                {errors.checkIn && (
                  <p className="text-red-500 text-sm">
                    {errors.checkIn.message}
                  </p>
                )}
              </div>

              {/* CHECK OUT */}
              <div>
                <label className="block text-sm font-medium">Check Out</label>

                <input
                  type="datetime-local"
                  {...register("checkOut")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />

                {errors.checkOut && (
                  <p className="text-red-500 text-sm">
                    {errors.checkOut.message}
                  </p>
                )}
              </div>

              {/* STATUS */}
              <div>
                <label className="block text-sm font-medium">Status</label>

                <select
                  {...register("status")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Leave">Leave</option>
                  <option value="Late">Late</option>
                </select>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer hover:bg-red-600"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 disabled:bg-blue-400"
              >
                {isPending ? "Updating..." : "Update Attendance"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
