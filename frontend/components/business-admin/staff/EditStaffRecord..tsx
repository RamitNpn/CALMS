"use staff";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { staffApi } from "@/libs/api/staff.api";
import Image from "next/image";
import { updateStaffSchema } from "@/libs";
import { useStaffById } from "@/hooks/business-admin/staff-management/getStaffDataById";

type StaffForm = z.infer<typeof updateStaffSchema>;

type Props = {
  staffId: string;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export function EditstaffForm({ staffId, onClose, size = "lg" }: Props) {
  const { data, isLoading, isError } = useStaffById(staffId);
  const staff = data?.data ?? data;

  const storedData = JSON.parse(localStorage.getItem("auth-data") || "{}");
  const businessId = storedData?.business_id || "";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<StaffForm>({
    resolver: zodResolver(updateStaffSchema),
    defaultValues: {
      _id: staffId,
      business_id: businessId,
      userName: "",
      userEmail: "",
      userPhone: "",
      userPassword: "",
      profile: "",
      gender: undefined,
      role: "staff",
    },
  });

  useEffect(() => {
    if (!staffId || !staff) return;

    reset({
      _id: staffId,
      business_id: staff.business_id,
      userName: staff.userName ?? "",
      userEmail: staff.userEmail ?? "",
      userPhone: staff.userPhone ?? "",
      userPassword: "",
      profile: "",
      gender: staff.gender ?? undefined,
      role: staff.role ?? "staff",
    });
  }, [staffId, staff, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      staffId,
      formData,
    }: {
      staffId: string;
      formData: FormData;
    }) => staffApi.updateStaffApi(staffId, formData),
    onSuccess: () => onClose(),
    onError: (err) => {
      console.error("Update failed:", err);
    },
  });

  const onSubmit = (values: StaffForm) => {
    const formData = new FormData();

    formData.append("_id", staffId);

    if (values.userName) formData.append("userName", values.userName);
    if (values.userEmail) formData.append("userEmail", values.userEmail);
    if (values.userPhone) formData.append("userPhone", values.userPhone);
    if (values.role) formData.append("role", values.role);

    if (values.userPassword?.trim()) {
      formData.append("userPassword", values.userPassword);
    }

    if (values.gender) {
      formData.append("gender", values.gender);
    }

    if (values.profile?.[0]) {
      formData.append("profile", values.profile[0]);
    }

    mutate({ staffId, formData });
  };

  if (isLoading) return <div className="p-6">Loading staff...</div>;
  if (isError)
    return <div className="p-6 text-red-500">Failed to load staff</div>;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={clsx(
          "bg-white rounded-lg shadow-lg h-[90vh] overflow-y-auto w-full",
          {
            "max-w-md": size === "sm",
            "max-w-lg": size === "md",
            "max-w-3xl": size === "lg",
            "max-w-5xl": size === "xl",
          },
        )}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Flowdesk - Edit Staff Details
          </h2>

          <button onClick={onClose}>
            <X className="text-red-500 cursor-pointer" />
          </button>
        </div>

        {/* FORM */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <p className="text-xl font-semibold">Edit Staff Account</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* USER NAME */}
              <div>
                <label className="block text-sm font-medium">
                  Staff Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("userName")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
                {errors.userName && (
                  <p className="text-red-500 text-sm">
                    {errors.userName.message}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register("userEmail")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-sm font-medium">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("userPhone")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  {...register("userPassword")}
                  placeholder="Leave empty if unchanged...."
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
              </div>

              {/* GENDER */}
              <div>
                <label className="block text-sm font-medium">Gender</label>
                <select
                  {...register("gender")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* PROFILE */}
              <div>
                <p className="text-sm font-medium mb-1">Profile Image</p>
                {staff?.profile && (
                  <Image
                    src={staff.profile}
                    className="w-20 h-20 rounded mb-2"
                    width={80}
                    height={80}
                    alt="Profile"
                  />
                )}
                <input
                  type="file"
                  onChange={(e) => setValue("profile", e.target.files)}
                />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 bg-blue-600 text-white rounded cursor-pointer"
              >
                {isPending ? "Updating..." : "Update staff"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
