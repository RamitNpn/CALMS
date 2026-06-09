"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute
      allowedRoles={["business", "staff"]}
      allowedPermissions={["billing_management:view"]}
    >
      {children}
    </ProtectedRoute>
  );
}
