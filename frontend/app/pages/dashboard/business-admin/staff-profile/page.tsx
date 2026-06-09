"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useStaffById } from "@/hooks/business-admin/staff-management/getStaffDataById";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { staffApi } from "@/libs";
import { useToast } from "@/components";

type StaffProfileForm = {
  userName: string;
  userEmail: string;
  userPhone: string;
  gender?: string;
  citizenship?: string;
  license?: string;
  certificate?: string;
  profile?: string;
  userPassword?: string;
};

export default function StaffProfilePage() {
  const [citizenshipFile, setCitizenshipFile] = useState<File | null>(null);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);

  const [staffId] = useState<string>(() => {
    const storedData = JSON.parse(localStorage.getItem("auth-data") || "{}");
    return storedData?.id;
  });

  const toast = useToast.getState();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StaffProfileForm>();

  const { data: profileData } = useStaffById(staffId);

  useEffect(() => {
    if (!profileData) return;

    reset({
      userName: profileData.userName || "",
      userEmail: profileData.userEmail || "",
      userPhone: profileData.userPhone || "",
      gender: profileData.gender || "",
      citizenship: profileData.citizenship || "",
      license: profileData.license || "",
      certificate: profileData.certificate || "",
      profile: profileData.profile || "",
    });
  }, [profileData, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      staffId,
      formData,
    }: {
      staffId: string;
      formData: FormData;
    }) => staffApi.updateStaffApi(staffId, formData),
    onSuccess: (data: any) => {
      toast.show({
        message: data?.message || "Staff updated successfully",
        type: "success",
      });
    },
    onError: (err: any) => {
      const errorMessage =
        err?.response?.data?.error || err?.message || "Failed to update staff";
      toast.show({
        message: errorMessage,
        type: "error",
      });
    },
  });

  const onSubmit = (values: StaffProfileForm) => {
    if (!staffId) return;

    const formData = new FormData();

    formData.append("userName", values.userName || "");
    formData.append("userEmail", values.userEmail || "");
    formData.append("userPhone", values.userPhone || "");
    formData.append("gender", values.gender || "");

    if (values.userPassword) {
      formData.append("userPassword", values.userPassword);
    }

    if (citizenshipFile) {
      formData.append("citizenship", citizenshipFile);
    }

    if (licenseFile) {
      formData.append("license", licenseFile);
    }

    if (certificateFile) {
      formData.append("certificate", certificateFile);
    }

    mutate({ staffId, formData });
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Staff Profile</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-600" />

          <div className="px-6 pb-6">
            <div className="-mt-12 flex items-end gap-4">
              <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-100 overflow-hidden">
                {profileData?.profile ? (
                  <Image
                    src={profileData.profile}
                    alt="Profile"
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-3xl font-bold">
                    {profileData?.userName?.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-2xl font-bold">{profileData?.userName}</h1>

                <p className="text-gray-500">{profileData?.userEmail}</p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                {profileData?.role?.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded text-[13px] p-6">
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Full Name</label>

              <input
                {...register("userName", {
                  required: "Name is required",
                })}
                className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
              />

              {errors.userName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.userName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Gender</label>

              <select
                {...register("gender")}
                className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded text-[13px] p-6">
          <h2 className="text-lg font-semibold mb-4">Contact Information</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Email</label>

              <input
                {...register("userEmail")}
                className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Phone Number</label>

              <input
                {...register("userPhone")}
                className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
              />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded text-[13px] p-6">
          <h2 className="text-lg font-semibold mb-4">Documents</h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Citizenship
              </label>

              {profileData?.citizenship && (
                <Image
                  height={40}
                  width={40}
                  src={profileData.citizenship}
                  alt="Citizenship"
                  className="w-full h-40 object-cover rounded border border-gray-200 mb-2"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setCitizenshipFile(e.target.files?.[0] || null)
                }
                className="w-full border border-gray-200 p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">License</label>

              {profileData?.license && (
                <Image
                  height={40}
                  width={40}
                  src={profileData.license}
                  alt="License"
                  className="w-full h-40 object-cover rounded border border-gray-200 mb-2"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
                className="w-full border border-gray-200 p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Certificate
              </label>

              {profileData?.certificate && (
                <Image
                  height={40}
                  width={40}
                  src={profileData.certificate}
                  alt="Certificate"
                  className="w-full h-40 object-cover rounded border border-gray-200 mb-2"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setCertificateFile(e.target.files?.[0] || null)
                }
                className="w-full border border-gray-200 p-2 rounded"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded text-[13px] p-6">
          <h2 className="text-lg font-semibold mb-4">Security</h2>

          <div>
            <label className="block text-sm font-medium">New Password</label>

            <input
              type="password"
              {...register("userPassword", {
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
            />

            {errors.userPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.userPassword.message}
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
              <span className="text-gray-500">Business ID</span>
              <p>{profileData?.business_id}</p>
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
