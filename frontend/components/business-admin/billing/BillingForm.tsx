"use client";

import React from "react";
import clsx from "clsx";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Plus, Trash2, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { billingApi } from "@/libs/api/billing.api";
import { useToast } from "@/components/ui/toast";
import { createBillingSchema } from "@/libs/validation/billing.validation";

type BillingFormData = z.infer<typeof createBillingSchema>;

type BillingFormProps = {
  onClose?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export function BillingForm({ onClose, size = "xl" }: BillingFormProps) {
  const storedData = JSON.parse(localStorage.getItem("auth-data") || "{}");

  const toast = useToast.getState();

  const businessId = storedData?.business_id;

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BillingFormData>({
    resolver: zodResolver(createBillingSchema),
    defaultValues: {
      business_id: businessId,
      clientName: "",
      clientEmail: "",
      title: "",
      items: [
        {
          name: "",
          price: 1,
          qty: 1,
        },
      ],
      totalAmount: 0,
      paidAmount: 0,
      paymentMethod: undefined,
      recipt: undefined,
      status: "pending",
      dueDate: undefined,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = watch("items");

  // Auto calculate total amount
  const grandTotal =
    watchedItems?.reduce((acc, item) => {
      return acc + Number(item.price || 0) * Number(item.qty || 0);
    }, 0) || 0;

  React.useEffect(() => {
    setValue("totalAmount", grandTotal);
  }, [grandTotal, setValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: billingApi.createBilling,

    onSuccess: () => {
      toast.show({
        message: "Billing created successfully",
        type: "success",
      });
      reset();
      onClose?.();
    },

    onError: (err: any) => {
      console.error(err);

      const errorMessage =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to create billing";

      toast.show({
        message: errorMessage,
        type: "error",
      });
    },
  });

  const onSubmit = (data: BillingFormData) => {
    if (!businessId) {
      toast.show({
        message: "Business ID missing",
        type: "error",
      });

      return;
    }

    const cleanedItems = data.items.map((item) => ({
      name: item.name.trim(),
      price: Number(item.price),
      qty: Number(item.qty),
    }));

    const formData = new FormData();
    formData.append("business_id", businessId);
    formData.append("clientName", data.clientName);
    formData.append("clientEmail", data.clientEmail);
    formData.append("title", data.title);
    formData.append("items", JSON.stringify(cleanedItems));
    formData.append("totalAmount", String(data.totalAmount));
    formData.append("paidAmount", String(data.paidAmount || 0));

    if (data.paymentMethod) {
      formData.append("paymentMethod", data.paymentMethod);
    }

    if (data.status) {
      formData.append("status", data.status);
    }

    if (data.dueDate) {
      formData.append("dueDate", data.dueDate);
    }

    // Handle file upload
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => {
      const fileInput = input as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        formData.append("recipt", fileInput.files[0]);
      }
    });

    console.log("FINAL BILLING PAYLOAD:", Object.fromEntries(formData));

    mutate(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={clsx(
          "bg-white rounded-lg shadow-lg w-full h-[94vh] overflow-y-auto",
          {
            "max-w-md": size === "sm",
            "max-w-lg": size === "md",
            "max-w-4xl": size === "lg",
            "max-w-6xl": size === "xl",
          },
        )}
      >
        {/* HEADER */}
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-gray-100 px-6 py-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Create Billing</h2>
            <p className="mt-1 text-sm text-gray-500">
              Generate invoice and billing details
            </p>
          </div>

          <button onClick={onClose} className="p-1 rounded border border-gray-200 hover:bg-gray-200 transition cursor-pointer">
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>

        {/* FORM */}
        <div className="p-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 text-[13px]"
          >
            {/* CLIENT DETAILS */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Client Information
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Client Name */}
                <div>
                  <label className="block text-sm font-medium">
                    Client Name
                  </label>

                  <input
                    {...register("clientName", {
                      required: "Client name is required",
                    })}
                    className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                  />

                  {errors.clientName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.clientName.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium">
                    Client Email
                  </label>

                  <input
                    type="email"
                    {...register("clientEmail", {
                      required: "Email is required",
                    })}
                    className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                  />

                  {errors.clientEmail && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.clientEmail.message}
                    </p>
                  )}
                </div>

                {/* Billing Title */}
                <div>
                  <label className="block text-sm font-medium">
                    Billing Title
                  </label>

                  <input
                    {...register("title", {
                      required: "Title is required",
                    })}
                    className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                  />

                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* BILLING ITEMS */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  Billing Items
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    append({
                      name: "",
                      price: 0,
                      qty: 1,
                    })
                  }
                  className="flex items-center gap-1 rounded bg-gray-800 px-4 py-2 text-sm text-white"
                >
                  <Plus size={16} />
                  Add Item
                </button>
              </div>

              {errors.items && (
                <p className="mb-4 text-sm text-red-500">
                  {errors.items.message || "Please add at least one item"}
                </p>
              )}

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-12 gap-3 rounded border border-gray-200 bg-gray-50 p-4"
                  >
                    {/* Item Name */}
                    <div className="col-span-12 md:col-span-5">
                      <label className="block text-sm font-medium">
                        Item Name
                      </label>

                      <input
                        {...register(`items.${index}.name`)}
                        className={clsx(
                          "mt-1 w-full rounded border p-2 outline-none",
                          errors.items?.[index]?.name
                            ? "border-red-500"
                            : "border-gray-200",
                        )}
                      />
                      {errors.items?.[index]?.name && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.items[index]?.name?.message}
                        </p>
                      )}
                    </div>

                    {/* Price */}
                    <div className="col-span-6 md:col-span-2">
                      <label className="block text-sm font-medium">Price</label>

                      <input
                        type="number"
                        {...register(`items.${index}.price`, {
                          valueAsNumber: true,
                        })}
                        className={clsx(
                          "mt-1 w-full rounded border p-2 outline-none",
                          errors.items?.[index]?.price
                            ? "border-red-500"
                            : "border-gray-200",
                        )}
                      />
                      {errors.items?.[index]?.price && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.items[index]?.price?.message}
                        </p>
                      )}
                    </div>

                    {/* Qty */}
                    <div className="col-span-4 md:col-span-2">
                      <label className="block text-sm font-medium">Qty</label>

                      <input
                        type="number"
                        {...register(`items.${index}.qty`, {
                          valueAsNumber: true,
                        })}
                        className={clsx(
                          "mt-1 w-full rounded border p-2 outline-none",
                          errors.items?.[index]?.qty
                            ? "border-red-500"
                            : "border-gray-200",
                        )}
                      />
                      {errors.items?.[index]?.qty && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.items[index]?.qty?.message}
                        </p>
                      )}
                    </div>

                    {/* Subtotal */}
                    <div className="col-span-2 md:col-span-2">
                      <label className="block text-sm font-medium">Total</label>

                      <div className="mt-1 rounded border border-gray-200 bg-white p-2 text-center font-semibold">
                        Rs.
                        {(watchedItems?.[index]?.price || 0) *
                          (watchedItems?.[index]?.qty || 0)}
                      </div>
                    </div>

                    {/* Remove */}
                    <div className="col-span-12 flex items-end justify-end md:col-span-1">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="rounded p-2 text-red-500 cursor-pointer hover:bg-red-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PAYMENT DETAILS */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Payment Details
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Total Amount */}
                <div>
                  <label className="block text-sm font-medium">
                    Total Amount
                  </label>

                  <input
                    type="number"
                    readOnly
                    value={grandTotal}
                    {...register("totalAmount", {
                      valueAsNumber: true,
                    })}
                    className="mt-1 w-full rounded border border-gray-200 bg-gray-100 p-3 font-semibold outline-none"
                  />
                </div>

                {/* Paid Amount */}
                <div>
                  <label className="block text-sm font-medium">
                    Paid Amount
                  </label>

                  <input
                    type="number"
                    {...register("paidAmount", {
                      valueAsNumber: true,
                    })}
                    className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium">
                    Payment Method
                  </label>

                  <select
                    {...register("paymentMethod")}
                    className="mt-1 w-full rounded-lg border border-gray-200 p-3 outline-none"
                  >
                    <option value="cash">Cash</option>
                    <option value="online">Online</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium">
                    Billing Status
                  </label>

                  <select
                    {...register("status")}
                    className="mt-1 w-full rounded-lg border border-gray-200 p-3 outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="partial">Partial</option>
                  </select>
                </div>

                {/* Receipt */}
                <div>
                  <label className="block text-sm font-medium">
                    Receipt Screenshot
                  </label>

                  <input
                    type="file"
                    {...register("recipt")}
                    className="mt-1 w-full rounded-lg border border-gray-200 p-3 outline-none"
                  />
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium">Due Date</label>

                  <input
                    type="date"
                    {...register("dueDate")}
                    className="mt-1 w-full rounded-lg border border-gray-200 p-3 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
              <button
                type="button"
                onClick={() => reset()}
                className="rounded-lg bg-red-500 px-5 py-2 text-white"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="rounded-lg bg-gray-800 px-6 py-2 text-white"
              >
                {isPending ? "Creating..." : "Create Billing"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
