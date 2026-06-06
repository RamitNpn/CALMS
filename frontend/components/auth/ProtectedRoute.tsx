"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "business" | "staff" | "client")[];
  allowedPermissions?: string[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
  allowedPermissions,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, authData } = useAuth();
  const router = useRouter();

  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    if (allowedRoles && authData) {
      const hasRole = authData.role.some((role) =>
        allowedRoles.includes(role as any)
      );
      if (!hasRole) {
        router.push("/pages/dashboard/business-admin");
        return;
      }
    }

    if (allowedPermissions && authData) {
      const hasPermission = authData.permissions?.some((permission) =>
        allowedPermissions.includes(permission)
      );
      if (!hasPermission) {
        setPermissionDenied(true);
        return;
      }
    }
  }, [isAuthenticated, isLoading, authData, allowedRoles, allowedPermissions, router]);

  if (permissionDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-lg rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <h1 className="text-xl font-semibold text-red-700">Access denied</h1>
          <p className="mt-3 text-sm text-red-600">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
