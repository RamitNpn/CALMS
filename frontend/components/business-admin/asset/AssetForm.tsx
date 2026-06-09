"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { X, Plus, Trash2 } from "lucide-react";
import clsx from "clsx";
import { TCreateAsset } from "@/libs/types/asset.type";
import { useMutation } from "@tanstack/react-query";
import { assetApi } from "@/libs/api/asset.api";
import { useToast } from "@/components/ui/toast";
import { useAllAssetTypes } from "@/hooks/business-admin/asset-management/getAllAssetTypes";
import { TAssetType } from "@/libs/types/assetType.types";
import Image from "next/image";
import FormHeader from "@/components/shared/FormHeader";

type AssetFormProps = {
  onClose?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

type AssetFormData = Omit<TCreateAsset, "customFields"> & {
  customFieldsArray?: Array<{ key: string; value: string }>;
};

export function AssetForm({ onClose, size = "lg" }: AssetFormProps) {
  const storedData = JSON.parse(localStorage.getItem("auth-data") || "{}");
  const businessId = storedData?.business_id;

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const toast = useToast.getState();

  const { data: assetTypesData } = useAllAssetTypes({
    page: 1,
    limit: 100,
    business_id: businessId,
  });

  const assetTypes = assetTypesData?.data || [];

  if (!businessId) {
    console.error("Missing business_id");
  }

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AssetFormData>({
    defaultValues: {
      business_id: businessId,
      name: "",
      type: "",
      price: 0,
      image: undefined,
      status: "active",
      customFieldsArray: [{ key: "", value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "customFieldsArray",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: assetApi.createAsset,
    onSuccess: (data: {
      response?: { data?: { error?: string } };
      message?: string;
    }) => {
      toast.show({
        message: data?.message || "Asset created successfully",
        type: "success",
      });

      reset();
      onClose?.();
    },
    onError: (err: {
      response?: { data?: { error?: string } };
      message?: string;
    }) => {
      const errorMessage =
        err?.response?.data?.error || err?.message || "Failed to create asset";
      toast.show({
        message: errorMessage,
        type: "error",
      });
    },
  });
  const onSubmit = (data: AssetFormData) => {
    if (!data.business_id) {
      toast.show({
        message: "Business ID missing",
        type: "error",
      });
      return;
    }

    const customFieldsObject = Object.fromEntries(
      (data.customFieldsArray || [])
        .filter((f) => f.key.trim() !== "" && f.value.trim() !== "")
        .map((f) => [f.key.trim(), f.value.trim()]),
    );

    const formData = new FormData();

    formData.append("business_id", businessId);
    formData.append("name", data.name);
    formData.append("type", data.type);
    formData.append("price", String(data.price));
    formData.append("status", data.status);

    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }

    formData.append("customFields", JSON.stringify(customFieldsObject));

    mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={clsx(
          "bg-white rounded-lg shadow-lg w-full h-[95vh] overflow-y-scroll",
          {
            "max-w-md": size === "sm",
            "max-w-lg": size === "md",
            "max-w-3xl": size === "lg",
            "max-w-5xl": size === "xl",
          },
        )}
      >
        {/* HEADER */}
        <FormHeader onClose={() => onClose?.()} />

        {/* FORM */}
        <div className="p-6 text-[13px]">
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

                <select
                  {...register("type", {
                    required: "Asset type is required",
                  })}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Asset Type
                  </option>

                  {assetTypes.map((type: TAssetType) => (
                    <option key={type._id} value={type.typeName}>
                      {type.typeName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Asset Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register("price")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm">{errors.price.message}</p>
                )}
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium">Asset Image</label>

                <input
                  type="file"
                  accept="image/*"
                  {...register("image")}
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />

                {imagePreview && (
                  <div className="mt-3">
                    <Image
                      height={32}
                      width={32}
                      src={imagePreview}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded border"
                    />
                  </div>
                )}
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
                      {...register(`customFieldsArray.${index}.key` as const)}
                      className="col-span-2 input w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                    />

                    <input
                      placeholder="Value"
                      {...register(`customFieldsArray.${index}.value` as const)}
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
