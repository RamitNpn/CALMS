"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Mail,
  ShieldCheck,
  Briefcase,
  Users,
  GitBranch,
  Package,
  Wrench,
  CalendarDays,
  Pencil,
  Save,
  User,
  Settings,
  ActivitySquare,
  Camera,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";

import { businessApi } from "@/libs/api/business.api";
import { useBusinessById } from "@/hooks/super-admin/business-records/getBusinessRecordById";
import { z } from "zod";
import user from "@/public/user.png";

import {
  TUpdateBusinessSchema,
  updateBusinessSchema,
} from "@/libs/validation/business.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@/libs/types/error.types";
import TabNavigation from "@/components/shared/TabNavigation";
type Props = {
  businessId: string;
};

type BusinessForm = z.infer<typeof updateBusinessSchema>;

export default function BusinessProfilePage({ businessId }: Props) {
  const queryClient = useQueryClient();
  const toast = useToast.getState();

  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading, isError } = useBusinessById(businessId);

  const business = data?.data ?? data;

  const [activeTab, setActiveTab] = useState("profile");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const tabs = [
    { id: "profile", label: "Profile Management", icon: <User size={16} /> },
    { id: "customize", label: "Customize", icon: <Settings size={16} /> },
    { id: "logs", label: "Log Details", icon: <ActivitySquare size={16} /> },
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BusinessForm>({
    resolver: zodResolver(updateBusinessSchema),
    defaultValues: {
      _id: "",
      businessName: "",
      operatorName: "",
      operatorEmail: "",
      operatorPassword: "",
      businessType: "",
      profile: "",
      role: "business",
      teams: "",
      branch: {
        name: "",
        location: "",
      },
      package: "starter",
      services: [],
      status: true,
      payment_status: false,
      payment_initiation: "",
    },
  });

  useEffect(() => {
    if (!businessId || !business) return;

    console.log("RESETTING FORM WITH:", business);

    reset({
      _id: business._id,
      businessName: business.businessName ?? "",
      operatorName: business.operatorName ?? "",
      operatorEmail: business.operatorEmail ?? "",
      operatorPassword: "",
      businessType: business.businessType ?? "",
      profile: business.profile ?? "",
      role: "business",
      teams: business.teams ?? "",
      branch: {
        name: business.branch?.name ?? "",
        location: business.branch?.location ?? "",
      },
      package: business.package ?? "starter",
      services: Array.isArray(business.services) ? business.services : [],
      status: business.status ?? true,
      payment_status: business.payment_status ?? false,
      payment_initiation: business.payment_initiation
        ? new Date(business.payment_initiation).toISOString().split("T")[0]
        : "",
    });
  }, [businessId, business, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) => {
      return businessApi.updateBusinessApi(businessId, data);
    },

    onSuccess: (response) => {
      console.log("UPDATE SUCCESS:", response);
      toast.show({
        message: response?.message || "Business profile updated successfully!",
        type: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["business", businessId],
      });

      setIsEditing(false);
    },

    onError: (error: unknown) => {
      console.error("UPDATE ERROR:", error);
      const errorMessage =
        (error as ApiError)?.response?.data?.error ||
        (error as ApiError)?.response?.data?.message ||
        (error as { message?: string })?.message ||
        "Failed to update business profile";
      toast.show({
        message: errorMessage,
        type: "error",
      });
    },
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }

    setSelectedImage(file);

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
  };

  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const cancelImageSelection = () => {
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }

    setSelectedImage(null);
    setPreviewImage(null);
  };

  const onSubmit = async (values: BusinessForm) => {
    console.log("FORM SUBMISSION STARTED");
    console.log("FORM VALUES:", values);
    console.log("FORM ERRORS:", errors);

    try {
      // Check for any form validation errors
      if (Object.keys(errors).length > 0) {
        console.error("VALIDATION ERRORS DETECTED:", errors);
        const errorMessages = Object.entries(errors)
          .map(
            ([key, error]: [string, unknown]) =>
              `${key}: ${(error as { message?: string })?.message || "Invalid field"}`,
          )
          .join(", ");
        toast.show({
          message: `Validation errors: ${errorMessages}`,
          type: "error",
        });
        return;
      }

      // Validate branch object
      if (!values.branch || !values.branch.name || !values.branch.location) {
        const errorMsg = "Branch name and location are required";
        toast.show({
          message: errorMsg,
          type: "error",
        });
        console.error(errorMsg);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (values.operatorEmail && !emailRegex.test(values.operatorEmail)) {
        const errorMsg = "Please enter a valid email address";
        toast.show({
          message: errorMsg,
          type: "error",
        });
        console.error(errorMsg);
        return;
      }

      // Prepare data for submission
      const submitData: TUpdateBusinessSchema = {
        _id: values._id,
        businessName: values.businessName || business.businessName,
        operatorName: values.operatorName || business.operatorName,
        operatorEmail: values.operatorEmail || business.operatorEmail,
        businessType: values.businessType || business.businessType,
        profile: business.profile,
        role: values.role || "business",
        teams: values.teams || business.teams,

        branch: {
          name: values.branch.name,
          location: values.branch.location,
        },

        package: values.package || business.package,
        services: values.services,

        status: values.status !== undefined ? values.status : business.status,

        payment_status:
          values.payment_status !== undefined
            ? values.payment_status
            : business.payment_status,

        payment_initiation:
          values.payment_initiation || business.payment_initiation,
      };

      if (
        values.operatorPassword &&
        values.operatorPassword.trim().length > 0
      ) {
        if (values.operatorPassword.length < 6) {
          toast.show({
            message: "Password must be at least 6 characters",
            type: "error",
          });
          return;
        }

        submitData.operatorPassword = values.operatorPassword;
      }

      const formData = new FormData();

      Object.entries(submitData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === "object" && !(value instanceof File)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        }
      });

      if (selectedImage) {
        formData.append("profile", selectedImage);
      }

      mutate(formData);
    } catch (err: unknown) {
      console.error("SUBMISSION ERROR:", err);
      toast.show({
        message: (err as { message?: string })?.message || "An error occurred",
        type: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-gray-500 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (isError || !business) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-red-500 text-lg">Failed to load business profile</p>
      </div>
    );
  }

  return (
    <div>
      <TabNavigation
        activeTab={activeTab}
        tabs={tabs}
        onTabChange={setActiveTab}
      />

      {activeTab === "profile" && (
        <div className="min-h-screen bg-gray-100 p-6">
          {/* TOP CARD */}
          <div className="relative overflow-hidden rounded-lg bg-white text-black shadow-2xl">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10 p-8 md:p-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                {/* LEFT */}
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-md bg-gray-200 backdrop-blur flex items-center justify-center border border-white/20 shadow-lg overflow-hidden">
                      <Image
                        src={previewImage || business?.profile || user}
                        alt={business.businessName}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* CAMERA BUTTON */}
                    {isEditing && !selectedImage && (
                      <>
                        <label
                          htmlFor="profile-upload"
                          className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-black text-white flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition"
                        >
                          <Camera size={18} />
                        </label>

                        <input
                          id="profile-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProfileChange}
                        />
                      </>
                    )}

                    {/* UPDATE / CANCEL BUTTONS */}
                    {selectedImage && (
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={cancelImageSelection}
                          className="px-3 py-1 text-xs rounded-[2px] cursor-pointer bg-red-500 text-white hover:bg-red-600 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold">
                      {business.businessName}
                    </h1>

                    <p className="text-gray-800 mt-2 flex items-center gap-2">
                      <Briefcase size={16} />
                      {business.businessType}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-4">
                      <span
                        className={`px-4 py-1 rounded-full text-sm font-medium ${
                          business.status
                            ? "bg-green-500/20 text-green-600 border border-green-400/30"
                            : "bg-red-500/20 text-red-300 border border-red-400/30"
                        }`}
                      >
                        {business.status ? "Active" : "Inactive"}
                      </span>

                      <span
                        className={`px-4 py-1 rounded-full text-sm font-medium ${
                          business.payment_status
                            ? "bg-emerald-500/20 text-emerald-600 border border-emerald-400/30"
                            : "bg-yellow-500/20 text-yellow-600 border border-yellow-400/30"
                        }`}
                      >
                        {business.payment_status
                          ? "Payment Verified"
                          : "Payment Pending"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 bg-white text-gray-900 px-5 py-3 rounded font-semibold shadow-lg hover:scale-105 transition cursor-pointer"
                    >
                      <Pencil size={18} />
                      Edit Profile
                    </button>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
            {/* LEFT INFO */}
            <div className="xl:col-span-1 space-y-6">
              {/* OPERATOR */}
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-5">
                  Operator Information
                </h2>

                <div className="space-y-5">
                  <InfoCard
                    icon={<Users size={20} />}
                    title="Operator Name"
                    value={business.operatorName}
                  />

                  <InfoCard
                    icon={<Mail size={20} />}
                    title="Operator Email"
                    value={business.operatorEmail}
                  />

                  <InfoCard
                    icon={<ShieldCheck size={20} />}
                    title="Role"
                    value={
                      business.role == "admin"
                        ? "Super Admin"
                        : business.role === "business"
                          ? "Business Admin"
                          : "User Portal"
                    }
                  />
                </div>
              </div>

              {/* STATS */}
              <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-5">
                  Business Statistics
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <StatCard
                    icon={<GitBranch size={22} />}
                    title="Branch"
                    value={business.branch?.name || "N/A"}
                  />

                  <StatCard
                    icon={<Package size={22} />}
                    title="Package"
                    value={String(business.package)}
                  />

                  <StatCard
                    icon={<Users size={22} />}
                    title="Teams"
                    value={business.teams}
                  />

                  <StatCard
                    icon={<Wrench size={22} />}
                    title="Services"
                    value={
                      Array.isArray(business.services)
                        ? business.services.length
                        : 0
                    }
                  />
                </div>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="xl:col-span-2">
              <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
                {/* HEADER */}
                <div className="border-b border-gray-100 p-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Business Details
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Manage and update your business information
                  </p>
                </div>

                {/* FORM */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="p-6 space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Business Name"
                      register={register("businessName")}
                      disabled={!isEditing}
                      error={errors.businessName?.message}
                    />

                    <InputField
                      label="Business Type"
                      register={register("businessType")}
                      disabled={!isEditing}
                      error={errors.businessType?.message}
                    />

                    <InputField
                      label="Operator Name"
                      register={register("operatorName")}
                      disabled={!isEditing}
                      error={errors.operatorName?.message}
                    />

                    <InputField
                      label="Operator Email"
                      register={register("operatorEmail")}
                      disabled={!isEditing}
                      error={errors.operatorEmail?.message}
                    />

                    <InputField
                      label="Operator Password (Leave empty to keep current)"
                      register={register("operatorPassword")}
                      disabled={!isEditing}
                      type="password"
                      error={errors.operatorPassword?.message}
                    />

                    <InputField
                      label="Teams"
                      register={register("teams")}
                      disabled={!isEditing}
                      error={errors.teams?.message}
                    />

                    <InputField
                      label="Branch Name"
                      register={register("branch.name")}
                      disabled={!isEditing}
                      error={errors.branch?.name?.message}
                    />

                    <InputField
                      label="Branch Location"
                      register={register("branch.location")}
                      disabled={!isEditing}
                      error={errors.branch?.location?.message}
                    />

                    <InputField
                      label="Package"
                      register={register("package")}
                      disabled={true}
                      error={errors.package?.message}
                    />
                  </div>

                  {/* DATES */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <DateCard
                      title="Created At"
                      value={new Date(business.createdAt).toDateString()}
                    />

                    <DateCard
                      title="Last Updated"
                      value={new Date(business.updatedAt).toDateString()}
                    />
                  </div>

                  {/* ACTIONS */}
                  {isEditing && (
                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => {
                          reset();
                          setIsEditing(false);
                        }}
                        className="px-5 py-[8px] rounded bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={isPending}
                        className="flex items-center gap-2 px-6 py-[8px] rounded bg-gray-900 text-white hover:bg-black transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save size={18} />

                        {isPending ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === "customize" && (
        <div className="flex items-center justify-center h-[70vh]"></div>
      )}

      {activeTab === "logs" && (
        <div className="flex items-center justify-center h-[70vh]"></div>
      )}
    </div>
  );
}

/* ---------------- HELPER COMPONENTS ---------------- */

function InfoCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
      <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center">
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-[12px] text-gray-800">{value}</p>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-100 p-4">
      <div className="flex items-center justify-between">
        <div className="text-gray-700">{icon}</div>

        <span className="text-sm text-gray-400 capitalize">{title}</span>
      </div>

      <p className="mt-4 text-[12px] font-semibold text-gray-800 capitalize">
        {value}
      </p>
    </div>
  );
}

function InputField({
  label,
  register,
  disabled,
  error,
  type = "text",
}: {
  label: string;
  register: any;
  disabled?: boolean;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <input
        {...register}
        type={type}
        disabled={disabled}
        className={`w-full p-2 rounded border outline-none transition ${
          disabled
            ? "bg-gray-100 border-gray-200 text-gray-500"
            : "border-gray-300 focus:border-gray-900 bg-white"
        }`}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

function DateCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-lg p-5">
      <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center">
        <CalendarDays size={20} />
      </div>

      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
