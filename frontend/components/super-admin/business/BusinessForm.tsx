"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { businessApi } from "@/libs/api/business.api";
import { z } from "zod";
import clsx from "clsx";
import { X } from "lucide-react";
import { createBusinessSchema } from "@/libs/validation/business.validation";
import { useToast } from "@/components";

type BusinessFormProps = {
  onClose?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export function BusinessForm({ onClose, size = "lg" }: BusinessFormProps) {
  const toast = useToast.getState();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(createBusinessSchema),
    defaultValues: {
      businessName: "",
      operatorName: "",
      operatorEmail: "",
      businessType: "",
      role: "business",
      teams: "",
      branch: {
        name: "",
        location: "",
      },
      package: "starter",
      services: [],
      payment_initiation: "", // Default to today's date
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: businessApi.createBusiness,
    onSuccess: () => {
      toast.show({
        message: "Business created successfully",
        type: "success",
      });
      reset();
      onClose?.();
    },
    onError: (err) => {
      toast.show({
        message:
          (err as { message?: string })?.message || "Business creation failed",
        type: "error",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof createBusinessSchema>) => {
    mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
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
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Flowdesk - Create Business
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X
              size={24}
              className="text-red-400 cursor-pointer border border-gray-200"
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <p className="text-xl font-semibold">Create Business Account</p>
            </div>

            {/* GRID START */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Business Name */}
              <div>
                <label className="block text-sm font-medium">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("businessName")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded"
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
                  className="w-full mt-1 border border-gray-200 p-2 rounded"
                />
              </div>

              {/* Operator Name */}
              <div>
                <label className="block text-sm font-medium">
                  Operator Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("operatorName")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded"
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
                  className="w-full mt-1 border border-gray-200 p-2 rounded"
                />
              </div>

              {/* Package */}
              <div>
                <label className="block text-sm font-medium">Package</label>
                <select
                  {...register("package")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded"
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
                  className="w-full mt-1 border border-gray-200 p-2 rounded"
                />
              </div>

              {/* Branch Location */}
              <div>
                <label className="block text-sm font-medium">
                  Branch Location
                </label>
                <input
                  {...register("branch.location")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded"
                />
              </div>

              {/* Teams */}
              <div>
                <label className="block text-sm font-medium">Teams</label>
                <input
                  {...register("teams")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded"
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
                  className="w-full mt-1 border border-gray-200 p-2 rounded"
                />
              </div>

              {/* FULL WIDTH: SERVICES */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Services
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Controller
                    control={control}
                    name="services"
                    render={({ field }) => {
                      const toggleService = (value: string) => {
                        const exists = field.value.includes(value);

                        if (exists) {
                          field.onChange(
                            field.value.filter((v: string) => v !== value),
                          );
                        } else {
                          field.onChange([...field.value, value]);
                        }
                      };

                      return (
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
                                checked={field.value.includes(service)}
                                onChange={() => toggleService(service)}
                              />
                              {service}
                            </label>
                          ))}
                        </div>
                      );
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => reset()}
                className="px-4 py-2 bg-red-500 text-white rounded"
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
