"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import clsx from "clsx";

import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";
import { TCreateFinanceSchema } from "@/libs/validation/finance.validation";
import { financeApi } from "@/libs/api/finance.api";

type FinancialFormProps = {
  onClose?: () => void;
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

export function FinanceForm({ onClose, size = "lg" }: FinancialFormProps) {
  const toast = useToast.getState();

  const storedData = JSON.parse(localStorage.getItem("auth-data") || "{}");

  const businessId = storedData?.business_id;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TCreateFinanceSchema>({
    defaultValues: {
      business_id: businessId,
      title: "",
      type: "income",
      category: "",
      amount: 0,
      paymentMethod: "cash",
      transactionDate: "",
      description: "",
    },
  });

  const selectedType = watch("type");

  const [categories, setCategories] = useState<string[]>(incomeCategories);

  useEffect(() => {
    if (selectedType === "expense") {
      setCategories(expenseCategories);
    } else {
      setCategories(incomeCategories);
    }

    setValue("category", "");
  }, [selectedType, setValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: financeApi.createFinance,

    onSuccess: (data: any) => {
      toast.show({
        message: data?.message || "Financial record created successfully",
        type: "success",
      });

      reset();
      onClose?.();
    },

    onError: (err: any) => {
      toast.show({
        message:
          err?.response?.data?.error ||
          err?.message ||
          "Failed to create record",
        type: "error",
      });
    },
  });

  const onSubmit = (data: TCreateFinanceSchema) => {
    if (!businessId) {
      toast.show({
        message: "Business ID missing",
        type: "error",
      });
      return;
    }

    mutate(data);
  };

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
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-100 sticky top-0">
          <h2 className="text-xl font-semibold">Create Financial Record</h2>
          <button onClick={onClose} className="p-1 rounded border border-gray-200 hover:bg-gray-200 transition cursor-pointer">
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-[13px]">
            <div>
              <p className="text-xl font-semibold">Record Income / Expense</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("title", {
                    required: "Title is required",
                  })}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Type <span className="text-red-500">*</span>
                </label>

                <select
                  {...register("type")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Category <span className="text-red-500">*</span>
                </label>

                <select
                  {...register("category", {
                    required: "Category is required",
                  })}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                >
                  <option value="">
                    Select {selectedType === "expense" ? "Expense" : "Income"}{" "}
                    Category
                  </option>

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

              <div>
                <label className="block text-sm font-medium">
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("amount", {
                    required: "Amount is required",
                  })}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Payment Method
                </label>
                <select
                  {...register("paymentMethod")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                >
                  <option value="cash">Cash</option>
                  <option value="bank">Bank</option>
                  <option value="online">Online</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Transaction Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register("transactionDate")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                {...register("description")}
                className="w-full mt-1 border border-gray-200 p-2 rounded outline-none resize-none"
                rows={3}
              />
            </div>

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
                {isPending ? "Creating..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
