"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

import { verifySetupToken } from "@/libs/api/auth.api";
import SetPasswordForm from "./SetPasswordForm";

type AccountData = {
  accountId: string;
  accountName: string;
  accountEmail: string;
};

function WelcomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [status, setStatus] = useState<
    "loading" | "verified" | "error"
  >("loading");

  const [accountData, setAccountData] =
    useState<AccountData | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("No token provided. Invalid welcome link.");
      return;
    }

    const verifyToken = async () => {
      try {
        setStatus("loading");

        const response = await verifySetupToken(token);

        if (response.success) {
          setAccountData({
            accountId: response.accountId,
            accountName: response.accountName,
            accountEmail: response.accountEmail,
          });

          setStatus("verified");
        } else {
          setError(
            response.error || "Token verification failed"
          );

          setStatus("error");
        }
      } catch (err: unknown) {
        const errorMsg =
          (err as { response?: { data?: { error?: string } } })
            .response?.data?.error ||
          (err as { message?: string }).message ||
          "Failed to verify token";

        setError(errorMsg);
        setStatus("error");
      }
    };

    verifyToken();
  }, [token]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />

          <h2 className="text-lg font-semibold text-gray-800">
            Verifying Your Setup Link
          </h2>

          <p className="text-sm text-gray-600 mt-2">
            Please wait while we validate your account...
          </p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>

          <h2 className="text-lg font-bold text-gray-800 text-center mb-2">
            Setup Link Invalid
          </h2>

          <p className="text-sm text-gray-600 text-center mb-6">
            {error}
          </p>

          <p className="text-xs text-gray-500 text-center mb-4">
            The setup link may have expired. Please request a new one
            from your admin.
          </p>

          <button
            onClick={() => router.push("/login-page")}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (status === "verified" && accountData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
        <div>
          <div className="text-center mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-800">
              Welcome to FlowDesk
            </h1>

            <p className="text-gray-600 mt-2">
              Your account has been verified. Now let&apos;s set up
              your password.
            </p>
          </div>

          <SetPasswordForm
            token={token || ""}
            accountName={accountData.accountName}
            accountEmail={accountData.accountEmail}
          />
        </div>
      </div>
    );
  }

  return null;
}

export default function WelcomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />

            <h2 className="text-lg font-semibold text-gray-800">
              Loading...
            </h2>
          </div>
        </div>
      }
    >
      <WelcomeContent />
    </Suspense>
  );
}