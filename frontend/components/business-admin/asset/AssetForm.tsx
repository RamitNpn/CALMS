"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { X, Plus, Trash2 } from "lucide-react";
import clsx from "clsx";
import { TCreateAsset } from "@/libs/types/asset.type";
import { useMutation } from "@tanstack/react-query";
import { assetApi } from "@/libs/api/asset.api";
import { useToast } from "@/components/ui/toast";

type AssetFormProps = {
  onClose?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export function AssetForm({ onClose, size = "lg" }: AssetFormProps) {
  const storedData = JSON.parse(localStorage.getItem("auth-data") || "{}");

  const toast = useToast.getState();

  const businessId = storedData?.business_id;

  if (!businessId) {
    console.error("Missing business_id");
  }

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TCreateAsset>({
    defaultValues: {
      business_id: businessId,
      name: "",
      type: "",
      status: "active",
      customFields: [{ key: "", value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "customFields",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: assetApi.createAsset,
    onSuccess: () => {
      toast.show({
        message: "Asset created successfully",
        type: "success",
      });

      reset();
      onClose?.();
    },
    onError: (err) => console.error(err),
  });
  const onSubmit = (data: TCreateAsset) => {
    if (!data.business_id) {
      toast.show({
        message: "Business ID missing",
        type: "error",
      });
      return;
    }

    const customFieldsObject = Object.fromEntries(
      data.customFields
        .filter((f) => f.key.trim() !== "" && f.value.trim() !== "")
        .map((f) => [f.key.trim(), f.value.trim()]),
    );

    const payload = {
      business_id: data.business_id,
      name: data.name.trim(),
      type: data.type.trim(),
      status: data.status,
      customFields:
        Object.keys(customFieldsObject).length > 0
          ? customFieldsObject
          : undefined,
    };

    console.log("✅ FINAL PAYLOAD:", payload);

    mutate(payload);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={clsx(
          "bg-white rounded-lg shadow-lg w-full h-auto overflow-y-auto",
          {
            "max-w-md": size === "sm",
            "max-w-lg": size === "md",
            "max-w-3xl": size === "lg",
            "max-w-5xl": size === "xl",
          },
        )}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-100 sticky top-0">
          <h2 className="text-xl font-semibold">Create Asset</h2>
          <button onClick={onClose}>
            <X className="text-red-500 border border-gray-200 cursor-pointer hover:bg-red-500 hover:text-white rounded" />
          </button>
        </div>

        {/* FORM */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <p className="text-xl font-semibold">Create Business Asset</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium">
                  Asset Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("name", { required: "Name is required" })}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium">
                  Asset Type <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("type", { required: true })}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("status")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            {/* CUSTOM FIELDS */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Custom Fields</h3>

                <button
                  type="button"
                  onClick={() => append({ key: "", value: "" })}
                  className="flex items-center gap-1 text-sm bg-gray-800 cursor-pointer text-white px-3 py-1 rounded"
                >
                  <Plus size={16} /> Add Field
                </button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-5 gap-2 items-center"
                  >
                    <input
                      placeholder="Key"
                      {...register(`customFields.${index}.key` as const)}
                      className="col-span-2 input w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                    />

                    <input
                      placeholder="Value"
                      {...register(`customFields.${index}.value` as const)}
                      className="col-span-2 input w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500"
                    >
                      <Trash2 size={18} className="cursor-pointer" />
                    </button>
                  </div>
                ))}
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
                {isPending ? "Creating..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
