"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";
import clsx from "clsx";
import { X } from "lucide-react";

import { financeApi } from "@/libs/api/finance.api";
import { useFinanceById } from "@/hooks/business-admin/business-management/getFinanceById";
import { TUpdateFinanceSchema } from "@/libs/validation/finance.validation";

type Props = {
  financeId: string;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

const expenseCategories = [
  "Fuel",
  "Vehicle Maintenance",
  "Salary",
  "Office Rent",
  "Marketing",
  "Utilities",
  "Equipment Purchase",
  "Printing",
  "Tax",
  "Insurance",
  "Other",
];

const incomeCategories = [
  "Student Registration",
  "Driving Package",
  "Token Charge",
  "Exam Fee",
  "Certificate Fee",
  "Consultation",
  "Extra Practice",
  "Other",
];

export function EditFinanceForm({ financeId, onClose, size = "lg" }: Props) {
  const toast = useToast.getState();

  const { data, isLoading, isError } = useFinanceById(financeId);
  const finance = data?.data ?? data;

  const storedData = JSON.parse(localStorage.getItem("auth-data") || "{}");
  const businessId = storedData?.business_id || "";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TUpdateFinanceSchema>({
    defaultValues: {
      _id: financeId,
      title: "",
      type: "income",
      category: "",
      amount: 0,
      description: "",
    },
  });

  const selectedType = watch("type");
  const [categories, setCategories] = useState<string[]>(incomeCategories);

  // 1. FIRST: Load existing data (IMPORTANT)
  useEffect(() => {
    if (!finance) return;

    reset({
      _id: financeId,
      title: finance.title,
      type: finance.type,
      category: finance.category,
      amount: finance.amount,
      paymentMethod: finance.paymentMethod,
      transactionDate: finance.transactionDate
        ? finance.transactionDate.split("T")[0]
        : "",
      description: finance.description || "",
    });
  }, [finance, financeId, reset]);

  useEffect(() => {
    if (selectedType === "expense") {
      setCategories(expenseCategories);
    } else {
      setCategories(incomeCategories);
    }
    
    if (finance?.type !== selectedType) {
      setValue("category", "");
    }
  }, [selectedType, setValue, finance?.type]);

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: TUpdateFinanceSchema) =>
      financeApi.updateFinanceApi(financeId, payload),

    onSuccess: (data: any) => {
      toast.show({
        message: data?.message || "Finance updated successfully",
        type: "success",
      });
      onClose();
    },

    onError: (err: any) => {
      toast.show({
        message:
          err?.response?.data?.error ||
          err?.message ||
          "Failed to update record",
        type: "error",
      });
    },
  });

  const onSubmit = (values: TUpdateFinanceSchema) => {
    mutate({
      ...values,
      _id: financeId,
    });
  };

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (isError)
    return <div className="p-6 text-red-500">Failed to load data</div>;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={clsx(
          "bg-white rounded-lg shadow-lg w-full h-auto overflow-y-scroll",
          {
            "max-w-md": size === "sm",
            "max-w-lg": size === "md",
            "max-w-3xl": size === "lg",
            "max-w-5xl": size === "xl",
          },
        )}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-100 sticky top-0">
          <h2 className="text-xl font-semibold">Edit Financial Record</h2>
          <button onClick={onClose} className="p-1 rounded border border-gray-200 hover:bg-gray-200 transition cursor-pointer">
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 text-[13px]">
          <p className="text-xl font-semibold">Update Finance Details</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* TITLE */}
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                {...register("title", { required: "Title is required" })}
                className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            {/* TYPE */}
            <div>
              <label className="block text-sm font-medium">Type</label>
              <select
                {...register("type")}
                className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            {/* CATEGORY */}
            <div>
              <label className="block text-sm font-medium">Category</label>
              <select
                {...register("category", {
                  required: "Category is required",
                })}
                className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
              >
                <option value="">Select Category</option>

                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {errors.category && (
                <p className="text-red-500 text-sm">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* AMOUNT */}
            <div>
              <label className="block text-sm font-medium">Amount</label>
              <input
                type="number"
                {...register("amount", {
                  valueAsNumber: true,
                  required: "Amount is required",
                })}
                className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
              />
              {errors.amount && (
                <p className="text-red-500 text-sm">{errors.amount.message}</p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium">Description</label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full mt-1 border border-gray-200 p-2 rounded outline-none resize-none"
              />
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
              {isPending ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
