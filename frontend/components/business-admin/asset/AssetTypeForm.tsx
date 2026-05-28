"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import clsx from "clsx";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";
import { TCreateAssetType } from "@/libs/types/assetType.types";
import { assetTypeApi } from "@/libs/api/assetType.api";

type AssetTypeFormProps = {
  onClose?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export function AssetTypeForm({ onClose, size = "lg" }: AssetTypeFormProps) {
  const storedData = JSON.parse(localStorage.getItem("auth-data") || "{}");

  const toast = useToast.getState();

  const businessId = storedData?.business_id;

  if (!businessId) {
    console.error("Missing business_id");
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TCreateAssetType>({
    defaultValues: {
      business_id: businessId,
      typeName: "",
      description: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: assetTypeApi.createAssetType,
    onSuccess: (data: any) => {
      toast.show({
        message: data?.message || "Asset type created successfully",
        type: "success",
      });

      reset();
      onClose?.();
    },
    onError: (err: any) => {
      const errorMessage =
        err?.response?.data?.error || err?.message || "Failed to create asset type";
      toast.show({
        message: errorMessage,
        type: "error",
      });
    },
  });
  const onSubmit = (data: TCreateAssetType) => {
    if (!data.business_id) {
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
          <h2 className="text-xl font-semibold">Create Asset Types</h2>
          <button onClick={onClose}>
            <X className="text-red-500 border border-gray-200 cursor-pointer hover:bg-red-500 hover:text-white rounded" />
          </button>
        </div>

        {/* FORM */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <p className="text-xl font-semibold">
                Create Business Asset Type
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium">
                  Asset Type Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("typeName", { required: "Name is required" })}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
                {errors.typeName && (
                  <p className="text-red-500 text-sm">{errors.typeName.message}</p>
                )}
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium">
                  Asset Type Description <span className="text-red-500">*</span>
                </label>

                <input
                  {...register("description", {
                    required: "Description is required",
                  })}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />

                {errors.description && (
                  <p className="text-red-500 text-sm">
                    {errors.description.message}
                  </p>
                )}
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
