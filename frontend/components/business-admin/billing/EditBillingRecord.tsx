"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { X, Plus, Trash2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { billingApi } from "@/libs/api/billing.api";
import { updateBillingSchema } from "@/libs/validation/billing.validation";
import { useBillingById } from "@/hooks/business-admin/billing-management/getBillingById";
import { useToast } from "@/components/ui/toast";

type BillingFormData = z.infer<typeof updateBillingSchema>;

type Props = {
  billingId: string;
  onClose: () => void;
  onSuccess?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export function EditBillingRecord({
  billingId,
  onClose,
  onSuccess,
  size = "lg",
}: Props) {
  const { data, isLoading, isError } = useBillingById(billingId);

  const billing = data?.data ?? data;
  const toast = useToast.getState();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<BillingFormData>({
    resolver: zodResolver(updateBillingSchema),
    defaultValues: {
      _id: billingId,
      clientName: "",
      title: "",
      items: [
        {
          name: "",
          price: 0,
          qty: 1,
        },
      ],
      totalAmount: 0,
      paidAmount: 0,
      paymentMethod: undefined,
      recipt: undefined,
      status: "pending",
      dueDate: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    if (!billingId || !billing) return;

    console.log("📦 BILLING DATA LOADED:", billing);

    // Format dueDate properly for date input
    let formattedDueDate = "";
    if (billing.dueDate) {
      if (typeof billing.dueDate === "string") {
        // If it's already a string, use it as is
        formattedDueDate = billing.dueDate.split("T")[0];
      } else if (billing.dueDate instanceof Date) {
        // If it's a Date object, convert it
        formattedDueDate = billing.dueDate.toISOString().split("T")[0];
      }
    }

    console.log("📅 FORMATTED DUE DATE:", formattedDueDate);

    reset({
      _id: billing._id,
      clientName: billing.clientName,
      title: billing.title,
      items:
        billing.items?.length > 0
          ? billing.items
          : [{ name: "", price: 0, qty: 1 }],
      totalAmount: billing.totalAmount ?? 0,
      paidAmount: billing.paidAmount ?? 0,
      paymentMethod: billing.paymentMethod ?? undefined,
      recipt: billing.recipt ?? "",
      status: billing.status ?? "pending",
      dueDate: formattedDueDate,
    });
  }, [billingId, billing, reset]);

  const watchedItems = watch("items");

  useEffect(() => {
    if (!watchedItems) return;

    const total = watchedItems.reduce((acc, item) => {
      return acc + (Number(item.price) || 0) * (Number(item.qty) || 0);
    }, 0);

    reset(
      (prev) => ({
        ...prev,
        totalAmount: total,
      }),
      {
        keepValues: true,
        keepDirty: true,
      },
    );
  }, [watchedItems, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      billingId,
      data,
    }: {
      billingId: string;
      data: Partial<z.infer<typeof updateBillingSchema>>;
    }) => billingApi.updateBillingApi(billingId, data),

    onSuccess: () => {
      toast.show({
        message: "Billing updated successfully",
        type: "success",
      });

      onSuccess?.();
      onClose();
    },

    onError: (err) => {
      console.error("Update failed:", err);

      toast.show({
        message: "Failed to update billing",
        type: "error",
      });
    },
  });

  const onSubmit = (values: BillingFormData) => {
    console.log("📋 FORM SUBMITTED - DUE DATE:", values.dueDate);

    const items = values.items ?? [];

    const cleanedItems = items.map((item) => ({
      name: item.name.trim(),
      price: Number(item.price),
      qty: Number(item.qty),
    }));

    const totalAmount = cleanedItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0,
    );

    const payload: Partial<z.infer<typeof updateBillingSchema>> = {
      _id: billingId,
      clientName: values.clientName,
      title: values.title,
      items: cleanedItems,
      totalAmount,
      paidAmount: Number(values.paidAmount),
      paymentMethod: values.paymentMethod,
      recipt: values.recipt,
      status: values.status,
      dueDate: values.dueDate,
    };

    console.log("✅ BILLING UPDATE PAYLOAD:", payload);

    mutate({
      billingId,
      data: payload,
    });
  };

  if (isLoading) {
    return <div className="p-6">Loading billing...</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">Failed to load billing record</div>
    );
  }

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
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Flowdesk - Edit Billing Details
          </h2>

          <button onClick={onClose} className="p-1 rounded border border-gray-200 hover:bg-gray-200 transition cursor-pointer">
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>

        {/* FORM */}
        <div className="p-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 text-[13px]"
          >
            <p className="text-xl font-semibold">Edit Billing Information</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CLIENT NAME */}
              <div>
                <label className="block text-sm font-medium">Client Name</label>

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

              {/* TITLE */}
              <div>
                <label className="block text-sm font-medium">
                  Billing Title
                </label>

                <input
                  {...register("title")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
              </div>

              {/* PAYMENT METHOD */}
              <div>
                <label className="block text-sm font-medium">
                  Payment Method
                </label>

                <select
                  {...register("paymentMethod")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="bank">Bank</option>
                  <option value="online">Online</option>
                </select>
              </div>

              {/* STATUS */}
              <div>
                <label className="block text-sm font-medium">
                  Billing Status
                </label>

                <select
                  {...register("status")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              {/* PAID AMOUNT */}
              <div>
                <label className="block text-sm font-medium">Paid Amount</label>

                <input
                  type="number"
                  {...register("paidAmount", {
                    valueAsNumber: true,
                  })}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
              </div>

              {/* DUE DATE */}
              <div>
                <label className="block text-sm font-medium">Due Date</label>

                <input
                  type="date"
                  {...register("dueDate")}
                  placeholder="Select a date"
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />

                {errors.dueDate && (
                  <p className="text-red-500 text-sm">
                    {errors.dueDate.message}
                  </p>
                )}
              </div>

              {/* RECEIPT */}
              <div>
                <label className="block text-sm font-medium">
                  Receipt Image
                </label>

                <input
                  type="file"
                  {...register("recipt")}
                  accept="image/*"
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
              </div>
            </div>

            {/* BILLING ITEMS */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Billing Items</h3>

                <button
                  type="button"
                  onClick={() =>
                    append({
                      name: "",
                      price: 0,
                      qty: 1,
                    })
                  }
                  className="flex items-center gap-1 text-sm bg-gray-800 cursor-pointer text-white px-3 py-1 rounded hover:bg-gray-700"
                >
                  <Plus size={16} /> Add Item
                </button>
              </div>

              {errors.items && (
                <p className="mb-4 text-sm text-red-500">
                  {errors.items.message || "Items validation failed"}
                </p>
              )}

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-12 gap-2 items-center"
                  >
                    <input
                      placeholder="Item Name"
                      {...register(`items.${index}.name`)}
                      className="col-span-5 border border-gray-200 p-2 rounded outline-none"
                    />

                    <input
                      type="number"
                      placeholder="Price"
                      {...register(`items.${index}.price`, {
                        valueAsNumber: true,
                      })}
                      className="col-span-3 border border-gray-200 p-2 rounded outline-none"
                    />

                    <input
                      type="number"
                      placeholder="Qty"
                      {...register(`items.${index}.qty`, {
                        valueAsNumber: true,
                      })}
                      className="col-span-3 border border-gray-200 p-2 rounded outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} className="cursor-pointer" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* TOTAL */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-lg font-semibold">
                Total Amount: Rs.{" "}
                {watchedItems?.reduce(
                  (acc, item) =>
                    acc + (Number(item.price) || 0) * (Number(item.qty) || 0),
                  0,
                )}
              </p>
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
                {isPending ? "Updating..." : "Update Billing"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
