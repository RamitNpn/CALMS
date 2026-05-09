"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { loginUser } from "@/libs/api/auth.api";
import { LoginFormValues, loginSchema } from "@/libs/validation/login.validation";
import { useToast } from "../ui/toast";

export default function LoginForm() {
  const router = useRouter();
  const toast = useToast.getState();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,

    onSuccess: (data) => {
      toast.show({
        message: "Login success:",
        type: "success",
      });

      // TODO: store token (localStorage/cookies)
      localStorage.setItem("token", data.token);
      localStorage.setItem("auth-data", JSON.stringify(data));

      // Example role-based redirect
      if (data.role === "admin") {
        router.push("/pages/dashboard/super-admin");
      } else if (data.role === "business") {
        router.push("/pages/dashboard/business-admin");
      } else if (data.role === "staff") {
        router.push("/pages/dashboard/staff-portal");
      } else {
        router.push("/pages/dashboard/client-portal");
      }
    },

    onError: (error: unknown) => {
      console.error("Login failed:", (error as { message?: string })?.message);

      // TODO: show toast
      toast.show({
        message: (error as { message?: string })?.message || "Login failed",
        type: "error",
      });
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutate(data);
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Welcome Back 👋
      </h2>

      <p className="text-sm text-gray-500 mb-6">
        Login to continue managing your business
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="Enter your email"
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            placeholder="Enter your password"
            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="flex justify-between items-center text-sm">
          <a
            href="/forgot-password"
            className="text-indigo-600 hover:underline"
          >
            Forgot password?
          </a>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          {isPending ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 border-t text-center text-sm text-gray-400">
        <span className="bg-white px-2 relative -top-3">
          New here?
        </span>
      </div>

      {/* Register Business */}
      <a
        href="/pages/register-page"
        className="block text-center w-full border border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 transition"
      >
        Register Business
      </a>
    </div>
  );
}