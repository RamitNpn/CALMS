"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";
import clsx from "clsx";

import { useBusinessById } from "@/hooks/super-admin/business-records/getBusinessRecordById";
import { businessApi } from "@/libs/api/business.api";
import { TAdminUpdateBusinessSchema, updateAdminBusinessSchema } from "@/libs";
import { X } from "lucide-react";


type BusinessFormProps = {
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
  businessId: string;
};

export function EditBusinessForm({
  onClose,
  size = "lg",
  businessId,
}: BusinessFormProps) {
  const toast = useToast.getState();
  const { data, isLoading, isError } = useBusinessById(businessId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TAdminUpdateBusinessSchema>({
    resolver: zodResolver(updateAdminBusinessSchema),
    defaultValues: {
      businessName: "",
      operatorName: "",
      operatorEmail: "",
      operatorPassword: "",
      businessType: "",
      role: "business",
      teams: "",
      branch: {
        name: "",
        location: "",
      },
      package: "starter",
      services: [],
      status: true,
      payment_status: false,
      payment_initiation: "",
    },
  });

  // ✅ SAFE RESET LOGIC

  const business = data;
  useEffect(() => {
    if (!businessId || !business) return;

    console.log("RESETTING FORM WITH:", business);

    reset({
      _id: business._id,
      businessName: business.businessName ?? "",
      operatorName: business.operatorName ?? "",
      operatorEmail: business.operatorEmail ?? "",
      operatorPassword: "",
      businessType: business.businessType ?? "",
      role: "business",
      teams: business.teams ?? "",
      branch: {
        name: business.branch?.name ?? "",
        location: business.branch?.location ?? "",
      },
      package: business.package ?? "starter",
      services: business.services ?? [],
      status: business.status ?? true,
      payment_status: business.payment_status ?? false,
      payment_initiation: business.payment_initiation
        ? new Date(business.payment_initiation).toISOString().split("T")[0]
        : "",
    });
  }, [businessId, business, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: TAdminUpdateBusinessSchema) =>
      businessApi.updateBusinessApi(businessId, payload),
    onSuccess: (data: any) => {
      toast.show({
        message: data?.message || "Business updated successfully",
        type: "success",
      });
      onClose();
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.error || err?.message || "Failed to update business";
      toast.show({
        message: errorMessage,
        type: "error",
      });
    },
  });

  const onSubmit = (values: TAdminUpdateBusinessSchema) => {
    mutate({
      ...values,
      _id: businessId,
      operatorPassword: values.operatorPassword || undefined,
    });
  };

  if (isLoading) return <div className="p-6">Loading business...</div>;
  if (isError)
    return <div className="p-6 text-red-500">Failed to load business</div>;

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
            Flowdesk - Edit Business Details
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X
              size={24}
              className="text-red-400 cursor-pointer border border-gray-200 rounded"
            />
          </button>
        </div>

        {/* FORM */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <p className="text-xl font-semibold">Edit Business Account</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("businessName")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
                {errors.businessName && (
                  <p className="text-red-500 text-sm">
                    {errors.businessName.message}
                  </p>
                )}
              </div>

              {/* Business Type */}
              <div>
                <label className="block text-sm font-medium">
                  Business Type <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("businessType")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
              </div>

              {/* Operator Name */}
              <div>
                <label className="block text-sm font-medium">
                  Operator Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("operatorName")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
              </div>

              {/* Operator Email */}
              <div>
                <label className="block text-sm font-medium">
                  Operator Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register("operatorEmail")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium">
                  Operator Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="New password if any..."
                  {...register("operatorPassword")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
              </div>

              {/* Package */}
              <div>
                <label className="block text-sm font-medium">Package</label>
                <select
                  {...register("package")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                >
                  <option value="starter">Starter</option>
                  <option value="growth">Growth</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              {/* Branch Name */}
              <div>
                <label className="block text-sm font-medium">Branch Name</label>
                <input
                  {...register("branch.name")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
              </div>

              {/* Branch Location */}
              <div>
                <label className="block text-sm font-medium">
                  Branch Location
                </label>
                <input
                  {...register("branch.location")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
              </div>

              {/* Teams */}
              <div>
                <label className="block text-sm font-medium">Teams</label>
                <input
                  {...register("teams")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
              </div>

              {/* Payment Initiation */}
              <div>
                <label className="block text-sm font-medium">
                  Payment Initiation Date
                </label>
                <input
                  type="date"
                  {...register("payment_initiation")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
              </div>

              {/* FULL WIDTH: SERVICES */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Services
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "business_management",
                    "asset_management",
                    "client_management",
                    "staff_management",
                    "attendance_management",
                    "billing_management",
                  ].map((service) => (
                    <label
                      key={service}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        value={service}
                        {...register("services")}
                      />
                      {service}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => onClose()}
                className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 bg-blue-600 text-white rounded cursor-pointer"
              >
                {isPending ? "Updating..." : "Update Business"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
