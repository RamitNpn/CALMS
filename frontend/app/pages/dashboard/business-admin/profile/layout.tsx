"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute
      allowedRoles={["business", "staff"]}
      allowedPermissions={["profile_management:view"]}
    >
      {children}
    </ProtectedRoute>
  );
}
