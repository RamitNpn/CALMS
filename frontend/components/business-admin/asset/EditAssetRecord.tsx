"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { X, Plus, Trash2 } from "lucide-react";

import { assetApi } from "@/libs/api/asset.api";
import {
  TUpdateAssetFormSchema,
  updateAssetFormSchema,
} from "@/libs/validation/asset.validation";
import { useAssetById } from "@/hooks/business-admin/asset-management/getAssetById";
import { useToast } from "@/components/ui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAllAssetTypes } from "@/hooks/business-admin/asset-management/getAllAssetTypes";
import { TAssetType } from "@/libs/types/assetType.types";
import Image from "next/image";

type AssetFormData = TUpdateAssetFormSchema;

type Props = {
  assetId: string;
  onClose: () => void;
  onSuccess?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export function EditAssetRecord({
  assetId,
  onClose,
  onSuccess,
  size = "lg",
}: Props) {
  const storedData = JSON.parse(localStorage.getItem("auth-data") || "{}");

  const businessId = storedData?.business_id;

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data, isLoading, isError } = useAssetById(assetId);
  const asset = data?.data ?? data;

  const toast = useToast.getState();

  const { data: assetTypesData } = useAllAssetTypes({
    page: 1,
    limit: 100,
    business_id: businessId,
  });

  const assetTypes = assetTypesData?.data?.data || assetTypesData?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<AssetFormData>({
    defaultValues: {
      _id: assetId,
      name: "",
      type: "",
      price: 0,
      status: "active",
      image: "",
      customFieldsArray: [{ key: "", value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "customFieldsArray",
  });

  useEffect(() => {
    if (!assetId || !asset) return;

    // Convert customFields object to array format for editing
    const customFieldsArray = asset.customFields
      ? Object.entries(asset.customFields).map(([key, value]) => ({
          key,
          value: String(value),
        }))
      : [{ key: "", value: "" }];

    console.log(
      "ASSET LOADED - CUSTOM FIELDS COUNT:",
      customFieldsArray.length,
    );
    console.log("ASSET LOADED - CUSTOM FIELDS:", customFieldsArray);

    reset({
      _id: assetId,
      name: asset.name ?? "",
      type: asset.type ?? "",
      price: asset.price ?? 0,
      status: asset.status ?? "active",
      customFieldsArray,
    });

    if (asset?.image) {
      setImagePreview(asset.image);
    }

    console.log("FORM RESET WITH", customFieldsArray.length, "CUSTOM FIELDS");
  }, [assetId, asset, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({ assetId, data }: { assetId: string; data: FormData }) => {
      return assetApi.updateAssetApi(assetId, data);
    },
    onSuccess: () => {
      toast.show({
        message: "Asset updated successfully",
        type: "success",
      });
      onSuccess?.();
      onClose();
    },
    onError: (err) => {
      console.error("Update failed:", err);
      toast.show({
        message: "Failed to update asset",
        type: "error",
      });
    },
  });

  const onSubmit = (values: AssetFormData) => {
    const customFieldsArray = values.customFieldsArray || [];

    const filteredFields = customFieldsArray.filter((f) => {
      const hasKey = f.key?.trim();
      const hasValue = f.value?.trim();
      return hasKey && hasValue;
    });

    const customFieldsObject = Object.fromEntries(
      filteredFields.map((f) => [f.key.trim(), f.value.trim()]),
    );

    const formData = new FormData();

    formData.append("name", values.name.trim());
    formData.append("type", values.type.trim());
    formData.append("price", String(values.price || 0));
    formData.append("status", values.status || "active");

    formData.append("customFields", JSON.stringify(customFieldsObject));

    if (values.image?.[0]) {
      formData.append("image", values.image[0]);
    }

    mutate({
      assetId,
      data: formData,
    });
  };

  if (isLoading) return <div className="p-6">Loading asset...</div>;
  if (isError)
    return <div className="p-6 text-red-500">Failed to load asset</div>;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={clsx(
          "bg-white rounded-lg shadow-lg h-[95vh] overflow-y-scroll w-full",
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
            Flowdesk - Edit Asset Details
          </h2>

          <button
            onClick={onClose}
            className="p-1 rounded border border-gray-200 hover:bg-gray-200 transition cursor-pointer"
          >
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>

        {/* FORM */}
        <div className="p-6 text-[13px]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <p className="text-xl font-semibold">Edit Asset Information</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ASSET NAME */}
              <div>
                <label className="block text-sm font-medium">
                  Asset Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("name", { required: "Asset name is required" })}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              {/* ASSET TYPE */}
              <div>
                <label className="block text-sm font-medium">
                  Asset Type <span className="text-red-500">*</span>
                </label>

                <select
                  {...register("type", {
                    required: "Asset type is required",
                  })}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                  defaultValue={asset?.type || ""}
                >
                  <option value="" disabled>
                    Select Asset Type
                  </option>

                  {Array.isArray(assetTypes) &&
                    assetTypes.map((type: TAssetType) => (
                      <option key={type._id} value={type.typeName}>
                        {type.typeName}
                      </option>
                    ))}
                </select>

                {errors.type && (
                  <p className="text-red-500 text-sm">{errors.type.message}</p>
                )}
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

              {/* STATUS */}
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
                      alt="Asset Preview"
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
                  className="flex items-center gap-1 text-sm bg-gray-800 cursor-pointer text-white px-3 py-1 rounded hover:bg-gray-700"
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
                      className="col-span-2 w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                    />

                    <input
                      placeholder="Value"
                      {...register(`customFieldsArray.${index}.value` as const)}
                      className="col-span-2 w-full mt-1 border border-gray-200 p-2 rounded outline-none"
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
                {isPending ? "Updating..." : "Update Asset"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
