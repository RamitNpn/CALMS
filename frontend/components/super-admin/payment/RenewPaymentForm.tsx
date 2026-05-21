"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";
import clsx from "clsx";
import { X } from "lucide-react";

import { paymentApi } from "@/libs/api/payment.api";
import {
  renewPaymentSchema,
  TRenewPaymentSchema,
} from "@/libs/validation/payment.validation";
import { usePaymentById } from "@/hooks/super-admin/payment-records/getPaymentById";

type Props = {
  paymentId: string;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export function RenewPaymentForm({ paymentId, onClose, size = "lg" }: Props) {
  const toast = useToast.getState();
  const { data, isLoading } = usePaymentById(paymentId);

  const payment = data?.data ?? data;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TRenewPaymentSchema>({
    resolver: zodResolver(renewPaymentSchema),
    defaultValues: {
      business_id: "",
      businessName: "",
      businessEmail: "",
      package: "starter",
      startedAt: "",
      endAt: "",
      paidAmount: 0,
      dueAmount: 0,
      paymentStatus: "pending",
      isActive: true,
    },
  });

  const startedAt = watch("startedAt");

  useEffect(() => {
    if (!payment) return;

    const latestEndDate = payment.endAt ? new Date(payment.endAt) : new Date();

    latestEndDate.setDate(latestEndDate.getDate() + 1);

    reset({
      business_id: payment.business_id,
      businessName: payment.businessName,
      businessEmail: payment.businessEmail,
      package: payment.package,
      startedAt: latestEndDate.toISOString().split("T")[0],
      endAt: latestEndDate.toISOString().split("T")[0],
      paidAmount: 0,
      dueAmount: 0,
      paymentStatus: "pending",
      isActive: true,
    });
  }, [payment, reset]);

  useEffect(() => {
    if (!startedAt) return;

    const start = new Date(startedAt);

    setValue("endAt", start.toISOString().split("T")[0]);
  }, [startedAt, setValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: paymentApi.renewPayment,
    onSuccess: (data: any) => {
      toast.show({
        message: data?.message || "Payment renewed successfully",
        type: "success",
      });
      onClose();
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.error || err?.message || "Failed to renew payment";
      toast.show({
        message: errorMessage,
        type: "error",
      });
    },
  });

  const onSubmit = (data: TRenewPaymentSchema) => {
    mutate(data);
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

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
            Renew Subscription
          </h2>

          <button onClick={onClose}>
            <X className="text-red-500 cursor-pointer" />
          </button>
        </div>

        {/* FORM */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* BUSINESS NAME */}
              <div>
                <label className="block text-sm font-medium">
                  Business Name
                </label>

                <input
                  type="text"
                  {...register("businessName")}
                  disabled
                  className="w-full mt-1 border border-gray-200 p-2 rounded bg-gray-100 cursor-not-allowed"
                />
                {errors.businessName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.businessName.message}
                  </p>
                )}
              </div>

              {/* BUSINESS EMAIL */}
              <div>
                <label className="block text-sm font-medium">
                  Business Email
                </label>

                <input
                  type="email"
                  {...register("businessEmail")}
                  disabled
                  className="w-full mt-1 border border-gray-200 p-2 rounded bg-gray-100 cursor-not-allowed"
                />
                {errors.businessEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.businessEmail.message}
                  </p>
                )}
              </div>

              {/* PACKAGE */}
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
                {errors.package && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.package.message}
                  </p>
                )}
              </div>

              {/* START DATE */}
              <div>
                <label className="block text-sm font-medium">Started At</label>

                <input
                  type="date"
                  {...register("startedAt")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded"
                />
                {errors.startedAt && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.startedAt.message}
                  </p>
                )}
              </div>

              {/* END DATE */}
              <div>
                <label className="block text-sm font-medium">End At</label>

                <input
                  type="date"
                  {...register("endAt")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded bg-gray-100"
                />
                {errors.endAt && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.endAt.message}
                  </p>
                )}
              </div>

              {/* PAID AMOUNT */}
              <div>
                <label className="block text-sm font-medium">Paid Amount</label>

                <input
                  type="number"
                  {...register("paidAmount", {
                    valueAsNumber: true,
                  })}
                  className="w-full mt-1 border border-gray-200 p-2 rounded"
                />
                {errors.paidAmount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.paidAmount.message}
                  </p>
                )}
              </div>

              {/* DUE AMOUNT */}
              <div>
                <label className="block text-sm font-medium">Due Amount</label>

                <input
                  type="number"
                  {...register("dueAmount", {
                    valueAsNumber: true,
                  })}
                  className="w-full mt-1 border border-gray-200 p-2 rounded"
                />
                {errors.dueAmount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dueAmount.message}
                  </p>
                )}
              </div>

              {/* STATUS */}
              <div>
                <label className="block text-sm font-medium">
                  Payment Status
                </label>

                <select
                  {...register("paymentStatus")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded"
                >
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                  <option value="pending">Pending</option>
                </select>
                {errors.paymentStatus && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.paymentStatus.message}
                  </p>
                )}
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
                {isPending ? "Renewing..." : "Renew Subscription"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
