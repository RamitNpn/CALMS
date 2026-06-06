"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function TokenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute
      allowedRoles={["business", "staff"]}
      allowedPermissions={["token_management:view"]}
    >
      {children}
    </ProtectedRoute>
  );
}
