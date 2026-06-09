"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useBusinessById } from "@/hooks/super-admin/business-records/getBusinessRecordById";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { businessApi } from "@/libs";
import { useToast } from "@/components";

type AdminProfileForm = {
  businessName: string;
  operatorName: string;
  operatorEmail: string;
  operatorPassword: string;
  businessType: string;
  teams: string;
  branch: {
    name: string;
    location: string;
  };
  package: "starter" | "growth" | "enterprise";
  profile?: string;
};

export default function AdminProfilePage() {
  const [businessId] = useState<string>(() => {
    const storedData = JSON.parse(localStorage.getItem("auth-data") || "{}");
    return storedData?.business_id;
  });

  const toast = useToast.getState();

  const { data: profileData } = useBusinessById(businessId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminProfileForm>();

  useEffect(() => {
    if (!profileData) return;

    reset({
      businessName: profileData.businessName || "",
      operatorName: profileData.operatorName || "",
      operatorEmail: profileData.operatorEmail || "",
      businessType: profileData.businessType || "",
      teams: profileData.teams || "",
      branch: {
        name: profileData.branch?.name || "",
        location: profileData.branch?.location || "",
      },
      package: profileData.package || "starter",
      profile: profileData.profile || "",
    });
  }, [profileData, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: AdminProfileForm) =>
      businessApi.updateBusinessApi(businessId, payload),
    onSuccess: (data: any) => {
      toast.show({
        message: data?.message || "Business updated successfully",
        type: "success",
      });
    },
    onError: (err: any) => {
      const errorMessage =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to update business";
      toast.show({
        message: errorMessage,
        type: "error",
      });
    },
  });

  const onSubmit = (values: AdminProfileForm) => {
    mutate(values);
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Admin Profile</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />

          <div className="px-6 pb-6">
            <div className="-mt-12 flex items-end gap-4">
              <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-100 overflow-hidden">
                {profileData?.profile ? (
                  <Image
                    height={24}
                    width={24}
                    src={profileData.profile}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-3xl font-bold">
                    {profileData?.businessName?.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-2xl font-bold">
                  {profileData?.businessName}
                </h1>

                <p className="text-gray-500">{profileData?.operatorEmail}</p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  profileData?.status
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {profileData?.status ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded text-[13px] p-6">
          <h2 className="text-lg font-semibold mb-4">Business Information</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Business Name</label>

              <input
                {...register("businessName", {
                  required: "Business name is required",
                })}
                className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
              />

              {errors.businessName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.businessName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Business Type</label>

              <input
                {...register("businessType")}
                className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
              />

              {errors.businessType && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.businessType.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded text-[13px] p-6">
          <h2 className="text-lg font-semibold mb-4">Security</h2>

          <div>
            <label className="block text-sm font-medium">New Password</label>

            <input
              type="password"
              {...register("operatorPassword", {
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
            />

            {errors.operatorPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.operatorPassword.message}
              </p>
            )}
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded p-4">
          <h2 className="font-semibold mb-4">Account Information</h2>

          <div className="grid md:grid-cols-2 gap-4 text-[13px]">
            <div>
              <span className="text-gray-500">Role</span>
              <p className="capitalize">{profileData?.role}</p>
            </div>

            <div>
              <span className="text-gray-500">Payment Status</span>
              <p>{profileData?.payment_status ? "Paid" : "Pending"}</p>
            </div>

            <div>
              <span className="text-gray-500">Created At</span>
              <p>{new Date(profileData?.createdAt).toLocaleDateString()}</p>
            </div>

            <div>
              <span className="text-gray-500">Last Updated</span>
              <p>{new Date(profileData?.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="px-2 py-[5px] bg-gray-600 cursor-pointer text-white rounded hover:bg-gray-700 disabled:opacity-50"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving Changes...
            </span>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}
