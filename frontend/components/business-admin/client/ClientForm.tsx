"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import clsx from "clsx";
import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { clientApi } from "@/libs/api/client.api";
import { TCreateClient } from "@/libs/types/client.types";
import { createClientSchema } from "@/libs/validation/client.validation";

type ClientFormProps = {
  onClose?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export function ClientForm({ onClose, size = "lg" }: ClientFormProps) {
  const storedData = JSON.parse(localStorage.getItem("auth-data") || "{}");

  const businessId = storedData?.business_id || "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      business_id: businessId,
      userName: "",
      userEmail: "",
      userPhone: "",
      userPassword: "",
      gender: undefined,
      certificate: "",
      citizenship: "",
      license: "",
      profile: "",
      role: "client",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: clientApi.createClient,
    onSuccess: () => {
      reset();
      onClose?.();
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const onSubmit = (data: TCreateClient) => {
    const formData = new FormData();

    formData.append("business_id", businessId);
    formData.append("userName", data.userName);
    formData.append("userEmail", data.userEmail);
    formData.append("userPhone", data.userPhone);
    formData.append("userPassword", data.userPassword);
    formData.append("role", data.role);

    if (data.gender) {
      formData.append("gender", data.gender);
    }

    if (data.profile?.[0]) {
      formData.append("profile", data.profile[0]);
    }

    if (data.citizenship?.[0]) {
      formData.append("citizenship", data.citizenship[0]);
    }

    if (data.license?.[0]) {
      formData.append("license", data.license[0]);
    }

    if (data.certificate?.[0]) {
      formData.append("certificate", data.certificate[0]);
    }

    mutate(formData as unknown as TCreateClient);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={clsx(
          "bg-white rounded-lg shadow-lg h-auto overflow-y-auto w-full",
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
            Flowdesk - Create Client
          </h2>

          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-lg transition"
          >
            <X
              size={22}
              className="text-red-500 border border-gray-200 rounded cursor-pointer"
            />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* TITLE */}
            <div>
              <p className="text-xl font-semibold">Create Client Account</p>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* CLIENT NAME */}
              <div>
                <label className="block text-sm font-medium">
                  Client Name <span className="text-red-500">*</span>
                </label>

                <input
                  {...register("userName", {
                    required: "Client name is required",
                  })}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />

                {errors.userName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.userName.message}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium">
                  Client Email <span className="text-red-500">*</span>
                </label>

                <input
                  type="email"
                  {...register("userEmail", {
                    required: "Client email is required",
                  })}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />

                {errors.userEmail && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.userEmail.message}
                  </p>
                )}
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-sm font-medium">
                  Client Phone <span className="text-red-500">*</span>
                </label>

                <input
                  {...register("userPhone", {
                    required: "Phone number is required",
                  })}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />

                {errors.userPhone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.userPhone.message}
                  </p>
                )}
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-medium">
                  Password <span className="text-red-500">*</span>
                </label>

                <input
                  type="password"
                  {...register("userPassword", {
                    required: "Password is required",
                  })}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />

                {errors.userPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.userPassword.message}
                  </p>
                )}
              </div>

              {/* GENDER */}
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

              {/* PROFILE */}
              <div>
                <label className="block text-sm font-medium">
                  Profile Image
                </label>

                <input
                  {...register("profile")}
                  type="file"
                  className="w-full mt-1 cursor-pointer border border-gray-200 hover:border-green-400 p-2 rounded outline-none"
                />
              </div>

              {/* CITIZENSHIP */}
              <div>
                <label className="block text-sm font-medium">
                  Citizenship Image
                </label>

                <input
                  {...register("citizenship")}
                  type="file"
                  className="w-full mt-1 cursor-pointer border border-gray-200 hover:border-green-400 p-2 rounded outline-none"
                />
              </div>

              {/* LICENSE */}
              <div>
                <label className="block text-sm font-medium">
                  License Image
                </label>

                <input
                  {...register("license")}
                  type="file"
                  className="w-full mt-1 cursor-pointer border border-gray-200 hover:border-green-400 p-2 rounded outline-none"
                />
              </div>

              {/* CERTIFICATE */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium">
                  Certificate Image
                </label>

                <input
                  {...register("certificate")}
                  type="file"
                  className="w-full mt-1 cursor-pointer border border-gray-200 hover:border-green-400 p-2 rounded outline-none resize-none"
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
                className="px-5 py-2 bg-gray-700 text-white rounded cursor-pointer"
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
