"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function RevenueLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute
      allowedRoles={["business", "staff"]}
      allowedPermissions={["revenue_management:view"]}
    >
      {children}
    </ProtectedRoute>
  );
}
