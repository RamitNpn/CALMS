"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute
      allowedRoles={["business", "staff"]}
      allowedPermissions={["business_management:view"]}
    >
      {children}
    </ProtectedRoute>
  );
}
