"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInvoiceSchema, CreateInvoiceInput } from "@/libs/types/invoice.types";
import { useGetAllBusinesses } from "@/libs/api/business.api";
import { useGetAllClients } from "@/libs/api/client.api";
import { FormField } from "@/components/shared/FormField";
import { Button } from "@/components/shared/Button";
import { Plus, Trash2 } from "lucide-react";

interface InvoiceFormProps {
  initialData?: any;
  isLoading: boolean;
  onSubmit: (data: CreateInvoiceInput) => void;
}

export function InvoiceForm({
  initialData,
  isLoading,
  onSubmit,
}: InvoiceFormProps) {
  const { data: businesses = [] } = useGetAllBusinesses();
  const { data: clients = [] } = useGetAllClients();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<CreateInvoiceInput>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      items: [{ name: "", price: 0, qty: 1 }],
      ...initialData,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");
  const totalAmount = items?.reduce(
    (sum, item) => sum + (item.price || 0) * (item.qty || 1),
    0
  ) || 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        label="Business"
        name="tenantId"
        type="select"
        register={register}
        errors={errors}
        required
        options={businesses.map((b) => ({ value: b._id, label: b.name }))}
      />

      <FormField
        label="Client/Student"
        name="clientId"
        type="select"
        register={register}
        errors={errors}
        required
        options={clients.map((c) => ({ value: c._id, label: c.name }))}
      />

      {/* Items Section */}
      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-700">Items</h3>
          <button
            type="button"
            onClick={() => append({ name: "", price: 0, qty: 1 })}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Plus size={16} /> Add Item
          </button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="mb-4 p-4 border rounded-lg bg-gray-50">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-6">
                <FormField
                  label="Item Name"
                  name={`items.${index}.name`}
                  placeholder="Enter item name"
                  register={register}
                  errors={errors}
                  required
                />
              </div>
              <div className="col-span-3">
                <FormField
                  label="Price"
                  name={`items.${index}.price`}
                  type="number"
                  placeholder="0.00"
                  register={register}
                  errors={errors}
                  required
                />
              </div>
              <div className="col-span-2">
                <FormField
                  label="Qty"
                  name={`items.${index}.qty`}
                  type="number"
                  placeholder="1"
                  register={register}
                  errors={errors}
                  required
                />
              </div>
              <div className="col-span-1 flex items-end">
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="text-lg font-semibold text-gray-900">
          Total Amount: PKR {totalAmount.toFixed(2)}
        </div>
      </div>

      <FormField
        label="Status"
        name="status"
        type="select"
        register={register}
        errors={errors}
        options={[
          { value: "PAID", label: "Paid" },
          { value: "PARTIAL", label: "Partial" },
          { value: "DUE", label: "Due" },
        ]}
      />

      <FormField
        label="Paid Amount"
        name="paidAmount"
        type="number"
        placeholder="0.00"
        register={register}
        errors={errors}
      />

      <FormField
        label="Due Date"
        name="dueDate"
        type="date"
        register={register}
        errors={errors}
      />

      <div className="flex gap-2 justify-end pt-4">
        <Button variant="outline" type="reset">
          Reset
        </Button>
        <Button variant="primary" type="submit" isLoading={isLoading}>
          {initialData ? "Update" : "Create"} Invoice
        </Button>
      </div>
    </form>
  );
}
