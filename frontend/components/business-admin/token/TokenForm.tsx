"use client";

import React, { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";

import { X } from "lucide-react";

import {
  createTokenSchema,
  TCreateTokenSchema,
} from "@/libs/validation/token.validation";

import { useGetLatestToken } from "@/hooks/business-admin/token-management/getLatestToken";
import { tokenApi } from "@/libs/api/token.api";
import { generateTokenNumber } from "@/utils/generateTokenNumber";
import { useToast } from "@/components";

type TokenFormProps = {
  onClose?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};

export default function TokenForm({ onClose, size = "lg" }: TokenFormProps) {
  const storedData = JSON.parse(localStorage.getItem("auth-data") || "{}");

  const businessId = storedData?.business_id;

  const today = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}${mm}${dd}`;
  }, []);

  const { data: latestData } = useGetLatestToken(today);

  const latestToken = latestData?.data?.[0]?.tokenNumber;

  const generatedToken = useMemo(() => {
    if (!latestToken) return generateTokenNumber(undefined);
    return generateTokenNumber(latestToken);
  }, [latestToken]);

  console.log("Latest Token:", latestToken);
  const toast = useToast.getState();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<TCreateTokenSchema>({
    resolver: zodResolver(createTokenSchema),
    defaultValues: {
      businessId: businessId,
      tokenNumber: generatedToken,
      roundNumber: 1,
      perRoundCharge: 0,
      fullName: "",
      email: "",
      phone: "",
      vehicleCategory: "bike",
      preferredShift: undefined,
      status: "pending",
      remarks: "",
      participationDate: "",
    },
  });

  // auto token
  useEffect(() => {
    if (generatedToken) {
      setValue("tokenNumber", generatedToken);
    }
  }, [generatedToken, setValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: tokenApi.createToken,

    onSuccess: () => {
      toast.show({
        message: "Token created successfully",
        type: "success",
      });
      reset();
      onClose?.();
    },

    onError: (err: any) => {
      alert(err?.response?.data?.error || "Failed to generate token");
    },
  });

  const onSubmit = (data: TCreateTokenSchema) => {
    mutate(data);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={clsx(
          "bg-white rounded-lg shadow-lg w-full h-[90vh] overflow-y-scroll",
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
          <h2 className="text-xl font-semibold">Generate Driving Token</h2>

          <button onClick={onClose} className="p-1 rounded border border-gray-200 hover:bg-gray-200 transition cursor-pointer">
            <X className="w-4 h-4 text-red-500" />
          </button>
        </div>

        {/* FORM */}
        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-[13px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* TOKEN */}
              <div>
                <label className="text-sm font-medium">Token Number</label>
                <input
                  {...register("tokenNumber")}
                  readOnly
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none focus:border-green-500 bg-gray-100"
                />
              </div>

              {/* DATE */}
              <div>
                <label className="text-sm font-medium">
                  Participation Date
                </label>
                <input
                  type="date"
                  {...register("participationDate", {
                    valueAsDate: true,
                  })}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none focus:border-green-500"
                />
                {errors.participationDate && (
                  <p className="text-red-500 text-sm">
                    {errors.participationDate.message}
                  </p>
                )}
              </div>

              {/* NAME */}
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <input
                  {...register("fullName")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none focus:border-green-500"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  {...register("email")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none focus:border-green-500"
                />
                {errors.participationDate && (
                  <p className="text-red-500 text-sm">
                    {errors.participationDate.message}
                  </p>
                )}
              </div>

              {/* PHONE */}
              <div>
                <label className="text-sm font-medium">Phone</label>
                <input
                  {...register("phone")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none focus:border-green-500"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* VEHICLE */}
              <div>
                <label className="text-sm font-medium">Vehicle Category</label>
                <select
                  {...register("vehicleCategory")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none focus:border-green-500"
                >
                  <option value="bike">Bike</option>
                  <option value="scooter">Scooter</option>
                  <option value="car">Car</option>
                  <option value="jeep">Jeep</option>
                  <option value="bus">Bus</option>
                  <option value="truck">Truck</option>
                  <option value="other">Other</option>
                </select>
                {errors.vehicleCategory && (
                  <p className="text-red-500 text-sm">
                    {errors.vehicleCategory.message}
                  </p>
                )}
              </div>

              {/* SHIFT */}
              <div>
                <label className="text-sm font-medium">Preferred Shift</label>
                <select
                  {...register("preferredShift")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none focus:border-green-500"
                >
                  <option value="">Select</option>
                  <option value="morning">Morning</option>
                  <option value="day">Day</option>
                  <option value="evening">Evening</option>
                </select>
                {errors.preferredShift && (
                  <p className="text-red-500 text-sm">
                    {errors.preferredShift.message}
                  </p>
                )}
              </div>

              {/* ROUND */}
              <div>
                <label className="text-sm font-medium">Rounds</label>
                <input
                  type="number"
                  {...register("roundNumber", {
                    valueAsNumber: true,
                  })}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none focus:border-green-500"
                />
                {errors.roundNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.roundNumber.message}
                  </p>
                )}
              </div>

              {/* PER ROUND */}
              <div>
                <label className="text-sm font-medium">Per Round Charge</label>
                <input
                  type="number"
                  {...register("perRoundCharge", {
                    valueAsNumber: true,
                  })}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none focus:border-green-500"
                />
                {errors.perRoundCharge && (
                  <p className="text-red-500 text-sm">
                    {errors.perRoundCharge.message}
                  </p>
                )}
              </div>

              {/* STATUS */}
              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  {...register("status")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none focus:border-green-500"
                >
                  <option value="pending">Pending</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="failed">Failed</option>
                </select>
                {errors.status && (
                  <p className="text-red-500 text-sm">
                    {errors.status.message}
                  </p>
                )}
              </div>

              {/* REMARKS */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Remarks</label>
                <textarea
                  {...register("remarks")}
                  className="w-full mt-1 border border-gray-200 p-2 rounded outline-none focus:border-green-500"
                />
                {errors.remarks && (
                  <p className="text-red-500 text-sm">
                    {errors.remarks.message}
                  </p>
                )}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => reset()}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="px-5 py-2 bg-gray-800 text-white rounded"
              >
                {isPending ? "Generating..." : "Generate Token"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
