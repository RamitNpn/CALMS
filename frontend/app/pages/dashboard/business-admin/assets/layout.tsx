"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function AssetsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute
      allowedRoles={["business", "staff"]}
      allowedPermissions={["asset_management:view"]}
    >
      {children}
    </ProtectedRoute>
  );
}
