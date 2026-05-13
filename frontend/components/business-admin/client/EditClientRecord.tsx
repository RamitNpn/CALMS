"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/components/ui/toast";
import clsx from "clsx";
import { X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { clientApi } from "@/libs/api/client.api";
import { updateClientSchema } from "@/libs/validation/client.validation";
import Image from "next/image";
import { useClientById } from "@/hooks/business-admin/client-management/getClientDataById";

type ClientForm = z.infer<typeof updateClientSchema>;

type Props = {
  clientId: string;
  onClose: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export function EditClientForm({ clientId, onClose, size = "lg" }: Props) {
  const toast = useToast.getState();
  const { data, isLoading, isError } = useClientById(clientId);
  const client = data?.data ?? data;

  const storedData = JSON.parse(localStorage.getItem("auth-data") || "{}");
  const businessId = storedData?.business_id || "";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ClientForm>({
    resolver: zodResolver(updateClientSchema),
    defaultValues: {
      _id: clientId,
      business_id: businessId,
      userName: "",
      userEmail: "",
      userPhone: "",
      userPassword: "",
      profile: "",
      certificate: "",
      citizenship: "",
      license: "",
      gender: undefined,
      role: "client",
    },
  });

  useEffect(() => {
    if (!clientId || !client) return;

    reset({
      _id: clientId,
      business_id: client.business_id,
      userName: client.userName ?? "",
      userEmail: client.userEmail ?? "",
      userPhone: client.userPhone ?? "",
      userPassword: "",
      certificate: "",
      citizenship: "",
      license: "",
      profile: "",
      gender: client.gender ?? undefined,
      role: client.role ?? "client",
    });
  }, [clientId, client, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      clientId,
      formData,
    }: {
      clientId: string;
      formData: FormData;
    }) => clientApi.updateClientApi(clientId, formData),
    onSuccess: (data: any) => {
      toast.show({
        message: data?.message || "Client updated successfully",
        type: "success",
      });
      onClose();
    },
    onError: (err: any) => {
      const errorMessage = err?.response?.data?.error || err?.message || "Failed to update client";
      toast.show({
        message: errorMessage,
        type: "error",
      });
    },
  });

  const onSubmit = (values: ClientForm) => {
    const formData = new FormData();

    formData.append("_id", clientId);

    if (values.userName) formData.append("userName", values.userName);
    if (values.userEmail) formData.append("userEmail", values.userEmail);
    if (values.userPhone) formData.append("userPhone", values.userPhone);
    if (values.role) formData.append("role", values.role);

    if (values.userPassword?.trim()) {
      formData.append("userPassword", values.userPassword);
    }

    if (values.gender) {
      formData.append("gender", values.gender);
    }

    if (values.profile?.[0]) {
      formData.append("profile", values.profile[0]);
    }

    if (values.citizenship?.[0]) {
      formData.append("citizenship", values.citizenship[0]);
    }

    if (values.license?.[0]) {
      formData.append("license", values.license[0]);
    }

    if (values.certificate?.[0]) {
      formData.append("certificate", values.certificate[0]);
    }

    mutate({ clientId, formData });
  };

  if (isLoading) return <div className="p-6">Loading client...</div>;
  if (isError)
    return <div className="p-6 text-red-500">Failed to load client</div>;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={clsx(
          "bg-white rounded-lg shadow-lg h-[90vh] overflow-y-auto w-full",
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
            Flowdesk - Edit Client Details
          </h2>

          <button onClick={onClose}>
            <X className="text-red-500 cursor-pointer" />
          </button>
        </div>

        {/* FORM */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <p className="text-xl font-semibold">Edit Client Account</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* USER NAME */}
              <div>
                <label className="block text-sm font-medium">
                  Client Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("userName")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
                {errors.userName && (
                  <p className="text-red-500 text-sm">
                    {errors.userName.message}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register("userEmail")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="block text-sm font-medium">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("userPhone")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  {...register("userPassword")}
                  placeholder="Leave empty if unchanged...."
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                />
              </div>

              {/* GENDER */}
              <div>
                <label className="block text-sm font-medium">Gender</label>
                <select
                  {...register("gender")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* PROFILE */}
              <div>
                <p className="text-sm font-medium mb-1">Profile Image</p>
                {client?.profile && (
                  <Image
                    src={client.profile || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s"}
                    className="w-20 h-20 rounded mb-2"
                    width={80}
                    height={80}
                    alt="Profile"
                  />
                )}
                <input
                  type="file"
                  onChange={(e) => setValue("profile", e.target.files)}
                />
              </div>

              {/* CITIZENSHIP */}
              <div>
                <p className="text-sm font-medium mb-1">Citizenship</p>
                {client?.citizenship && (
                  <Image
                    src={client.citizenship || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s"}
                    className="w-20 h-20 rounded mb-2"
                    width={80}
                    height={80}
                    alt="Citizenship"
                  />
                )}
                <input
                  type="file"
                  onChange={(e) => setValue("citizenship", e.target.files)}
                />
              </div>

              {/* LICENSE */}
              <div>
                <p className="text-sm font-medium mb-1">License</p>
                {client?.license && (
                  <Image
                    src={client.license || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s"}
                    width={80}
                    height={80}
                    alt="License"
                    className="w-20 h-20 rounded mb-2"
                  />
                )}
                <input
                  type="file"
                  onChange={(e) => setValue("license", e.target.files)}
                />
              </div>

              {/* CERTIFICATE */}
              <div className="md:col-span-2">
                <p className="text-sm font-medium mb-1">Certificate</p>
                {client?.certificate && (
                  <Image
                    src={client.certificate || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjCoUtOal33JWLqals1Wq7p6GGCnr3o-lwpQ&s"}
                    alt="Certificate"
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded mb-2"
                  />
                )}
                <input
                  type="file"
                  onChange={(e) => setValue("certificate", e.target.files)}
                />
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 bg-blue-600 text-white rounded cursor-pointer"
              >
                {isPending ? "Updating..." : "Update Client"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
