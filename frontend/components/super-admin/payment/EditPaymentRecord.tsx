"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";
import clsx from "clsx";
import { X } from "lucide-react";

import { paymentApi } from "@/libs/api/payment.api";
import { TUpdatePaymentSchema, updatePaymentSchema } from "@/libs/validation/payment.validation";
import { usePaymentById } from "@/hooks/super-admin/payment-records/getPaymentById";

type PaymentFormProps = {
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
  paymentId: string;
};

export function EditPaymentForm({
  onClose,
  size = "lg",
  paymentId,
}: PaymentFormProps) {
  const toast = useToast.getState();
  const { data, isLoading, isError } = usePaymentById(paymentId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TUpdatePaymentSchema>({
    resolver: zodResolver(updatePaymentSchema),
    defaultValues: {
      _id: paymentId,
      package: "starter",
      startedAt: "",
      endAt: "",
      paidAmount: 0,
      dueAmount: 0,
      paymentStatus: "pending",
      isActive: true,
    },
  });

  const payment = data;

  useEffect(() => {
    if (!paymentId || !payment) return;

    reset({
      _id: payment._id,
      package: payment.package ?? "starter",

      startedAt: payment.startedAt
        ? new Date(payment.startedAt).toISOString().split("T")[0]
        : "",

      endAt: payment.endAt
        ? new Date(payment.endAt).toISOString().split("T")[0]
        : "",

      paidAmount: payment.paidAmount ?? 0,
      dueAmount: payment.dueAmount ?? 0,

      paymentStatus: payment.paymentStatus ?? "pending",
      isActive: payment.isActive ?? true,
    });
  }, [paymentId, payment, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: TUpdatePaymentSchema) =>
      paymentApi.updatePaymentApi(paymentId, payload),

    onSuccess: (data: any) => {
      toast.show({
        message: data?.message || "Payment updated successfully",
        type: "success",
      });
      onClose();
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.error || err?.message || "Failed to update payment";
      toast.show({
        message: errorMessage,
        type: "error",
      });
    },
  });

  const onSubmit = (values: TUpdatePaymentSchema) => {
    mutate({
      ...values,
      _id: paymentId,
    });
  };

  if (isLoading) return <div className="p-6">Loading payment...</div>;

  if (isError)
    return <div className="p-6 text-red-500">Failed to load payment</div>;

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
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Payment Record
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
            <div>
              <p className="text-xl font-semibold">
                Edit Subscription / Payment
              </p>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {errors.package && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.package.message}
                  </p>
                )}
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium">Started At</label>
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

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium">End At</label>
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

              {/* Paid */}
              <div>
                <label className="block text-sm font-medium">Paid Amount</label>
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

              {/* Due */}
              <div>
                <label className="block text-sm font-medium">Due Amount</label>
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

              {/* Status */}
              <div>
                <label className="block text-sm font-medium">
                  Payment Status
                </label>
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

              {/* Active */}
              <div className="flex items-center gap-2 mt-6">
                <input type="checkbox" {...register("isActive")} />
                <label className="text-sm font-medium">Active</label>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 bg-blue-600 text-white rounded"
              >
                {isPending ? "Updating..." : "Update Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
