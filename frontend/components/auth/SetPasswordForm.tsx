"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { setPassword } from "@/libs/api/auth.api";
import { SetPasswordFormValues, setPasswordSchema } from "@/libs/validation/set-password.validation";
import { useToast } from "../ui/toast";

interface SetPasswordFormProps {
  token: string;
  accountName: string;
  accountEmail: string;
}

export default function SetPasswordForm({
  token,
  accountName,
  accountEmail,
}: SetPasswordFormProps) {
  const router = useRouter();
  const toast = useToast.getState();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SetPasswordFormValues>({
    resolver: zodResolver(setPasswordSchema),
  });

  const password = watch("password");

  const { mutate, isPending } = useMutation({
    mutationFn: ({ password, confirmPassword }: SetPasswordFormValues) =>
      setPassword(token, password, confirmPassword),

    onSuccess: () => {
      toast.show({
        message: "Password set successfully! Redirecting to login...",
        type: "success",
      });

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/");
      }, 2000);
    },

    onError: (error: unknown) => {
      const errorMessage = (error as { message?: string })?.message || "Failed to set password";
      console.error("Set password failed:", errorMessage);

      toast.show({
        message: errorMessage,
        type: "error",
      });
    },
  });

  const onSubmit = (data: SetPasswordFormValues) => {
    mutate(data);
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          Create Your Password
        </h2>
        <p className="text-sm text-gray-600">
          for <span className="font-semibold">{accountName}</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">{accountEmail}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative mt-1">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Enter a strong password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
          )}
          {password && password.length >= 8 && (
            <p className="text-xs text-green-600 mt-1">✓ Password is strong</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="relative mt-1">
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 text-sm"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="text-xs font-medium text-blue-900 mb-2">Password requirements:</p>
          <ul className="text-xs text-blue-800 space-y-1">
            <li className={password?.length >= 8 ? "text-green-700" : ""}>
              {password?.length >= 8 ? "✓" : "•"} At least 8 characters
            </li>
            <li>• Mix of uppercase and lowercase letters recommended</li>
            <li>• At least one number recommended</li>
            <li>• Special characters (!@#$%^&*) recommended</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          {isPending ? "Setting Password..." : "Set Password"}
        </button>
      </form>

      <p className="text-xs text-gray-500 text-center mt-4">
        After setting your password, you&apos;ll be redirected to the login page.
      </p>
    </div>
  );
}
