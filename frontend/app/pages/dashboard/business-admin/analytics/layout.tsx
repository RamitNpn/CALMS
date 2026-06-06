"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute
      allowedRoles={["business", "staff"]}
      allowedPermissions={["reports:view"]}
    >
      {children}
    </ProtectedRoute>
  );
}
