"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";
import clsx from "clsx";
import { X } from "lucide-react";

import { createPaymentSchema } from "@/libs/validation/payment.validation";

import { z } from "zod";
import { paymentApi } from "@/libs";

type PaymentFormProps = {
  onClose?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export function PaymentForm({ onClose, size = "lg" }: PaymentFormProps) {
  const toast = useToast.getState();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      businessName: "",
      businessEmail: "",
      package: "starter",
      startedAt: undefined,
      endAt: undefined,
      paidAmount: 0,
      dueAmount: 0,
      paymentStatus: "pending",
      isActive: true,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: paymentApi.createPayment,
    onSuccess: (data: any) => {
      toast.show({
        message: data?.message || "Payment created successfully",
        type: "success",
      });
      reset();
      onClose?.();
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.error || err?.message || "Failed to create payment";
      toast.show({
        message: errorMessage,
        type: "error",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof createPaymentSchema>) => {
    mutate(data);
  };

  if (errors) {
    console.log("Validation Errors:", errors);
  }

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
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Create Payment / Subscription
          </h2>

          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-red-400 cursor-pointer" />
          </button>
        </div>

        {/* FORM */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Business Info (readonly) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Business Name</label>
                <input
                  {...register("businessName")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
                {errors.businessName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.businessName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Business Email</label>
                <input
                  {...register("businessEmail")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
                {errors.businessEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.businessEmail.message}
                  </p>
                )}
              </div>
            </div>

            {/* PACKAGE + DURATION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Package</label>
                <select
                  {...register("package")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                >
                  <option value="starter">Starter</option>
                  <option value="growth">Growth</option>
                  <option value="enterprise">Enterprise</option>
                </select>
                {errors.package && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.package.message}
                  </p>
                )}
              </div>
            </div>

            {/* DATES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Started At</label>
                <input
                  type="date"
                  {...register("startedAt")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
                {errors.startedAt && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.startedAt.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">End At</label>
                <input
                  type="date"
                  {...register("endAt")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
                {errors.endAt && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.endAt.message}
                  </p>
                )}
              </div>
            </div>

            {/* PAYMENT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Paid Amount</label>
                <input
                  type="number"
                  {...register("paidAmount", { valueAsNumber: true })}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
                {errors.paidAmount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.paidAmount.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Due Amount</label>
                <input
                  type="number"
                  {...register("dueAmount", { valueAsNumber: true })}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
                {errors.dueAmount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dueAmount.message}
                  </p>
                )}
              </div>
            </div>

            {/* STATUS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Payment Status</label>
                <select
                  {...register("paymentStatus")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                </select>
                {errors.paymentStatus && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.paymentStatus.message}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 mt-6">
                <input type="checkbox" {...register("isActive")} />
                <label className="text-sm font-medium">Active</label>
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
                {isPending ? "Saving..." : "Create Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
